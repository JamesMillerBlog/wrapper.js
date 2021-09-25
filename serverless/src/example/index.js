'use strict';

module.exports.handler = (event, context, callback) => {
  context.succeed('hello world');
};