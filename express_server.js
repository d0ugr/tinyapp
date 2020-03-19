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

const PORT = 7734;
const SALT_ROUNDS = 10;

const usersDB = {
  "420": {
    id:       "420",
    email:    "4@2.0",
    password: "$2b$10$6rhOxxh7V0U9Z/spzHOBj.kuYhv5rXmigNVMPT82eg3Wnp28Q8EuW" // 123
  },
  "userRandomID": {
    id:       "userRandomID",
    email:    "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id:       "user2RandomID",
    email:    "user2@example.com",
    password: "dishwasher-funk"
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



app.listen(PORT, () => {

  console.log(`TinyApp listening on port ${PORT}`);

});



// ROUTES

app.get("/u/:shortURL", (req, res) => {

  const url = urlDB[req.params.shortURL];

  if (url) {
    res.redirect(url.longURL);
  } else {
    res.status(404).send("Whaaaaat???");
  }

});

app.get("/", (req, res) => {

  if (getCurrentUser(usersDB, req)) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});

app.get("/register", (req, res) => {

  res.render("register", {
    user: getCurrentUser(usersDB, req)
  });

});

app.post("/register", (req, res) => {

  const { email, password } = req.body;

  if (!email) {
    res.status(400).send("Enter an email address.");
  } else if (!password) {
    res.status(400).send("Enter a password.");
  } else if (getUserByEmail(usersDB, email)) {
    res.status(400).send("Email address exists.");
  } else {
    bcrypt.hash(password, SALT_ROUNDS, (error, hashedPW) => {
      if (!error) {
        const newUserId = generateRandomString(6);
        usersDB[newUserId] = {
          id:       newUserId,
          email:    email,
          password: hashedPW
        };
        console.log(usersDB);
        req.session.userId = newUserId;
        res.redirect("/urls");
      } else {
        console.log(error);
        res.status(500).send("Server did bad things to the bed");
        return;
      }
    });
  }

});

app.get("/login", (req, res) => {

  res.render("login", {
    user: getCurrentUser(usersDB, req)
  });

});

app.post("/login", (req, res) => {

  const { email, password } = req.body;
  const user = getUserByEmail(usersDB, email);

  if (user) {
    bcrypt.compare(password, user.password, (error, pwMatch) => {
      if (!error) {
        if (pwMatch) {
          req.session.userId = user.id;
          res.redirect("/urls");
        } else {
          res.status(403).send("Nope.");
        }
      } else {
        console.log(error);
        res.status(500).send("Server did bad things to the bed");
        return;
      }
    });
  } else {
    res.status(403).send("Nope.");
  }

});

app.post("/logout", (req, res) => {

  res.clearCookie("user_id");
  res.redirect("/urls");

});

app.get("/urls", (req, res) => {

  const user = getCurrentUser(usersDB, req);

  if (user) {
    res.render("urls_index", {
      user: user,
      urls: urlsForUser(usersDB, user.id)
    });
  } else {
    res.redirect("/login");
  }

});

app.get("/urls/new", (req, res) => {

  const user = getCurrentUser(usersDB, req);

  if (user) {
    res.render("urls_new", { user });
  } else {
    res.redirect("/login");
  }

});

app.post("/urls", (req, res) => {

  urlDB[generateRandomString(6)] = req.body.longURL;
  res.send(urlDB);

});

app.get("/urls/:shortURL", (req, res) => {

  res.render("urls_show", {
    user:     getCurrentUser(usersDB, req),
    shortURL: req.params.shortURL,
    longURL:  urlDB[req.params.shortURL].longURL
  });

});

app.post("/urls/:shortURL/update", (req, res) => {

  const url = urlForUser(usersDB, req);

  if (url) {
    url.longURL = req.body.newURL;
    res.redirect("/urls");
  } else {
    res.status(403).send("Nope.");
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {

  if (urlForUser(req)) {
    delete urlDB[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("Nope.");
  }

});

app.get("/urls.json", (req, res) => {

  res.json(urlDB);

});
