


const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateRandomString = function(length) {

  let result = "";

  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }

  return result;

};

const getCurrentUser = function(users, req) {

  return users[req.session.userId];

};

const getUserByEmail = function(users, email) {

  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }

};

const urlForUser = function(urls, req) {

  const url  = urls[req.params.shortURL];
  const user = getCurrentUser(req);

  if (url && user && url.userID === user.id) {
    return url;
  }

};

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



