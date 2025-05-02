// App State
let currentUser = null;
let posts = [];

// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const loginButton = document.getElementById('login-button');
const postButton = document.getElementById('post-button');
const usernameInput = document.getElementById('username');
const secretCodeInput = document.getElementById('secret-code');
const postContent = document.getElementById('post-content');
const postList = document.getElementById('post-list');
const charCount = document.getElementById('char-count');

// Login Handler
function handleLogin() {
    const username = usernameInput.value.trim();
    const secretCode = secretCodeInput.value.trim();

    if (!username || username.length < 3) {
        alert('Please enter a username with at least 3 characters');
        return;
    }

    if (secretCode !== 'StuSidd@017') {
        alert('Invalid secret code.');
        return;
    }

    currentUser = { username };
    authContainer.style.display = 'none';
    dashboard.style.display = 'block';
}

// Post Creation
function createPost() {
    const content = postContent.value.trim(); // Get the content of the post

    if (!content) {
        alert('Post content cannot be empty.');
        return;
    }

    // Create a new post object
    const newPost = {
        id: Date.now(),
        content,
        author: currentUser.username,
        timestamp: new Date().toLocaleString(),
        likes: [],
        comments: [], // Empty comments array for future functionality
    };

    // Add the post to the posts array
    posts.unshift(newPost);

    // Clear the post input and update the character count
    postContent.value = '';
    charCount.textContent = '0';

    // Re-render the posts
    renderPosts();
}

// Render Posts
function renderPosts() {
    postList.innerHTML = ''; // Clear all current posts

    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.dataset.postId = post.id;

        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">${post.author}</span>
                <span class="post-time">${post.timestamp}</span>
            </div>
            <div class="post-content">${escapeHTML(post.content)}</div>
            <div class="post-actions">
                <div class="post-action like-action" data-post-id="${post.id}">
                    <i class="icon">♥</i> <span>${post.likes.length}</span> Likes
                </div>
                <div class="post-action comment-action" data-post-id="${post.id}">
                    <i class="icon">💬</i> ${post.comments.length} Comments
                </div>
            </div>
            <div class="comments-section">
                <div class="new-comment">
                    <input type="text" placeholder="Add a comment..." class="comment-input" />
                    <button class="comment-button" data-post-id="${post.id}">Comment</button>
                </div>
                <div class="comments-list">
                    ${renderComments(post.comments)}
                </div>
            </div>
        `;

        postList.appendChild(postElement);

        // Attach event listeners for likes and comments
        const likeAction = postElement.querySelector('.like-action');
        const commentButton = postElement.querySelector('.comment-button');
        const commentInput = postElement.querySelector('.comment-input');

        likeAction.addEventListener('click', () => toggleLike(post.id));
        commentButton.addEventListener('click', () => {
            addComment(post.id, commentInput.value);
            commentInput.value = '';
        });
    });
}

// Render Comments
function renderComments(comments) {
    return comments
        .map(
            (comment) => `
            <div class="comment">
                <span class="comment-author">${comment.author}</span>: 
                <span>${escapeHTML(comment.content)}</span>
            </div>
        `
        )
        .join('');
}

// Toggle Like
function toggleLike(postId) {
    const post = posts.find((p) => p.id === postId);

    if (!post) return;

    const userIndex = post.likes.indexOf(currentUser.username);

    if (userIndex === -1) {
        // Add like
        post.likes.push(currentUser.username);
    } else {
        // Remove like
        post.likes.splice(userIndex, 1);
    }

    renderPosts(); // Re-render posts to update the UI
}

// Add Comment
function addComment(postId, content) {
    const post = posts.find((p) => p.id === postId);

    if (!post) return;

    if (!content.trim()) {
        alert('Comment cannot be empty.');
        return;
    }

    post.comments.push({
        id: Date.now(),
        content: content.trim(),
        author: currentUser.username,
    });

    renderPosts(); // Re-render posts to update the UI
}

// Escape HTML to prevent XSS
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update Character Count
postContent.addEventListener('input', () => {
    charCount.textContent = postContent.value.length;
});

// Initialize App
function init() {
    loginButton.addEventListener('click', handleLogin);
    postButton.addEventListener('click', createPost);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);