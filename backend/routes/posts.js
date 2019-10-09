const express = require('express');
const Post = require('../models/post');

const router = express.Router();

// Get all posts
router.get('', (req, res, next) => {
  // console.log(req.url);
  Post.find((err, data) => {
    console.log(data);
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
      res.status(401).json({message: 'Post not found'});
    }
  });
});

// Add new post
router.post('', (req, res, next) => {

  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

// Save edited post
router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'Update successfull'});
    });
});

// Delete post
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = router;
