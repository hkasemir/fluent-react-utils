const parse = require('../index.js');
const snippets = require('./snippets');

console.log('withExpressionMessage')
console.log(parse(snippets.withExpressionMessage));
console.log('withLiteralMessage')
console.log(parse(snippets.withLiteralMessage));
console.log('withCommentAndExpression')
console.log(parse(snippets.withCommentAndExpression));
console.log('withCommentAndLiteral')
console.log(parse(snippets.withCommentAndLiteral));
console.log('withMultipleExpressions')
console.log(parse(snippets.withMultipleExpressions));
console.log('withAttributes')
console.log(parse(snippets.withAttributes));
console.log('withDecoratorAndImport')
console.log(parse(snippets.withDecoratorAndImport));