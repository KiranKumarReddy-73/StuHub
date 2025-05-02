const express = require('express');
const Post = require('../models/Post');
const io = require('../server'); // Importing Socket.IO instance

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    try {
        const { content, author } = req.body;
        const newPost = new Post({ content, author });
        const savedPost = await newPost.save();

        // Emit real-time update
        io.emit('newPost', savedPost);

        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Like a post
router.post('/:id/like', async (req, res) => {
    try {
        const { username } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.likes.includes(username)) {
            post.likes = post.likes.filter((user) => user !== username);
        } else {
            post.likes.push(username);
        }

        const updatedPost = await post.save();

        // Emit real-time update
        io.emit('updatePost', updatedPost);

        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
    try {
        const { author, content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.comments.push({ author, content });
        const updatedPost = await post.save();

        // Emit real-time update
        io.emit('updatePost', updatedPost);

        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;