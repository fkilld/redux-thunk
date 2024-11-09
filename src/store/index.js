// Import the configureStore function from Redux Toolkit - this is the modern way to set up a Redux store
import { configureStore } from '@reduxjs/toolkit'

// Import the posts reducer from our postsSlice file - this will handle all posts-related state updates
import postsReducer from './postsSlice'

// Create the Redux store using configureStore, which provides good defaults and simplified setup
const store = configureStore({
  // Define the root reducer as an object - each key represents a "slice" of our global state
  reducer: {
    // The 'posts' key in our state will be managed by the postsReducer
    posts: postsReducer,
  },
})

// Export the configured store to be used in our app (typically in Provider component)
export default store
