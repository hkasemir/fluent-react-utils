const { parse } = require('babylon');
const walk = require('babylon-walk');
const { clean, compileFtlMessages } = require('./utils');

module.exports = function(code) {
  let ftlRules = '';
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'decorators']
  });
  walk.simple(ast, {
    JSXElement: (node) => {
      ftlRules += compileFtlMessages(node);
    }
  });
  return clean(ftlRules);
};
