var express = require('express');
var article = require('../node/model/article');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  article.then(function(val) {
    console.log(val);
    res.render('index', {
      title: 'magiclane',
      articles: val
    });
  });

});

module.exports = router;