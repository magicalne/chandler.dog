var express = require('express');
var article = require('../node/model/article');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
            console.log("==================="; res.render('index', {
                    title: 'magiclane',
                    articles: article
                });
            });

        module.exports = router;