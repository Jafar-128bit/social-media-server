const express = require('express');
const router = express.Router();

const {addPost, editPostLike, deletePost, getPost} = require('../controller/postController');

router.get('/getPost', getPost);
router.post('/addPost', addPost);
router.patch('/editPostLike', editPostLike);
router.delete('/deletePost', deletePost);

module.exports = router;