const app = require("express")();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-parser")());
const bcrypt = require("bcrypt");

const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const PORT = 7734;
const SALT_ROUNDS = 10;

const users = {
  "420": {
    id:       "420",
    email:    "4@2.0",
    password: "123"
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

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID:  "420"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID:  "userRandomID"
  }
};



const generateRandomString = function(length) {

  let result = "";

  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }

  return result;

};

const getCurrentUser = function(req) {

  return req.cookies && req.cookies.user_id && users[req.cookies.user_id];

};

const getUserByEmail = function(email) {

  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }

};

const urlForUser = function(req) {

  const url  = urlDatabase[req.params.shortURL];
  const user = getCurrentUser(req);

  if (url && user && url.userID === user.id) {
    return url;
  }

};

const urlsForUser = function(userID) {

  const result = {};

  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === userID) {
      result[key] = urlDatabase[key];
    }
  }
  console.log(result);

  return result;

};



app.listen(PORT, () => {

  console.log(`TinyApp listening on port ${PORT}`);

});



// ROUTES

app.get("/u/:shortURL", (req, res) => {

  const url = urlDatabase[req.params.shortURL];

  if (url) {
    res.redirect(url.longURL);
  } else {
    res.status(404).send("Whaaaaat???");
  }

});

app.get("/", (req, res) => {

  res.send("Hello!");

});

app.get("/register", (req, res) => {

  res.render("register", {
    user: getCurrentUser(req)
  });

});

app.post("/register", (req, res) => {

  const { email, password } = req.body;

  if (!email) {
    res.status(400).send("Enter an email address.");
  } else if (!password) {
    res.status(400).send("Enter a password.");
  } else if (getUserByEmail(email)) {
    res.status(400).send("Email address exists.");
  } else {
    bcrypt.hash(password, SALT_ROUNDS, (error, hashedPW) => {
      if (!error) {
        const newUserId = generateRandomString(6);
        users[newUserId] = {
          id:       newUserId,
          email:    email,
          password: hashedPW
        };
        res.cookie("user_id", newUserId);
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
    user: getCurrentUser(req)
  });

});

app.post("/login", (req, res) => {

  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (user) {
    bcrypt.compare(password, user.password, (error, pwMatch) => {
      if (!error) {
        if (pwMatch) {
          res.cookie("user_id", user.id);
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

  const user = getCurrentUser(req);

  if (user) {
    res.render("urls_index", {
      user: user,
      urls: urlsForUser(user.id)
    });
  } else {
    res.redirect("/login");
  }

});

app.get("/urls/new", (req, res) => {

  const user = getCurrentUser(req);

  if (user) {
    res.render("urls_new", { user });
  } else {
    res.redirect("/login");
  }

});

app.post("/urls", (req, res) => {

  urlDatabase[generateRandomString(6)] = req.body.longURL;
  res.send(urlDatabase);

});

app.get("/urls/:shortURL", (req, res) => {

  res.render("urls_show", {
    user:     getCurrentUser(req),
    shortURL: req.params.shortURL,
    longURL:  urlDatabase[req.params.shortURL]
  });

});

app.post("/urls/:shortURL/update", (req, res) => {

  const url = urlForUser(req);

  if (url) {
    url.longURL = req.body.newURL;
    res.redirect("/urls");
  } else {
    res.status(403).send("Nope.");
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {

  if (urlForUser(req)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("Nope.");
  }

});

app.get("/urls.json", (req, res) => {

  res.json(urlDatabase);

});
