// Import required CSS styles
import './styles.css'
// Import Redux store configuration
import store from './store/index'
// Import action creators for posts management
import { fetchPosts, addPost, updatePost, deletePost } from './store/postsSlice'

// Get references to DOM elements for posts list
const postsList = document.getElementById('posts-list')
// Get reference to the form for adding/editing posts
const postForm = document.getElementById('post-form')
// Get reference to hidden input storing post ID for editing
const postIdInput = document.getElementById('post-id')
// Get reference to input field for post title
const postTitleInput = document.getElementById('post-title')
// Get reference to input field for post body
const postBodyInput = document.getElementById('post-body')
// Get reference to delete confirmation modal
const deleteConfirmation = document.getElementById('delete-confirmation')
// Get reference to confirm delete button in modal
const confirmDeleteBtn = document.getElementById('confirm-delete')
// Get reference to cancel delete button in modal
const cancelDeleteBtn = document.getElementById('cancel-delete')

// Variable to store ID of post pending deletion
let postIdToDelete = null

// Function to render posts list in the DOM
const renderPosts = () => {
  // Get current state from Redux store
  const state = store.getState()
  // Destructure posts state to get posts array, loading and error states
  const { posts, loading, error } = state.posts

  // Clear the current posts list
  postsList.innerHTML = ''

  // Show loading message if posts are being fetched
  if (loading) {
    postsList.innerHTML = '<li>Loading...</li>'
    return
  }

  // Show error message if there was an error fetching posts
  if (error) {
    postsList.innerHTML = `<li>${error}</li>`
    return
  }

  // Iterate through posts and create DOM elements for each
  posts.forEach((post) => {
    // Create list item for post
    const li = document.createElement('li')
    // Add CSS class for styling
    li.className = 'post-item'

    // Set inner HTML with post content and action buttons
    li.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <button data-id="${post.id}" class="edit-btn">Edit</button>
      <button data-id="${post.id}" class="delete-btn">Delete</button>
    `

    // Add post to the list
    postsList.appendChild(li)
  })
}

// Subscribe to Redux store changes to update UI
store.subscribe(renderPosts)

// Fetch initial posts when app loads
store.dispatch(fetchPosts())

// Handle form submission for adding/editing posts
postForm.addEventListener('submit', (e) => {
  // Prevent default form submission
  e.preventDefault()

  // Get values from form inputs
  const id = postIdInput.value
  const title = postTitleInput.value
  const body = postBodyInput.value

  // If ID exists, update existing post, otherwise create new post
  if (id) {
    // Dispatch update action
    store.dispatch(updatePost({ id, title, body }))
  } else {
    // Dispatch create action
    store.dispatch(addPost({ title, body }))
  }

  // Reset form after submission
  postForm.reset()
  // Clear hidden ID input
  postIdInput.value = ''
})

// Handle click events for Edit and Delete buttons
postsList.addEventListener('click', (e) => {
  // Handle edit button clicks
  if (e.target.classList.contains('edit-btn')) {
    // Get post ID from button data attribute
    const id = e.target.dataset.id
    // Get current state
    const state = store.getState()
    // Find post to edit
    const post = state.posts.posts.find((post) => post.id == id)

    // Populate form with post data
    postIdInput.value = post.id
    postTitleInput.value = post.title
    postBodyInput.value = post.body
  }

  // Handle delete button clicks
  if (e.target.classList.contains('delete-btn')) {
    // Store ID of post to delete
    postIdToDelete = e.target.dataset.id
    // Show delete confirmation modal
    deleteConfirmation.style.display = 'block'
  }
})

// Handle click on confirm delete button
confirmDeleteBtn.addEventListener('click', () => {
  // Dispatch delete action
  store.dispatch(deletePost(postIdToDelete))
  // Hide confirmation modal
  deleteConfirmation.style.display = 'none'
  // Reset post ID to delete
  postIdToDelete = null
})

// Handle click on cancel delete button
cancelDeleteBtn.addEventListener('click', () => {
  // Hide confirmation modal
  deleteConfirmation.style.display = 'none'
  // Reset post ID to delete
  postIdToDelete = null
})
