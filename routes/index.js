var express = require('express');
var moment = require("moment");
var Datastore = require("nedb");
var router = express.Router();

// databases set !!
const article_news = new Datastore("./bin/articles/news.db");
article_news.loadDatabase();

const article_sport = new Datastore("./bin/articles/sport.db");
article_sport.loadDatabase();

const article_wiki = new Datastore("./bin/articles/wiki.db");
article_wiki.loadDatabase();

const catg_news = new Datastore("./bin/catgs/news.db");
catg_news.loadDatabase();

const catg_sport = new Datastore("./bin/catgs/sport.db");
catg_sport.loadDatabase();

const catg_wiki = new Datastore("./bin/catgs/wiki.db");
catg_wiki.loadDatabase();
// database end !!!!

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('dashboard/index', {
    title: 'Dashboard'
  });
});

/* GET add article page. */
router.get('/add_article', function (req, res, next) {
  res.render('dashboard/articles/add-article', {
    title: 'Add Article'
  });
});

/* GET manage articles page. */
router.get("/manage_articles", function (req, res, next) {
  res.render("dashboard/articles/manage-articles", {
    title: "Manage Articles"
  });
});


/* GET edit article page with id. */
router.get("/edit_article_:wbs/id=:id", function (req, res, next) {
  let article_db;

  if (req.params.wbs === 'news') {
    article_db = article_news;
  } else if (req.params.wbs === 'sport') {
    article_db = article_sport;
  } else if (req.params.wbs === 'wiki') {
    article_db = article_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  article_db.findOne({
    _id: req.params.id
  }, (err, data) => {
    if (err) console.log(err);
    res.render("dashboard/articles/edit-article", {
      title: `Edit Article`,
      id: req.params.id,
      website: req.params.wbs,
      arttitle: data.title,
      image: data.image,
      resume: data.resume,
      catg: data.catg,
      content: data.content
    });
  });
});

/* GET add catg page. */
router.get('/add_catg', function (req, res, next) {
  res.render('dashboard/catgs/add-catg', {
    title: 'Add catg'
  });
});

/* GET manage catgs page. */
router.get("/manage_catg", function (req, res, next) {
  res.render("dashboard/catgs/manage-catgs", {
    title: "Manage catgs"
  });
});

/* GET edit catg page with id. */
router.get("/edit_catg/id=:id/wbs=:wbs", function (req, res, next) {
  let catg_db;

  if (req.params.wbs === 'news') {
    catg_db = catg_news;
  } else if (req.params.wbs === 'sport') {
    catg_db = catg_sport;
  } else if (req.params.wbs === 'wiki') {
    catg_db = catg_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  catg_db.findOne({ _id: req.params.id}, (err, data) => {
    if (err) console.log(err);
    res.render("dashboard/catgs/edit-catg", {
      title: `Edit catg`,
      id: req.params.id,
      website: req.params.wbs,
      catg: data.catg,
    });
  });
});


/* GET manage comments page. */
router.get("/review_comments", function (req, res, next) {
  res.render("dashboard/comments/manage-comments", {
    title: "Manage comments"
  });
});

/* Api */

/* POST data to articles */
router.post("/api/add-article-:wbs", (req, res) => {
  let db_data = req.body;
  const timestamp = Date.now();
  const formated_date = moment(timestamp).format("MMM DD, YYYY");
  const formated_time = moment(timestamp).format("h:mm A");
  let article_db;

  if (req.params.wbs === 'news') {
    article_db = article_news;
  } else if (req.params.wbs === 'sport') {
    article_db = article_sport;
  } else if (req.params.wbs === 'wiki') {
    article_db = article_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  article_db.insert(db_data);
  db_data.date = formated_date;
  db_data.time = formated_time;
  db_data.unformated_time = timestamp;
  res.json({
    title: req.body.title,
    image: req.body.image,
    resume: req.body.resume,
    catg: req.body.catg,
    content: req.body.content,
    date: formated_date,
    time: formated_time,
  });
});

/* GET data from articles */
router.get('/api/get-articles-:wbs', (req, res) => {
  let article_db;

  if (req.params.wbs === 'news') {
    article_db = article_news;
  } else if (req.params.wbs === 'sport') {
    article_db = article_sport;
  } else if (req.params.wbs === 'wiki') {
    article_db = article_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  article_db.find({}, (err, data) => {
    if (err) console.log(err);
    res.json(data);
  })
});

/* Update article */
router.post("/api/update-article-:wbs", (req, res) => {
  const timestamp = Date.now();
  const formated_date = moment(timestamp).format("MMM DD, YYYY");
  const formated_time = moment(timestamp).format("h:mm A");

  let article_db;

  if (req.params.wbs === 'news') {
    article_db = article_news;
  } else if (req.params.wbs === 'sport') {
    article_db = article_sport;
  } else if (req.params.wbs === 'wiki') {
    article_db = article_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  article_db.update({ _id: req.body.id }, {
      $set: {
        title: req.body.title,
        image: req.body.image,
        resume: req.body.resume,
        catg: req.body.catg,
        content: req.body.content,
        date: formated_date,
        time: formated_time,
        unformated_time: timestamp,
      },
    },
    (err, data) => {
      if (err) res.json(err);
    }
  );
});

/* Remove article */
router.get('/api/remove-article-:wbs/id=:id', (req, res) => {
  let article_db;

  if (req.params.wbs === 'news') {
    article_db = article_news;
  } else if (req.params.wbs === 'sport') {
    article_db = article_sport;
  } else if (req.params.wbs === 'wiki') {
    article_db = article_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  article_db.remove({ _id: req.params.id }, {}, (err, data) => {
    if (err) console.log(err);
    res.send(`
      <script>
        location.replace('/manage_articles');
      </script>
    `);
  })
});


// news
/* POST data to catg */
router.post("/api/add-catg-:wbs", (req, res) => {
  let catg_db;

  if (req.params.wbs === 'news') {
    catg_db = catg_news;
  } else if (req.params.wbs === 'sport') {
    catg_db = catg_sport;
  } else if (req.params.wbs === 'wiki') {
    catg_db = catg_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  let db_data = req.body;
  catg_db.insert(db_data);
  res.json({
    website: req.body.website,
    catg: req.body.catg
  });
});

/* GET data from catg */
router.get('/api/get-catgs-:wbs', (req, res) => {
  let catg_db;

  if (req.params.wbs === 'news') {
    catg_db = catg_news;
  } else if (req.params.wbs === 'sport') {
    catg_db = catg_sport;
  } else if (req.params.wbs === 'wiki') {
    catg_db = catg_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }

  catg_db.find({}, (err, data) => {
    if (err) console.log(err);
    res.json(data);
  })
});

/* Update catg */
router.put("/api/update-catg-:wbs", (req, res) => {
  let catg_db;

  if (req.params.wbs === 'news') {
    catg_db = catg_news;
  } else if (req.params.wbs === 'sport') {
    catg_db = catg_sport;
  } else if (req.params.wbs === 'wiki') {
    catg_db = catg_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }
  catg_db.update({
      _id: req.body.id
    }, {
      $set: {
        catg: req.body.catg
      },
    },
    (err, data) => {
      if (err) res.json(err);
    }
  );
});

/* Remove catg */
router.get('/api/remove-catg-:wbs/id=:id', (req, res) => {
  let catg_db;

  if (req.params.wbs === 'news') {
    catg_db = catg_news;
  } else if (req.params.wbs === 'sport') {
    catg_db = catg_sport;
  } else if (req.params.wbs === 'wiki') {
    catg_db = catg_wiki;
  } else {
    console.log("ERROR ! can't find database");
  }
  catg_db.remove({
    _id: req.params.id
  }, {}, (err, data) => {
    if (err) console.log(err);
    res.send(`
      <script>
        location.replace('/manage_catg');
      </script>
    `);
  });
});

module.exports = router;
