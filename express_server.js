


// Sample data

const {
  userDB,
  urlDB
} = require("./sample_data");



/////////////////
//  CONSTANTS  //
/////////////////

const DEFAULT_PORT = 8080;

const COOKIE_NAME   = "tinyapp-session";
const COOKIE_SECRET = "totally-secret-impossible-to-break-cookie-secret";
const COOKIE_MAXAGE = 24 * 60 * 60 * 1000;

const SALT_ROUNDS = 10;

const HTTP_STATUS_400_MISSING_EMAIL = "Enter an email address.";
const HTTP_STATUS_400_MISSING_PW    = "Enter a password.";
const HTTP_STATUS_400_INVALID_EMAIL = "Email address exists.";
const HTTP_STATUS_400_INVALID_URL   = "Invalid URL.";

const HTTP_STATUS_403               = "Forbidden.";
const HTTP_STATUS_403_INVALID_LOGIN = "Invalid username or password.";

const HTTP_STATUS_404               = "Not found.";

const HTTP_STATUS_500               = "Internal server error.";



// Import helper functions

const {
  generateRandomString,
  getCurrentUser,
  getUserByEmail,
  urlForUser,
  urlsForUser,
  renderError
} = require("./helpers");

// Set up server

const app = require("express")();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-session")({
  name:   COOKIE_NAME,
  secret: COOKIE_SECRET,
  maxAge: COOKIE_MAXAGE
}));
const bcrypt = require("bcrypt");

// Main initialization

const args = process.argv.slice(2);

let port = Number(args[0]);

if (!Number.isInteger(port)) {
  port = DEFAULT_PORT;
}
app.listen(port, () => console.log(`TinyApp listening on port ${port}`));



//////////////
//  ROUTES  //
//////////////



// GET /u/:shortURL redirects to the long URL, or 404 if it doesn't exist.
//    It is first for performance, since it will be the most accessed in the real world.

app.get("/u/:shortURL", (req, res) => {

  const url = urlDB[req.params.shortURL];

  if (url) {
    res.redirect(url.longURL);
  } else {
    renderError(userDB, req, res, 404, HTTP_STATUS_404);
  }

});

// GET / redirects to the URL index for the current user, or the login page if no one is logged in.

app.get("/", (req, res) => {

  res.redirect(getCurrentUser(userDB, req) ? "/urls" :  "/login");

});

// GET /register shows the new account creation page.
//    If a user is logged in, it redirects to the URL index page.

app.get("/register", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (!user) {
    res.render("register", { user });
  } else {
    res.redirect("/urls");
  }

});

// POST /register creates a new account, if the given information is valid.

app.post("/register", (req, res) => {

  const { email, password } = req.body;

  if (!email) {
    renderError(userDB, req, res, 400, HTTP_STATUS_400_MISSING_EMAIL);
  } else if (!password) {
    renderError(userDB, req, res, 400, HTTP_STATUS_400_MISSING_PW);
  } else if (getUserByEmail(userDB, email)) {
    renderError(userDB, req, res, 400, HTTP_STATUS_400_INVALID_EMAIL);
  } else {
    bcrypt.hash(password, SALT_ROUNDS, (error, hashedPW) => {
      if (!error) {
        const newUserId = generateRandomString(6);
        userDB[newUserId] = {
          id:       newUserId,
          email:    email,
          password: hashedPW
        };
        req.session.userId = newUserId;
        res.redirect("/urls");
      } else {
        console.log(error);
        renderError(userDB, req, res, 500, HTTP_STATUS_500);
      }
    });
  }

});

// GET /login shows the login page,
//    or redirects to the URL index if a user is logged in.

app.get("/login", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (!user) {
    res.render("login", {
      user: getCurrentUser(userDB, req)
    });
  } else {
    res.redirect("/urls");
  }

});

// POST /login attempts to log a user in, after validating input.

app.post("/login", (req, res) => {

  const { email, password } = req.body;
  const user = getUserByEmail(userDB, email);

  if (!user) {
    renderError(userDB, req, res, 403, HTTP_STATUS_403_INVALID_LOGIN);
  } else {
    bcrypt.compare(password, user.password, (error, pwMatch) => {
      if (error) {
        console.log(error);
        renderError(userDB, req, res, 500, HTTP_STATUS_500);
      } else if (!pwMatch) {
        renderError(userDB, req, res, 403, HTTP_STATUS_403_INVALID_LOGIN);
      } else {
        req.session.userId = user.id;
        res.redirect("/urls");
      }
    });
  }

});

// POST /logout clears the session cookies and redirects to /urls,
//    which will in turn redirect to /login.

app.post("/logout", (req, res) => {

  req.session = null;
  // Should probably redirect straight to /login, but this is what the requirements specify:
  res.redirect("/urls");

});

// GET /urls shows the URL listing page for the current user,
//    or shows an error if no one is logged in.

app.get("/urls", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (!user) {
    // Should probably redirect to /login, but this is what the requirements specify:
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
    // res.redirect("/login");
  } else {
    res.render("urls_index", {
      user: user,
      urls: urlsForUser(urlDB, user.id)
    });
  }

});

// GET /urls/new shows the new URL creation page,
//    or redirects to the login page if no one is logged in.

app.get("/urls/new", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (!user) {
    // Requirements say redirect to /login, which is inconsistent with other routes:
    // renderError(userDB, req, res, 403, HTTP_STATUS_403);
    res.redirect("/login");
  } else {
    res.render("urls_new", { user });
  }

});

// GET /urls/:shortURL shows the information page for a given short URL.
//    If no one is logged in, or the short URL is invalid, an error is shown.

app.get("/urls/:shortURL", (req, res) => {

  const user     = getCurrentUser(userDB, req);
  const shortURL = req.params.shortURL;
  const url      = urlDB[shortURL];

  if (!user) {
    // Should probably redirect to /login if not logged in, but this is what the requirements specify:
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
    // res.redirect("/login");
  } else if (!url) {
    renderError(userDB, req, res, 404, HTTP_STATUS_404);
  } else if (url.userID !== user.id) {
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
  } else {
    res.render("urls_show", {
      user:     user,
      shortURL: shortURL,
      longURL:  url.longURL
    });
  }

});

// POST /urls creates a new shortened URL,
//    or shows an error if no one is logged in.

app.post("/urls", (req, res) => {

  const user    = getCurrentUser(userDB, req);
  const longURL = req.body.longURL;

  if (!user) {
    // Should probably redirect to /login if not logged in, but this is what the requirements specify:
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
    // res.redirect("/login");
  } else if (!longURL) {
    renderError(userDB, req, res, 400, HTTP_STATUS_400_INVALID_URL);
  } else {
    urlDB[generateRandomString(6)] = {
      longURL: longURL,
      userID:  user.id
    };
    res.redirect("/urls");
  }

});

// POST /urls/:shortURL updates the long URL for the specified short URL,
//    or shows an error if no one is logged in.

app.post("/urls/:shortURL", (req, res) => {

  const user   = getCurrentUser(userDB, req);
  const url    = urlForUser(user, urlDB, req);
  const newURL = req.body.newURL;

  if (!user) {
    // Should probably redirect to /login if not logged in, but this is what the requirements specify:
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
    // res.redirect("/login");
  } else if (!url) {
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
  } else if (!newURL) {
    renderError(userDB, req, res, 400, HTTP_STATUS_400_INVALID_URL);
  } else {
    url.longURL = newURL;
    res.redirect("/urls");
  }

});

// POST /urls/:shortURL/delete removes the specified short URL from the database,
//    or shows an error if no one is logged in.

app.post("/urls/:shortURL/delete", (req, res) => {

  const user = getCurrentUser(userDB, req);

  if (!user) {
    // Should probably redirect to /login if not logged in, but this is what the requirements specify:
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
    // res.redirect("/login");
  } else if (!urlForUser(user, urlDB, req)) {
    renderError(userDB, req, res, 403, HTTP_STATUS_403);
  } else {
    delete urlDB[req.params.shortURL];
    res.redirect("/urls");
  }

});



