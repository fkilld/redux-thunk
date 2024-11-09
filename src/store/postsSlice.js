// Import necessary functions from Redux Toolkit for creating slices and handling async operations
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Define the initial state structure for the posts slice
// posts: Array to store all posts
// loading: Boolean flag to track loading state
// error: String to store any error messages
const initialState = {
  posts: [],
  loading: false,
  error: null,
}

// === Async Action Creators ===

// Create an async thunk for fetching all posts
// This will handle the API call to get all posts from the JSONPlaceholder API
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  // Make GET request to the posts endpoint
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  // Parse and return the JSON response
  return response.json()
})

// Create an async thunk for adding a new post
// Takes a post object as parameter containing the post details
export const addPost = createAsyncThunk('posts/addPost', async (post) => {
  // Make POST request to create a new post
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    // Specify POST method for creating new resource
    method: 'POST',
    // Convert post object to JSON string
    body: JSON.stringify(post),
    // Set proper content type header for JSON data
    headers: { 'Content-Type': 'application/json' },
  })
  // Parse and return the created post from response
  return response.json()
})

// Create an async thunk for updating an existing post
// Takes a post object containing updated data and post ID
export const updatePost = createAsyncThunk('posts/updatePost', async (post) => {
  // Make PUT request to update specific post by ID
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${post.id}`,
    {
      // Specify PUT method for updating existing resource
      method: 'PUT',
      // Convert updated post object to JSON string
      body: JSON.stringify(post),
      // Set proper content type header for JSON data
      headers: { 'Content-Type': 'application/json' },
    }
  )
  // Parse and return the updated post from response
  return response.json()
})

// Create an async thunk for deleting a post
// Takes the post ID as parameter
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  // Make DELETE request to remove specific post by ID
  await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    // Specify DELETE method for removing resource
    method: 'DELETE',
  })
  // Return the ID of deleted post for state update
  return id
})

// Create the posts slice containing the reducer and actions
const postsSlice = createSlice({
  // Name of the slice, used in action types
  name: 'posts',
  // Initial state defined above
  initialState,
  // Object for defining synchronous reducers (empty in this case)
  reducers: {},
  // Builder callback for handling async action cases
  extraReducers: (builder) => {
    builder
      // Handle fetchPosts pending state
      .addCase(fetchPosts.pending, (state) => {
        // Set loading to true while fetching
        state.loading = true
        // Clear any previous errors
        state.error = null
      })
      // Handle fetchPosts success state
      .addCase(fetchPosts.fulfilled, (state, action) => {
        // Set loading back to false
        state.loading = false
        // Update posts array with fetched data
        state.posts = action.payload
      })
      // Handle fetchPosts error state
      .addCase(fetchPosts.rejected, (state) => {
        // Set loading back to false
        state.loading = false
        // Set error message
        state.error = 'Failed to fetch posts.'
      })
      // Handle addPost success state
      .addCase(addPost.fulfilled, (state, action) => {
        // Add new post to beginning of posts array
        state.posts.unshift(action.payload)
      })
      // Handle updatePost success state
      .addCase(updatePost.fulfilled, (state, action) => {
        // Find index of post to update
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        )
        // If post exists, update it with new data
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })
      // Handle deletePost success state
      .addCase(deletePost.fulfilled, (state, action) => {
        // Filter out the deleted post from posts array
        state.posts = state.posts.filter((post) => post.id !== action.payload)
      })
  },
})

// Export the reducer function for store configuration
export default postsSlice.reducer
