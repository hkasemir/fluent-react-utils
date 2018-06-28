const fluent = require('fluent-syntax');
const { AST_NODE_TYPES, FLUENT_ATTRS } = require('./constants');
const astUtils = require('jsx-ast-utils');
const _ = require('lodash');
const prompt = require('prompt');

const {
  JSXElement,
  JSXText,
  JSXExpressionContainer,
  JSXEmptyExpression,
  StringLiteral
} = AST_NODE_TYPES;

const { attrs } = FLUENT_ATTRS;

function getLocalizationKey(localizedNode = {}) {
  const prop = astUtils.getProp(
    _.get(localizedNode, 'openingElement.attributes'),
    'id'
  );
  return _.get(prop, 'value.value');
}

function findChildNode(localizedNode = {}) {
  return _.find(localizedNode.children, { type: JSXElement });
}

function getExpressionNodes(children = []) {
  return _.filter(children, { type: JSXExpressionContainer });
}

function isNonEmptyText(node) {
  return _.get(node, 'type') === JSXText && /\w/.test(_.get(node, 'value'));
}

function getLiteralNodes(children = []) {
  return _.filter(children, isNonEmptyText);
}

function getComments(node = {}) {
  const expressionNodes = getExpressionNodes(node.children);
  const commentNodes = _.filter(
    expressionNodes,
    (n) => _.get(n, 'expression.type') === JSXEmptyExpression
  );
  return _.map(commentNodes, (n) => {
    return _.chain(n)
      .get('expression.innerComments[0].value')
      .trim()
      .value();
  });
}

function getMessages(node) {
  const literalNodes = getLiteralNodes(node.children);
  if (!_.isEmpty(literalNodes)) {
    return _.map(literalNodes, 'value');
  }
  const expressionNodes = getExpressionNodes(node.children);
  const stringNodes = _.filter(
    expressionNodes,
    (n) => _.get(n, 'expression.type') === StringLiteral
  );
  return _.map(stringNodes, 'expression.value');
}

function getAttributesList(node) {
  const attributes = astUtils.getProp(node.openingElement.attributes, attrs);
  const l10nAttrs = _.get(attributes, 'value.expression.properties');
  return _.map(l10nAttrs, 'key.name');
}

function pullLocalizedDOMAttributes(node, l10nAttrsList) {
  const attributes = _.get(node, 'openingElement.attributes');
  const l10nAttributes = _.filter(attributes, (att) =>
    _.includes(l10nAttrsList, _.get(att, 'name.name'))
  );
  return _.reduce(
    l10nAttributes,
    (ftlRules, attribute) => {
      const propName = _.get(attribute, 'name.name');
      const message = _.get(attribute, 'value.value');
      return `${ftlRules}
    .${propName} = ${message}`;
    },
    ''
  );
}

function findTranslatableMessages(node, localizationKey) {
  const childNode = findChildNode(node);
  let attributes = '';
  if (astUtils.hasProp(_.get(node, 'openingElement.attributes'), attrs)) {
    const l10nAttrsList = getAttributesList(node);
    attributes = pullLocalizedDOMAttributes(childNode, l10nAttrsList);
  }
  const comments = getComments(childNode);
  const messages = getMessages(childNode);
  const message = messages.join('\n    ');
  const comment = comments.join('\n# ');
  if (_.isEmpty(message) && _.isEmpty(attributes)) {
    const componentType = astUtils.elementType(
      _.get(childNode, 'openingElement')
    );
    const error = `STRING_IMPORT_ERROR:
     - no translated props or message provided to ${componentType}
     - add a "attrs" object with the propNames of the DOM Attributes to be translated
     - or pass in a non-empty translatable message as a child
     - check the component with the localization ID "${localizationKey}"
`;
    console.error(error);
    return { message: error };
  }
  return {
    message: _.trim(message),
    comment: _.trim(comment),
    attributes: _.trim(attributes)
  };
}

function compileFtlMessages(node) {
  if (astUtils.elementType(node.openingElement) !== 'Localized') {
    return '';
  }
  const localizationKey = getLocalizationKey(node);
  const { message, comment, attributes } = findTranslatableMessages(
    node,
    localizationKey
  );
  const commentRule = comment ? `# ${comment}\n` : '';
  const attributeRule = attributes ? `    ${attributes}` : '';
  return `${commentRule}${localizationKey} = ${message}\n${attributeRule}`;
}

function getFluentId(message) {
  return _.get(message, 'id.name');
}

function getFluentMessage(message) {
  const resource = new fluent.Resource([message]);
  return fluent.serialize(resource);
}

function dedupe(messages) {
  const unique = _.reduce(
    messages,
    (map, message) => {
      const l10nId = getFluentId(message);
      const l10nMessage = getFluentMessage(message);
      if (map.has(l10nId)) {
        const originalMessage = getFluentMessage(map.get(l10nId));
        if (originalMessage !== l10nMessage) {
          const promptString = `which string do you want (1 or 2)?
       *1: ${originalMessage}
        2: ${l10nMessage}`;
          console.log(`Duplicate id ${l10nId}`);
          prompt.start();
          prompt.get(
            [promptString],
            (err, result) => {
              if (result[promptString] === '2') {
                console.log(`setting ${l10nMessage}`);
              } else {
                console.log(`setting ${originalMessage}`);
                return map;
              }
            }
          );
        } else {
          console.log(`Duplicate id ${l10nId}, messages are the same`);
        }
      }
      map.set(l10nId, message);
      return map;
    },
    new Map()
  );
  const newBody = [...unique.values()]
  console.log(newBody)
  return newBody;
}

function clean(ftlRules) {
  // uses fluent-syntax to parse and then serialize the strings to ensure they
  // are properly formatted
  const resource = fluent.parse(ftlRules);
  const messages = _.get(resource, 'body');
  const uniqueMessages = dedupe(messages);
  return fluent.serialize(new fluent.Resource(uniqueMessages));
}

module.exports = {
  compileFtlMessages,
  clean
};
