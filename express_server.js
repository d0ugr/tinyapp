


// TEST DATA

const userDB = {
  "420": {
    id:       "420",
    email:    "4@2.0",
    password: "$2b$10$6rhOxxh7V0U9Z/spzHOBj.kuYhv5rXmigNVMPT82eg3Wnp28Q8EuW" // 123
  },
  "userRandomID": {
    id:       "userRandomID",
    email:    "user@example.com",
    password: "$2b$10$PHAbVbPeYGooQ9BK2fo0AefE1vG6htmFuX7pb2g.UwSAlCrrCePFi" // 123
  },
  "user2RandomID": {
    id:       "user2RandomID",
    email:    "user2@example.com",
    password: "$2b$10$pSyWYULNxfYS9wuyahL78Oo5kYZktc2Qx6VbE0Erl6BABFPFscyiO" // dishwasher-funk
  }
};

const urlDB = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID:  "420"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID:  "userRandomID"
  }
};



const PORT = 7734;
const SALT_ROUNDS = 10;

//const HTTP_STATUS_400 = "Nope.";
const HTTP_STATUS_403 = "Nope.";
const HTTP_STATUS_404 = "Whaaaaat???";
const HTTP_STATUS_500 = "Server did bad things to the bed";



const app = require("express")();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-session")({
  name:   "session",
  secret: "totally-secret-impossible-to-break-cookie-secret",
  maxAge: 24 * 60 * 60 * 1000
}));
const bcrypt = require("bcrypt");

const {
  generateRandomString,
  getCurrentUser,
  getUserByEmail,
  urlForUser,
  urlsForUser
} = require("./helpers");

app.listen(PORT, () => {

  console.log(`TinyApp listening on port ${PORT}`);

});



// ROUTES

// /u/:shortURL redirects to the long URL, or 404 if it doesn't exist.
//  It is first for performance, since it will be the most accessed in the real world.

app.get("/u/:shortURL", (req, res) => {

  const url = urlDB[req.params.shortURL];

  if (url) {
    res.redirect(url.longURL);
  } else {
    res.status(404).send(HTTP_STATUS_404);
  }

});

// / redirects to the URL index for the current user, or the login page if no one is logged in.

app.get("/", (req, res) => {

  if (getCurrentUser(userDB, req)) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});

// GET /register shows the new account creation page.

app.get("/register", (req, res) => {

  res.render("register", {
    user: getCurrentUser(userDB, req)
  });

});

// POST /register creates a new account, if the given information is valid.

app.post("/register", (req, res) => {

  const { email, password } = req.body;

  if (!email) {
    res.status(400).send("Enter an email address.");
  } else if (!password) {
    res.status(400).send("Enter a password.");
  } else if (getUserByEmail(userDB, email)) {
    res.status(400).send("Email address exists.");
  } else {
    bcrypt.hash(password, SALT_ROUNDS, (error, hashedPW) => {
      if (!error) {
        const newUserId = generateRandomString(6);
        userDB[newUserId] = {
          id:       newUserId,
          email:    email,
          password: hashedPW
        };
        console.log(userDB);
        req.session.userId = newUserId;
        res.redirect("/urls");
      } else {
        console.log(error);
        res.status(500).send(HTTP_STATUS_500);
        return;
      }
    });
  }

});

// GET /login shows the login page.

app.get("/login", (req, res) => {

  res.render("login", {
    user: getCurrentUser(userDB, req)
  });

});

// POST /login attempts to log a user in, after validating input.

app.post("/login", (req, res) => {

  const { email, password } = req.body;
  const user = getUserByEmail(userDB, email);

  if (user) {
    bcrypt.compare(password, user.password, (error, pwMatch) => {
      if (!error) {
        if (pwMatch) {
          req.session.userId = user.id;
          res.redirect("/urls");
        } else {
          res.status(403).send(HTTP_STATUS_403);
        }
      } else {
        console.log(error);
        res.status(500).send(HTTP_STATUS_500);
        return;
      }
    });
  } else {
    res.status(403).send(HTTP_STATUS_403);
  }

});

app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect("/urls");

});

// GET /urls shows the URL listing page for the current user, or redirects to the login page if no one is logged in.

app.get("/urls", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (user) {
    res.render("urls_index", {
      user: user,
      urls: urlsForUser(urlDB, user.id)
    });
  } else {
    res.redirect("/login");
  }

});

// GET /urls/new shows the new URL creation page, or redirects to the login page if no one is logged in.

app.get("/urls/new", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (user) {
    res.render("urls_new", { user });
  } else {
    res.redirect("/login");
  }

});

// POST /urls/new creates a new shortened URL, or redirects to the login page if no one is logged in.

app.post("/urls", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (user) {
    if (req.body.longURL) {
      urlDB[generateRandomString(6)] = req.body.longURL;
      res.redirect("/urls");
    } else {
      res.status(400).send("Invalid URL.");
    }
  } else {
    res.redirect("/login");
  }

});

// GET /urls/:shortURL shows the information page for a given short URL, or redirects to the login page if no one is logged in.

app.get("/urls/:shortURL", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (user) {
    res.render("urls_show", {
      user:     user,
      shortURL: req.params.shortURL,
      longURL:  urlDB[req.params.shortURL].longURL
    });
  } else {
    res.redirect("/login");
  }

});

// POST /urls/:shortURL/update updates the long URL for the specified short URL, or redirects to the login page if no one is logged in.

app.post("/urls/:shortURL/update", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (user) {
    const url = urlForUser(userDB, req);
    if (url) {
      url.longURL = req.body.newURL;
      res.redirect("/urls");
    } else {
      res.status(403).send(HTTP_STATUS_403);
    }
  } else {
    res.redirect("/login");
  }

});

// POST /urls/:shortURL/delete removes the specified short URL from the database, or redirects to the login page if no one is logged in.

app.post("/urls/:shortURL/delete", (req, res) => {

  if (urlForUser(req)) {
    delete urlDB[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send(HTTP_STATUS_403);
  }

});



