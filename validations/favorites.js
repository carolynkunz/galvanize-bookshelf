'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    userId: Joi.number()
      .integer()
      .label('User ID')
      .min(0)
      .required(),

    bookId: Joi.number()
      .integer()
      .min(0)
      .label('Book Id')
      .required()
  }
};
