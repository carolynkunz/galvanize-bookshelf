'use strict';

const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const validations = require('../validations/books');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      const books = camelizeKeys(rows);

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id)) {
    return next(boom.create(404, 'Not Found'));
  }
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      const book = camelizeKeys(row);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', ev(validations.post), (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body;
  const insertBook = { title, author, genre, description, coverUrl };

  knex('books')
    .insert(decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id)) {
    return next(boom.create(404, 'Not Found'));
  }
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        throw boom.create(404, 'Not Found');
      }

      const { title, author, genre, description, coverUrl } = req.body;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (coverUrl) {
        updateBook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(decamelizeKeys(updateBook), '*')
        .where('id', req.params.id);
    })
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let book;

  if (isNaN(req.params.id)) {
    return next(boom.create(404, 'Not Found'));
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      book = camelizeKeys(row);

      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete book.id;

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
