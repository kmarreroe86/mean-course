const express = require('express');
const multer = require('multer');
const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(error, 'backend/images'); // Call a callback func with whether or not are errors and path to save the file, which is relative to server.js file
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    const finalName = name + '-' + Date.now() + '.' + extension;
    callback(null, finalName);
  }
});

// Get all posts
router.get('', (req, res, next) => {
  // console.log(req.url);
  Post.find((err, data) => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: data
    });
  });
});

// Get post by id
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(401).json({ message: 'Post not found' });
    }
  });
});

/**
 * Add new post.
 * Adding extra middleware to filter for an image file. multer module, will try
 * to find a single file and will find for an image.
 */
router.post('', multer({ storage: storage }).single('image'), (req, res, next) => {

  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost, // using spread operator to create object with all properties from createdPost object
        id: createdPost._id, // add extra property id
      }
    });
  });
});

// Save edited post
router.put('/:id', multer({ storage: storage }).single('image'), (req, res, next) => {

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  console.log('req.body:', JSON.stringify(req.body));
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post).then(
    result => {
      console.log(result);
      res.status(200).json({ message: 'Update successfull' });
    });
});

// Delete post
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Post deleted!' });
  });
});

module.exports = router;
