var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

/* GET users listing. */
router.get('/detail', function(req, res, next) {
  res.render('productDetail', { title: 'Express' });
});


module.exports = router;
