// scrape script

// Require request and cheerio for scraping
var request = require("request");
var cheerio = require("cheerio");

// convert to date MM-DD-YYYY
var getToday = function () {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}


// scrape the NY TImes
var scrape = function (callback) {

  request("http://www.nytimes.com", function (error, response, html) {
    console.log("inside of scrape");
    var $ = cheerio.load(html);
    //console.log(html);

    // An empty array to save the scraped data 
    var articleArr = [];
    $("div.css-6p6lnl").each(function (i, element) {
      var result = {};
      result.date = getToday();
      result.title = $(this).find("h2").text();
      result.link = "https://www.nytimes.com" + $(this).find("a").attr("href");

      if (result.title !== "" && result.link !== "") {
        articleArr.push(result);
      }
    });
    //console.log("Article array length = ", articleArr.length);
    //console.log(articleArr);
    callback(articleArr);
  });
};

module.exports = scrape;