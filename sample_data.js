


///////////////////
//  SAMPLE DATA  //
///////////////////

const userDB = {
  "test": {
    id:       "test",
    email:    "t@e.st",
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
    userID:  "test",
    longURL: "http://www.lighthouselabs.ca",
    visits:  0,
    // uniqueVisits: {
    //   "eU8yCb": {
    //     visits:    1,
    //     timestamp: ""
    //   }
    // }
  },
  "9sm5xK": {
    userID:  "userRandomID",
    longURL: "http://www.google.com",
    visits:  0,
    // uniqueVisits: {
    //   "eU8yCb": {
    //     visits:    1,
    //     timestamp: ""
    //   }
    // }
  }
};



module.exports = { userDB, urlDB };
