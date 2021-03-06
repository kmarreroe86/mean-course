const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
// const cors = require('cors');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');


const app = express();

mongoose.connect('mongodb+srv://karel:' +
  process.env.MONGO_ATLAS_PW +
  '@cluster0-pccc6.mongodb.net/mean-course?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(() => {
    console.log('Database connection failed');
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
// app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images'))); // requests address to images will go to backend/images directory
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
