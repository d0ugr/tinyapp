


const ALPHANUMERIC_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// generateRandomString creates a string of random alphanumeric characters.
//    It can be used to generate simulated user IDs or short URL keys.
//    TODO: Update to generate actual unique ID strings.
//
//  length: Number: Length of the string to generate.  Must be >= 1.
//
// Returns a string of random alphanumeric characters of the given length,
//    or undefined if the input is invalid.

const generateRandomString = function(length) {

  let result = "";

  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS[Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)];
  }

  return (result.length > 0 ? result : undefined);

};

// getCurrentUser returns a user object for a given Express HTTP request object containing a session.
//
//    users: Object: A list of users to check the request user ID against.
//    req:   Object: An Express HTTP request object.
//
// Returns undefined if no user is logged in, or with any invalid input.

const getCurrentUser = function(users, req) {

  if (users && req && req.session) {
    return users[req.session.userId];
  }

};

// getUserByEmail returns a user object from the specified user database,
//    given an email address ('username' given at login).
//
//    users: Object: A list of users to check the email address against.
//    email: String: Email address to look for in the user list.
//
// Returns undefined if the email address is not found, or with any invalid input.

const getUserByEmail = function(users, email) {

  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }

};

// urlForUser returns a URL object for a given user and short URL key.
//    The short URL key is retrieved from the given Express HTTP request object.
//
//    user: Object: A user object to check the user ID against.
//    urls: Object: A list of URL objects to search.
//    req:  Object: An Express HTTP request object containing a short URL to look up in urls.
//
// Returns the URL object for the given user and short URL,
//    or undefined if no user is logged in, or any input is invalid.

const urlForUser = function(user, urls, req) {

  if (req && req.params) {
    const url = urls[req.params.shortURL];

    if (user && url && url.userID === user.id) {
      return url;
    }
  }

};

// urlsForUser retrieves all URL objects for a given user.
//
//    urls:   Object: A list of URL objects to search.
//    userID: String: A user ID to look up in urls.
//
// Returns a list of URL objects, or undefined if any input is invalid.

const urlsForUser = function(urls, userID) {

  const result = {};

  if (typeof urls === "object") {
    for (const key in urls) {
      if (urls[key].userID === userID) {
        result[key] = urls[key];
      }
    }
  }

  return (Object.keys(result).length > 0 ? result : undefined);

};



module.exports = {
  generateRandomString,
  getCurrentUser,
  getUserByEmail,
  urlForUser,
  urlsForUser
};



