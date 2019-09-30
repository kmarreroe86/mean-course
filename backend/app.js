const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://karel:E6ogCXkMu6rEAB7m@cluster0-pccc6.mongodb.net/mean-course?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(() => {
    console.log('Database connection failed');
  });

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/posts', (req, res, next) => {
  // console.log(req.url);
  Post.find((err, data) => {
    console.log(data);
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: data
    });
  });

});

app.post('/api/posts', (req, res, next) => {

  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added successfully',
  });

});

module.exports = app;
