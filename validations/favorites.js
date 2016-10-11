'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    user_id: Joi.number()
      .integer()
      .label('User ID')
      .min(0)
      .required(),

    book_id: Joi.number()
      .integer()
      .min(0)
      .label('Book Id')
      .required()
  }
};
