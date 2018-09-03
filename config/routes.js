// Server routes

// include scrape function
var scrape = require("../scripts/scrape");
var Article = require("../models/Article");
var Note = require("../models/Note");
var articlesController = require("../controllers/articles");


module.exports = function (router) {

    // Route to render the homepage
    // sort order descending by _id which will display most recent articles 1st
    router.get("/", function (req, res) {
        Article.find({ saved: false }).sort({ _id: -1 }).exec(function (err, data) {
            if (err) {
                console.log(err);
            }
            else if (data.length === 0) {
                res.render("noheadlines");
            }
            else {
                var hbsObject = {
                    articles: data
                };
                res.render("index", hbsObject);
            }
        })
    });

    // Router to render the saved articles
    router.get("/saved", function (req, res) {
        articlesController.get({ saved: true }, function (data) {

            if (data.length === 0) {
                res.render("nonesaved");
            }
            else {
                var hbsObject = {
                    articles: data
                };
                res.render("saved", hbsObject);
            }
        });
    });

    // scrape NY Times
    router.get("/api/fetch", function (req, res) {
        articlesController.fetch(function (err, docs) {

            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles to add at this time.  Check back later!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });


    // add or remove an article from the "saved" view
    router.patch("/api/articles", function (req, res) {
        articlesController.update(req.body, function (err, data) {
            res.json(data);
        });
    });

    // get all the notes associated with the article id 
    router.get("/notes/:id", function (req, res) {
        Article.findOne({ _id: req.params.id })
            .populate("note")
            .exec(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.json(doc);
                }
            });
    });

    // delete a note from it's corresponding article 
    router.get("/deletenote/:id", function (req, res) {
        Note.remove({ "_id": req.params.id }, function (err, doc) {
            if (err) {
                console.log(err);
            }
            res.redirect("/saved");
        })
    });

    // create a new note; update the Article collection by adding the new note's id to the corresponding article
    router.post("/notes/:id", function (req, res) {
        var newNote = new Note(req.body);
        console.log("newnote = ", newNote);
        console.log("newNote id = ", newNote._id);
        console.log("article id = ", req.params.id);
        newNote.save(function (err, doc) {
            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { note: doc._id } },
                { new: true },
                function (err2, doc2) {
                    if (err2) {
                        console.log(err);
                    }
                    res.send(doc2);
                });
        });
    });

}