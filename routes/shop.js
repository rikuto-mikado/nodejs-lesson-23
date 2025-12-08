const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  // Handlebars cannot directly evaluate array.length in conditionals ({{#if prds.length}})
  // So we need to convert it to a boolean value and pass it explicitly
  res.render('shop', {prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0});
});

module.exports = router;
