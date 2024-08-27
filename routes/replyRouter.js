const express = require('express');
const router = express.Router();

const {addReply, deleteReply, editReplyLike} = require('../controller/replyController');

router.get('/getReply', () => {
});
router.post('/addReply', addReply);
router.patch('/editReplyLike', editReplyLike);
router.delete('/deleteReply', deleteReply);

module.exports = router;