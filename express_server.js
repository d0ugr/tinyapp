const app = require("express")();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-parser")());

const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const PORT = 7734;

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



const generateRandomString = function(length) {

  let result = "";

  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }

  return result;

};



app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}`);
});



// ROUTES

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/register", (req, res) => {
  res.render("register", {
    username: req.cookies && req.cookies.username
  });
});

app.post("/register", (req, res) => {
  const userId = generateRandomString(6);
  const { email, password } = req.body;
  users[userId] = {
    id:       userId,
    email:    email,
    password: password
  };
  console.log(users);
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  res.render("urls_index", {
    username: req.cookies && req.cookies.username,
    urls:     urlDatabase
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString(6)] = req.body.longURL;
  res.send(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  res.render("urls_show", {
    username: req.cookies && req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL:  urlDatabase[req.params.shortURL]
  });
});

app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
