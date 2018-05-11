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
  `
};
