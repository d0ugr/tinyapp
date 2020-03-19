


const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

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



describe("getUserByEmail", function() {

  it("should return a user with valid email", function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    assert.strictEqual(user.id, "userRandomID");
  });

});



