


const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentlog: {
        type: Object,
        required: true,
    },
    comments: {
        type: Array,
        required: true,
    },
    
    
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;





// user: {
//     type: Object,
//     required: true,
//        unique: true,
// },
    // parentcomment: {
    //     type: String,
    // },


    // comments: {
    //     type: Object,
    //     required: true,
    // },
    // requestAPI: {
    //     type: String,
    // },
    // videoId: {
    //     type: String,
    // },
    // commentId: {
    //     type: String,
    // },
    // replyId: {
    //     type: String,
    // },
    // newComment: {
    //     type: String,
    // },
    // editText: {
    //     type: String,
    // },
    // replyText: {
    //     type: String,
    // },
    // newtext: {
    //     type: String,
    // },
    // currentText: {
    //     type: String,
    // },
    // parentCommentId: {
    //     type: String,
    // },











