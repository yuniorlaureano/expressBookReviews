const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () =>
  new Promise((resolve, reject) => {
    return resolve(books);
  });

const getBook = (isbn) =>
  new Promise((resolve, reject) => {
    return resolve(books[isbn]);
  });

const getBookByAuthor = (author) =>
  new Promise((resolve, reject) => {
    var isbn = Object.keys(books).filter(
      (item) => books[item].author == author
    );
    if (!isbn) {
      reject("the book was not found");
    } else {
      resolve(books[isbn]);
    }
  });

const getBookByTitle = (title) =>
  new Promise((resolve, reject) => {
    var isbn = Object.keys(books).filter((item) => books[item].title == title);
    if (!isbn) {
      reject("the book was not found");
    } else {
      resolve(books[isbn]);
    }
  });

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let listedBooks = await getBooks();
  //Write your code here
  return res.status(200).json(listedBooks);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  var book = await getBook(req.params.isbn);
  if (!book) {
    return req.status(404).json({ message: "the book was not found" });
  }

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const book = await getBookByAuthor(req.params.author);
    return res.status(200).json(book);
  } catch (error) {
    req.status(404).json({ message: "the book was not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const book = await getBookByTitle(req.params.title);
    return res.status(200).json(book);
  } catch (error) {
    req.status(404).json({ message: "the book was not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  var book = books[req.params.isbn];
  if (!book) {
    return req.status(404).json({ message: "the book was not found" });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
