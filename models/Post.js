const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    likes: { type: [String], default: [] }, // Array of usernames who liked the post
    comments: { type: [CommentSchema], default: [] },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);