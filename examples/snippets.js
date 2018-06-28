module.exports = {
  withExpressionMessage: `
    <Localized id='withExpressionMessage'>
      <span>{'this is text in an expression'}</span>
    </Localized>
  `,
  withLiteralMessage: `
    <Localized id='withLiteralMessage'>
      <span>
        this is text inside a span
      </span>
    </Localized>
  `,
  withMultipleMessages: `
    <div>
      <Localized id='firstMessage'>
        <span>
          say one thing
        </span>
      </Localized>
      <Localized id='secondMessage'>
        <span>
          say another thing
        </span>
      </Localized>
    </div>
  `,
  withDuplicateMessageIds: `
    <div>
      <Localized id='message1'>
        <span>
          say one thing
        </span>
      </Localized>
      <Localized id='message1'>
        <span>
          say one thing
        </span>
      </Localized>
      <Localized id='message1'>
        <span>
          say another thing
        </span>
      </Localized>
    </div>
  `,
  withDecoratorAndImport: `
  import {Localized} from 'fluent-react';
  @cssModule(styles)
  export default class Thing extends React.PureComponent {
    render() {
      return (
        <Localized id='withDecoratorAndImport'>
          <span>testing es6 and es7 module / decorator syntax</span>
        </Localized>
      );
    }
  }`,
  withCommentAndExpression: `
    <Localized id='withCommentAndExpression'>
      <span>
        {/* this is a comment */}
        {'text in an expression'}
      </span>
    </Localized>
  `,
  withMultipleExpressions: `
    <Localized id='withMultipleExpressions'>
      <span>
        {/* this is a comment */}
        {/* this is a second comment */}
        {'text in an expression'}
        {'another expression'}
        {'third expression'}
      </span>
    </Localized>
  `,
  withCommentAndLiteral: `
    <Localized id='foo'>
      <span>
        {/* comment */}
        some literal text here
      </span>
    </Localized>
  `,
  withAttributes: `
    <Localized id='foo' attrs={{placeholder: true}}>
      <input type='text' placeholder='here is some placeholder text' />
    </Localized>
  `,
  withVariables: `
    <Localized id='foo' $name='world'>
      <span>
        {'hello, { $name }'}
      </span>
    </Localized>
  `,
  withElements: `
    <Localized id='foo' click={<button />}>
      <span>
        {'click here to <click>do a thing</click>'}
      </span>
    </Localized>
  `
};
