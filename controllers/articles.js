// dependencies
var scrape = require("../scripts/scrape");
var Article = require("../models/Article");

module.exports = {

    // call the scrape function and insert articles into the database
    fetch: function (callback) {
        scrape(function (data) {
            var articlesArr = data;
            for (var i = 0; i < articlesArr.length; i++) {
                articlesArr[i].saved = false;
                articlesArr[i].note = [];
            }

            // insert new articles - ordered: false - to prevent duplicated
            Article.collection.insertMany(articlesArr, { ordered: false }, function (err, docs) {
                callback(err, docs);
            });
        });
    },

    // find the articles saved in the database using the query parameter
    get: function (query, cb) {
        Article.find(query)
            .sort({
                _id: -1
            })
            .exec(function (err, doc) {
                cb(doc);
            });
    },

    // update to add and remove an article from the "saved articles"  view
    update: function (query, cb) {
        Article.update({ _id: query.id }, {
            $set: { saved: query.saved }
        }, {}, cb);
    }
}