var nano = require('nano')('http://magiclane:qwe@localhost:5984');
var Promise = require('promise');
var blogdb = nano.db.use('chandlerdotdog');
var type = 'article';

var promise = new Promise(function(resolve, reject) {
  blogdb.view('articles', 'fetchall', {
    'type': type
  }, function(err, body) {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      resolve(body.rows);
    }
  });
});

module.exports = promise;