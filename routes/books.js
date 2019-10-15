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
  res.render('index', { books, title: 'Book library' });
}));


// Create a new book form
router.get('/new', (req, res) => {
  res.render('new-book');
});

router.get('/books/test', (req, res) => {
  res.send('test 1 2 3');
});


// // POST new book
// router.post('/books/new', asyncHandler(async (req, res) => {
//   const book = await Book.create(req.body);
//   res.render('update-book', { book, title: 'Entry book' });
//   res.redirect('/');
// }));


// Update book
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book, title: 'Edit book' });
}));

router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/');
}));





module.exports = router;
