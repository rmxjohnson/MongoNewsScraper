// dependencies
var scrape = require("../scripts/scrape");
var Article = require("../models/Article");

// convert to date MM-DD-YYYY
// var getToday = function () {
//     var today = new Date();
//     var dd = today.getDate();
//     var mm = today.getMonth() + 1; //January is 0!
//     var yyyy = today.getFullYear();

//     if (dd < 10) {
//         dd = '0' + dd
//     }

//     if (mm < 10) {
//         mm = '0' + mm
//     }

//     today = mm + '/' + dd + '/' + yyyy;
//     return today;
// }

module.exports = {

    // call the scrape function and insert articles into the database
    fetch: function (callback) {
        console.log("inside of the scrape fetchxxx");
        scrape(function (data) {
            var articlesArr = data;
            console.log("inside of the scrape fetch");
            for (var i = 0; i < articlesArr.length; i++) {
                // articlesArr[i].date = new Date();
                // articlesArr[i].date = getToday();
                articlesArr[i].saved = false;
                articlesArr[i].note = [];
            }

            Article.collection.insertMany(articlesArr, { ordered: false }, function (err, docs) {
                callback(err, docs);
            });
        });
    },

    // find the articles saved in the database 
    get: function (query, cb) {
        Article.find(query)
            .sort({
                _id: -1
            })
            .exec(function (err, doc) {
                cb(doc);
            });
    },

    // update to add and remove an article from the "save articles"  view
    update: function (query, cb) {
        Article.update({ _id: query.id }, {
            $set: { saved: query.saved }
        }, {}, cb);
    }
}