const express = require("express");
const db = require("../model");
const request = require("request");
const cheerio = require("cheerio");
const router = express.Router();

// Routes

// A GET route for scraping the nyt website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
    $("article").each(function(i, element) {

      var result = {}; // initialize result each time as {}

      // pick apart the html to get title, summary and link field values
      summary = ""
      if ($(this).find("ul").length) {
        summary = $(this).find("li").first().text();
      } else {
        summary = $(this).find("p").text();
      };

      result.title = $(this).find("h2").text();
      result.summary = summary;
      result.link = "https://www.nytimes.com" + $(this).find("a").attr("href");

      // save article to database
      var entry = new db.Article(result);
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          //console.log(doc);
        }
      });

    });
      // once complete refresh the main page
      res.redirect('/')
  });
});

router.get("/", (req, res) => {
  db.Article.find({})
    .then(function(dbArticle) {
      res.render("index", {articles: dbArticle});
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/saved", (req, res) => {
  db.Article.find({ isSaved: true })
    .then(function(retrievedArticles) {
      var articleObj;
      articleObj = {
        articles: retrievedArticles
      };
      res.render("saved", articleObj);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.put("/save/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.put("/remove/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
    .populate({
      path: "note",
      model: "Note"
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/note/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true } // needed: Otherwise we return the original which is confusing 
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.delete("/note/:id", function(req, res) {
  db.Note.findByIdAndRemove({ _id: req.params.id })
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { note: req.params.id },
        { $pullAll: [{ note: req.params.id }] }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
