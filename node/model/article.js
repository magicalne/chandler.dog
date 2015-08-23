var nano = require('nano')('http://magiclane:qwe@localhost:5984');

var blogdb = nano.db.use('chandlerdotdog');
var type = 'article';

module.exports = function fetchAll() {
    blogdb.view('articles', 'article', {
        'type': type
    }, function(err, body) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log('body');
            console.log(body['rows']);
            return body['rows'];
        }
    });
}