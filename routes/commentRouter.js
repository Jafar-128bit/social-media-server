const express = require('express');
const router = express.Router();

const {addComment, deleteComment, editCommentLike} = require('../controller/commentController')

router.get('/getComment', () => {
});
router.post('/addComment', addComment);
router.patch('/editCommentLike', editCommentLike);
router.delete('/deleteComment', deleteComment);

module.exports = router;