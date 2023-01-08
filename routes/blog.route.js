const controller = require('../controllers/blogApi.controller')
const express = require('express')
const blogRouter = express.Router()
const route = express.Router()

// GET /blogs
// Get a list of all blogs
// Response: 200 with an array of blog objects { id: String, title: String, content: String, author: String, date: Date }
route.get('/blogs', controller.getAllBlogs)

// POST /blogs/new
// Create a new blog with the provided title, content, and author
// Request body: { title: String, content: String, author: String }
// Response: 201 if successful, 400 if invalid request data
blogRouter.post('/blogs/new', controller.addBlog)

// GET /blogs
// Get a list of all blogs created by the logged-in user
// Response: 200 with an array of blog objects { id: String, title: String, content: String, author: String, date: Date }
blogRouter.get('/blogs', controller.myBlogs)

// GET /blogs/order
// Get a list of all blogs sorted by date in descending order
// Response: 200 with an array of blog objects { id: String, title: String, content: String, author: String, date: Date }
route.get('/blogs/order', controller.getBlogByOrder)

// GET /blogs/:id
// Get a specific blog by its ID
// Response: 200 with the blog object { id: String, title: String, content: String, author: String, date: Date }
route.get('/blogs/:id', controller.getBlogById)

// PATCH /blogs/:id/edit
// Change the publication state of a specific blog by its ID
// Request body: { state: Boolean }
// Response: 200 if successful, 404 if blog not found
blogRouter.patch('/blogs/:id/edit', controller.editBlogState)

// PUT /blogs/:id/edit
// Update the title, content, and author of a specific blog by its ID
// Request body: { title: String, content: String, author: String }
// Response: 200 if successful, 404 if blog not found
blogRouter.put('/blogs/:id/edit', controller.editBlog)

// DELETE /blogs/:id
// Delete a specific blog by its ID
// Response: 200 if successful, 404 if blog not found
blogRouter.delete('/blogs/:id', controller.deleteBlog)

module.exports = {
    route,
    blogRouter
}
