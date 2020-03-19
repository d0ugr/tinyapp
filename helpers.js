


const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// generateRandomString returns an ID string for use as a user ID or short URL key.
//    TODO: Update to generate actual unique ID strings.

const generateRandomString = function(length) {

  let result = "";

  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }

  return result;

};

// getCurrentUser returns a user object for a given express HTTP request object containing a session.
//    Returns undefined if no user is logged in.

const getCurrentUser = function(users, req) {

  if (users && req && req.session) {
    return users[req.session.userId];
  }

};

// getUserByEmail returns a user object from the specified user database, given an email address ('username' given at login).
//    Returns undefined if it is not found.

const getUserByEmail = function(users, email) {

  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }

};

// urlForUser returns a URL object for given user id and short URL key.
//    The user and short URL are retrieved from a given Express HTTP request object.
//    Returns the long URL, or undefined if no user is logged in, or the short URL key is invalid.

const urlForUser = function(urls, req) {

  const url  = urls[req.params.shortURL];
  const user = getCurrentUser(req);

  if (url && user && url.userID === user.id) {
    return url;
  }

};

// urlsForUser returns an object containing a group of URL objects for the specified user.
//    Returns an empty object if no matching URL objects were found.

const urlsForUser = function(urls, userID) {

  const result = {};

  for (const key in urls) {
    if (urls[key].userID === userID) {
      result[key] = urls[key];
    }
  }

  return result;

};



module.exports = {
  generateRandomString,
  getCurrentUser,
  getUserByEmail,
  urlForUser,
  urlsForUser
};



