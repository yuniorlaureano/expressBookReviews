const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let savedUser = users.find((user) => user.username == username);
  return savedUser != undefined;
};

const authenticatedUser = (username, password) => {
  let savedUser = users.find((user) => user.username == username);
  return savedUser.password == password;
};

//only registered users can login
regd_users.post("/login/register", (req, res) => {
  var { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "the user and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "the user already exists" });
  }

  users.push({
    username,
    password,
  });
  return res.status(201).json({ message: "user created" });
});

regd_users.post("/login", (req, res) => {
  var { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "the user does not exists" });
  }

  if (authenticatedUser(username, password)) {
    var token = jwt.sign({ user: username }, "private-key", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      token,
    };
    return res.status(200).json({ message: "authenticated" });
  }

  return res.status(400).json({ message: "invalid user" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.query.review) {
    return res.status(400).json({ message: "invalid review" });
  }
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "the book does not exists" });
  }

  if (book.reviews[req.user]) {
    book.reviews[req.user] = req.query.review;
    return res.status(200).json({ message: "Review modified" });
  } else {
    book.reviews[req.user] = req.query.review;
    return res.status(200).json({ message: "Review added" });
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "the book does not exists" });
  }

  if (book.reviews[req.user]) {
    let reviews = {};
    Object.keys(book.reviews).forEach((user) => {
      if (req.user != user) {
        reviews[user] = book.reviews[user];
      }
    });
    book.reviews = reviews;
    return res.status(200).json({ message: "review deleted" });
  }
  return res.status(404).json({ message: "no review to delete" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
