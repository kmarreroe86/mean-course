const Post = require('../models/post');


exports.getAllPosts = (req, res, next) => {
  // console.log(req.url);

  const pageSize = +req.query.pagesize; // Accessing query parameters sent from frontend
  const currentPage = +req.query.page;
  let fetchedPosts;
  const postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(data => {
    fetchedPosts = data;
    return Post.countDocuments();
  })
    .then(count => {
      res.status(200).json({
        message: 'Post fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed'
      });
    });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed'
      });
    });
};

exports.savePost = (req, res, next) => {

  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost, // using spread operator to create object with all properties from createdPost object
        id: createdPost._id, // add extra property id
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed'
      });
    });
};

exports.editPost = (req, res, next) => {

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
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(
    result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successfull' });
      } else {
        res.status(404).json({ message: 'Not such a post found' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update post'
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting post failed'
      });
    });
};
