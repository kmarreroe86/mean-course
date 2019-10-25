const express = require('express');

const checkAuth = require('../custom_middleware/check-auth');
const storageFile = require('../custom_middleware/storage-file');
const PostService = require('../services/post-service');

const router = express.Router();



/**
 *  Get all posts
 * */
router.get('', PostService.getAllPosts);

// Get post by id
router.get('/:id', PostService.getPostById);

/**
 * Add new post.
 * Adding extra middleware to filter for an image file. multer module, will try
 * to find a single file and will find for an image.
 */
router.post('', checkAuth, storageFile, PostService.savePost);

/**
 Save edited post
*/
router.put('/:id', checkAuth, storageFile, PostService.editPost);

// Delete post
router.delete('/:id', checkAuth, PostService.deletePost);

module.exports = router;
