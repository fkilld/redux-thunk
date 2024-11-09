Sure! In this guide, we'll create a CRUD (Create, Read, Update, Delete) application using the JSONPlaceholder API, Redux Toolkit with Redux Thunk, and Webpack—all without using React. We'll use plain JavaScript for the UI interactions.

Let's get started!

## Overview

- **API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- **State Management**: Redux Toolkit with Redux Thunk
- **Module Bundler**: Webpack
- **UI**: Vanilla JavaScript and HTML

## Prerequisites

- Node.js and npm installed on your machine.

## Project Setup

### 1. Initialize the Project

Create a new directory for your project and navigate into it:

```bash
mkdir redux-crud-app
cd redux-crud-app
```

Initialize a new npm project:

```bash
npm init -y
```

### 2. Install Dependencies

Install the required packages:

```bash
npm install redux @reduxjs/toolkit redux-thunk
```

For development dependencies:

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader
```

- **webpack**: Module bundler.
- **webpack-cli**: Command-line interface for webpack.
- **webpack-dev-server**: Development server.
- **html-webpack-plugin**: Generates an HTML file.
- **css-loader** and **style-loader**: For handling CSS imports.

## Configure Webpack

Create a `webpack.config.js` file in the root directory:

```javascript
// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js', // Entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Output bundle
    clean: true, // Optional: cleans the output directory before emit
  },
  mode: 'development', // or 'production'
  module: {
    rules: [
      {
        test: /\.css$/, // For CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // HTML template
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve from 'dist' directory
    },
    port: 3000, // Development server port
    open: true, // Automatically open the browser
  },
}

```

## Project Structure

Create the following folder structure:

```
redux-crud-app/
├── dist/
├── node_modules/
├── src/
│   ├── index.html
│   ├── index.js
│   ├── styles.css
│   └── store/
│       ├── index.js
│       └── postsSlice.js
├── package.json
└── webpack.config.js
```

## Creating the UI

### 1. `index.html`

Create an `index.html` file in the `src` folder:

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redux CRUD App</title>
</head>
<body>
  <h1>Redux CRUD Application</h1>
  
  <!-- Form for creating/updating posts -->
  <form id="post-form">
    <input type="hidden" id="post-id" />
    <input type="text" id="post-title" placeholder="Title" required />
    <textarea id="post-body" placeholder="Body" required></textarea>
    <button type="submit">Save</button>
  </form>

  <!-- List of posts -->
  <ul id="posts-list"></ul>

  <!-- Delete Confirmation -->
  <div id="delete-confirmation" style="display: none;">
    <p>Are you sure you want to delete this post?</p>
    <button id="confirm-delete">Yes</button>
    <button id="cancel-delete">No</button>
  </div>

</body>
</html>
```

### 2. `styles.css`

Create a `styles.css` file in the `src` folder (you can style it as you like).

```css
/* src/styles.css */
/* Basic styling */
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

#post-form {
  margin-bottom: 20px;
}

#posts-list {
  list-style-type: none;
  padding: 0;
}

.post-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.post-item h2 {
  margin: 0 0 10px;
}

.post-item button {
  margin-right: 5px;
}
```

## Setting Up Redux

### 1. Create the Redux Store

Create an `index.js` file inside the `src/store/` directory:

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

export default store;
```

### 2. Create the Posts Slice

Create a `postsSlice.js` file inside the `src/store/` directory:

```javascript
// src/store/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Async actions using createAsyncThunk

// Fetch posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return response.json();
});

// Add post
export const addPost = createAsyncThunk('posts/addPost', async (post) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
});

// Update post
export const updatePost = createAsyncThunk('posts/updatePost', async (post) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
});

// Delete post
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE',
  });
  return id;
});

// Posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Synchronous actions (if any)
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch posts.';
      })
      // Add post
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;
```

## Entry Point

Create an `index.js` file in the `src` folder:

```javascript
// src/index.js
import './styles.css';
import store from './store/index';
import {
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
} from './store/postsSlice';

// DOM Elements
const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title');
const postBodyInput = document.getElementById('post-body');
const deleteConfirmation = document.getElementById('delete-confirmation');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

let postIdToDelete = null;

// Render posts
const renderPosts = () => {
  const state = store.getState();
  const { posts, loading, error } = state.posts;

  // Clear existing posts
  postsList.innerHTML = '';

  if (loading) {
    postsList.innerHTML = '<li>Loading...</li>';
    return;
  }

  if (error) {
    postsList.innerHTML = `<li>${error}</li>`;
    return;
  }

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.className = 'post-item';

    li.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <button data-id="${post.id}" class="edit-btn">Edit</button>
      <button data-id="${post.id}" class="delete-btn">Delete</button>
    `;

    postsList.appendChild(li);
  });
};

// Subscribe to store updates
store.subscribe(renderPosts);

// Initial fetch of posts
store.dispatch(fetchPosts());

// Handle form submission
postForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = postIdInput.value;
  const title = postTitleInput.value;
  const body = postBodyInput.value;

  if (id) {
    // Update existing post
    store.dispatch(updatePost({ id, title, body }));
  } else {
    // Add new post
    store.dispatch(addPost({ title, body }));
  }

  // Reset form
  postForm.reset();
  postIdInput.value = '';
});

// Handle Edit and Delete buttons
postsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    const state = store.getState();
    const post = state.posts.posts.find((post) => post.id == id);

    postIdInput.value = post.id;
    postTitleInput.value = post.title;
    postBodyInput.value = post.body;
  }

  if (e.target.classList.contains('delete-btn')) {
    postIdToDelete = e.target.dataset.id;
    deleteConfirmation.style.display = 'block';
  }
});

// Handle Delete Confirmation
confirmDeleteBtn.addEventListener('click', () => {
  store.dispatch(deletePost(postIdToDelete));
  deleteConfirmation.style.display = 'none';
  postIdToDelete = null;
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteConfirmation.style.display = 'none';
  postIdToDelete = null;
});
```

## Update `package.json`

Add scripts to your `package.json`:

```json
// package.json
{
  // ...
  "scripts": {
    "start": "webpack serve --open",
    "build": "webpack"
  },
  // ...
}
```

## Running the Application

Start the development server:

```bash
npm run start
```

This should open your browser at `http://localhost:3000` (or the port you specified). You should see the CRUD application interface.

## Notes

- **CORS Issues**: Since JSONPlaceholder is a public API, you shouldn't face CORS issues. However, if you do, consider using a CORS proxy or setting up appropriate headers.

- **JSONPlaceholder Limitations**: Note that JSONPlaceholder doesn't actually create, update, or delete posts on the server. It simulates these actions and returns the expected responses.

## Conclusion

You've successfully created a CRUD application using Redux Toolkit with Redux Thunk and Webpack, all without React. This demonstrates how Redux can be used for state management in any JavaScript application, not just those built with React.

