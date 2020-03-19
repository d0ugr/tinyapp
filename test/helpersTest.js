


const { assert } = require("chai");

const {
  generateRandomString,
  getCurrentUser,
  getUserByEmail,
  urlForUser,
  urlsForUser
} = require("../helpers.js");

const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const testUsers = {
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

const testURLs = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID:  "420"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID:  "userRandomID"
  }
};



describe("generateRandomString(length)", function() {

  // Valid length

  it("should return string with valid length: 1", function() {
    assert.strictEqual(generateRandomString(1).length, 1);
  });
  it("should return string with valid length: 6", function() {
    assert.strictEqual(generateRandomString(6).length, 6);
  });
  it("should return string with valid length: 100", function() {
    assert.strictEqual(generateRandomString(100).length, 100);
  });
  // it("should return alphanumeric string with valid length: 10", function() {
  //   assert.strictEqual(generateRandomString(100).length, 100);
  // });

  // Invalid length

  it("should return undefined with no length", function() {
    assert.isUndefined(generateRandomString());
  });
  it("should return undefined with invalid length: 0", function() {
    assert.isUndefined(generateRandomString(0));
  });
  it("should return undefined with invalid length: empty string", function() {
    assert.isUndefined(generateRandomString(""));
  });
  it("should return undefined with invalid length: empty array", function() {
    assert.isUndefined(generateRandomString([]));
  });
  it("should return undefined with invalid length: empty object", function() {
    assert.isUndefined(generateRandomString({}));
  });

});

describe("getCurrentUser(users, req)", function() {

  // Valid user ID

  it("should return valid user with valid request", function() {
    const req  = { session: { userId: "userRandomID" } };
    const user = getCurrentUser(testUsers, req);
    assert.strictEqual(user.id, "userRandomID");
  });
  it("should return valid user with valid request", function() {
    const req  = { session: { userId: "user2RandomID" } };
    const user = getCurrentUser(testUsers, req);
    assert.strictEqual(user.id, "user2RandomID");
  });

  // Invalid user ID

  it("should return undefined user with invalid request: userId: \"\"", function() {
    const req  = { session: { userId: "" } };
    const user = getCurrentUser(testUsers, req);
    assert.isUndefined(user);
  });
  it("should return undefined user with invalid request: userId: \"nope\"", function() {
    const req  = { session: { userId: "nope" } };
    const user = getCurrentUser(testUsers, req);
    assert.isUndefined(user);
  });
  it("should return undefined user with invalid request: userId: []", function() {
    const req  = { session: { userId: [] } };
    const user = getCurrentUser(testUsers, req);
    assert.isUndefined(user);
  });
  it("should return undefined user with invalid request: userId: {}", function() {
    const req  = { session: { userId: {} } };
    const user = getCurrentUser(testUsers, req);
    assert.isUndefined(user);
  });

});

describe("getUserByEmail(users, email)", function() {

  // Valid email

  it("should return a user with valid email", function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    assert.strictEqual(user.id, "userRandomID");
  });

  // Invalid email

  it("should return undefined with invalid email: empty string", function() {
    const user = getUserByEmail(testUsers, "");
    assert.isUndefined(user);
  });
  it("should return undefined with invalid email: string not found", function() {
    const user = getUserByEmail(testUsers, "nope@nope.nope");
    assert.isUndefined(user);
  });
  it("should return undefined with invalid email: array", function() {
    const user = getUserByEmail(testUsers, []);
    assert.isUndefined(user);
  });
  it("should return undefined with invalid email: object", function() {
    const user = getUserByEmail(testUsers, {});
    assert.isUndefined(user);
  });
  it("should return undefined with invalid email: extra arguments", function() {
    const user = getUserByEmail(testUsers, {}, 1, 2, 3);
    assert.isUndefined(user);
  });

  //

});

describe("urlForUser(urls, req)", function() {

  // Valid request

  it("should return valid url object with valid user and request: \"420\", \"b2xVn2\"", function() {
    const user = { id: "420" };
    const req  = { params: { shortURL: "b2xVn2" } };
    const url  = urlForUser(user, testURLs, req);
    assert.strictEqual(url.longURL, "http://www.lighthouselabs.ca");
  });
  it("should return valid url object with valid user and request: \"userRandomID\", \"9sm5xK\"", function() {
    const user = { id: "userRandomID" };
    const req  = { params: { shortURL: "9sm5xK" } };
    const url  = urlForUser(user, testURLs, req);
    assert.strictEqual(url.longURL, "http://www.google.com");
  });

  // Invalid request

  it("should return undefined with missing arguments", function() {
    const url = urlForUser();
    assert.isUndefined(url);
  });
  it("should return undefined with missing arguments", function() {
    const user = { id: "nope" };
    const url  = urlForUser(user);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid/missing arguments", function() {
    const req  = { params: { shortURL: "b2xVn2" } };
    const url  = urlForUser(req);
    assert.isUndefined(url);
  });
  it("should return undefined with missing arguments", function() {
    const user = { id: "nope" };
    const req  = { params: { shortURL: "b2xVn2" } };
    const url  = urlForUser(user, req);
    assert.isUndefined(url);
  });
  it("should return undefined with valid user and valid request in wrong order: \"nope\", \"b2xVn2\"", function() {
    const user = { id: "nope" };
    const req  = { params: { shortURL: "b2xVn2" } };
    const url  = urlForUser(testURLs, user, req);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid user and valid request: \"nope\", \"b2xVn2\"", function() {
    const user = { id: "nope" };
    const req  = { params: { shortURL: "b2xVn2" } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });
  it("should return undefined with valid user and invalid request: \"420\", \"abc123\"", function() {
    const user = { id: "420" };
    const req  = { params: { shortURL: "abc123" } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid user and valid request: \"nope\", \"abc123\"", function() {
    const user = { id: "nope" };
    const req  = { params: { shortURL: "abc123" } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid user and valid request: \"\", \"b2xVn2\"", function() {
    const user = { id: "" };
    const req  = { params: { shortURL: "b2xVn2" } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid user and invalid request: \"\", \"\"", function() {
    const user = { id: "" };
    const req  = { params: { shortURL: "" } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid user and invalid request: [], []", function() {
    const user = { id: [] };
    const req  = { params: { shortURL: [] } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });
  it("should return undefined with invalid user and invalid request: {}, {}", function() {
    const user = { id: {} };
    const req  = { params: { shortURL: {} } };
    const url  = urlForUser(user, testURLs, req);
    assert.isUndefined(url);
  });

});

describe("urlsForUser(urls, userID)", function() {

  // Valid URLs and user ID

  it("should return valid URLs object with valid user ID: \"420\"", function() {
    const urls = urlsForUser(testURLs, "420");
    assert.strictEqual(urls["b2xVn2"].longURL, "http://www.lighthouselabs.ca");
  });
  it("should return valid URLs object with valid user ID: \"420\"", function() {
    const urls = urlsForUser(testURLs, "userRandomID");
    assert.strictEqual(urls["9sm5xK"].longURL, "http://www.google.com");
  });

  // Valid URLs and user ID

  it("should return undefined with no arguments", function() {
    const urls = urlsForUser();
    assert.isUndefined(urls);
  });

});



