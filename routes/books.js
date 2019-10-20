var express = require('express');
var router = express.Router();
const { Book } = require('../models');

// set up parsing
router.use(express.json());
router.use(express.urlencoded({ extended: false }));


/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}


router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books Library' });
}));


// Create a new book form
router.get('/new', (req, res) => {
  res.render('new-book', { book: {}, title: 'New book' });  // Keep and eye out for book Vs book in 2nd argument
});


// POST a new book
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch(error) {
    if(error.name === 'SequelizeValidationError') { // Checking the error
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New book' });
    } else {
      throw error; // Error caught in the asyncHandler's catch block
    }
  }
}));


// Update book or gets a book
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book, title: 'Edit book' });
  } else {
    res.render('page-not-found');
  }
}));





router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.render('error');
    }
  } catch(error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id; // Make sure the correct book gets updated
      res.render('update-book', { book, errors: error.errors, title: 'Update book' });
    } else {
      throw error;
    }
  }
}));





// Delete a book
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.render('page-not-found');
  }
}));



module.exports = router;
