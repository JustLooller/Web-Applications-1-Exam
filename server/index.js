"use strict";
const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const { validationResult, body } = require("express-validator");
const { isLoggedIn, isAdmin } = require("./middleware/authMiddleware.js");

const userDao = require("./model/user-dao.js");
const cmsDao = require("./model/dao.js");
const siteDao = require("./model/site-dao.js");

// setup passport
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return done(null, user);
    });
  })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// setup cors
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// init express
const app = new express();
const port = 3001;
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));

//static content (images) will be stored in the public folder
app.use(express.static("public"));

// setup express-session
app.use(
  session({
    secret: "gjdsjnfsdiugbu8f73rh",
    resave: false,
    saveUninitialized: false,
  })
);

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

/* REST API */

// GET /api/pages/all
app.get("/api/pages/all", isLoggedIn, async (req, res) => {
  try {
    const pages = await cmsDao.getPages();
    if (pages.error) res.status(404).json(pages);
    else res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

// GET /api/pages/:id
app.get("/api/pages/:id", async (req, res) => {
  try {
    const page = await cmsDao.getPageById(req.params.id);
    if (page.error) res.status(404).json(page);
    else res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

//GET /api/pages/all/published
app.get("/api/pages/all/published", async (req, res) => {
  try {
    const pages = await cmsDao.getPublishedPages();
    if (pages.error) res.status(404).json(pages);
    else res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

//GET /api/authors/all
app.get("/api/authors/all", isLoggedIn, async (req, res) => {
  try {
    const authors = await userDao.getAllUsers();
    if (authors.error) res.status(404).json(authors);
    else res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

// POST /api/pages
app.post(
  "/api/pages",
  isLoggedIn,
  body("title", "You need to specify a title").isLength({ min: 1 }),
  body("blocks", "You need to insert at least two blocks").isArray({ min: 2 }),
  body(
    "blocks.*.content",
    "You need to insert a content in each text block"
  ).isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    const errList = [];
    if (!errors.isEmpty()) {
      errList.push(...errors.errors.map((e) => e.msg));
      return res.status(400).json({ errors: errList });
    }
    try {
      const result = await cmsDao.createPage(req.body, req.user);
      if (result.error) res.status(404).json(result);
      else res.json(result);
    } catch (err) {
      console.error(err);
      errList.push(err);
      res.status(503).json({
        errors: errList,
      });
    }
  }
);

// DELETE /api/pages/:id
app.delete("/api/pages/:id", isLoggedIn, async (req, res) => {
  try {
    const result = await cmsDao.deletePage(req.params.id, req.user);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: "Database error during the deletion of the page. " + err,
    });
  }
});

// PUT /api/pages/:id
app.put(
  "/api/pages/:id",
  isLoggedIn,
  body("title", "You need to specify a title").isLength({ min: 1 }),
  body("blocks", "You need to insert at least two blocks").isArray({ min: 2 }),
  body(
    "blocks.*.content",
    "You need to insert a content in each text block"
  ).isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    const errList = [];
    if (!errors.isEmpty()) {
      errList.push(...errors.errors.map((e) => e.msg));
      return res.status(400).json({ errors: errList });
    }
    try {
      const result = await cmsDao.editPage(req.body, req.user);
      if (result.error) res.status(404).json(result);
      else res.json(result);
    } catch (err) {
      console.error(err);
      res
        .status(503)
        .json({ error: "Database error during the edit of the page. " + err });
    }
  }
);

//Get all static images
app.get("/api/images/all", (req, res) => {
  const imagesFolderPath = path.join(__dirname, "public/images");

  // Read the directory contents
  fs.readdir(imagesFolderPath, (err, files) => {
    if (err) {
      res.status(500).json({ error: "Failed to read images directory" });
      return;
    }
    // Return the content as the response
    res.json({ images: files });
  });
});

/* SESSION RELATED API */

// POST /api/login
app.post("/api/login", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /api/logout
app.delete("/api/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/session
app.get("/api/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

/* SITE RELATED API */

// GET /api/title
app.get("/api/title", async (req, res) => {
  try {
    const title = await siteDao.getTitle();
    if (title.error) res.status(404).json(title);
    else res.json(title);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

// PUT /api/title
app.put(
  "/api/title",
  isAdmin,
  body("title", "You need to specify a title").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    const errList = [];
    if (!errors.isEmpty()) {
      errList.push(...errors.errors.map((e) => e.msg));
      return res.status(400).json({ errors: errList });
    }
    try {
      const result = await siteDao.changeTitle(req.body.title);
      if (result.error) res.status(404).json(result);
      else res.json(result);
    } catch (err) {
      console.error(err);
      res
        .status(503)
        .json({ error: "Database error during the edit of the title. " + err });
    }
  }
);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
