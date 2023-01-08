const { blogModel } = require('../models/blog.model.js')
const moment = require('moment');
const { userModel } = require('../models/auth.model.js');

// Define a function for handling requests to get all blogs
async function getAllBlogs(req, res) {
    // Get the page and limit query parameters, or default to page 1 and limit 20
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    // Calculate the number of documents to skip based on the page and limit
    var skip = (page - 1) * limit;
    try {
        // Get the author, title, and tags query parameters
        const author = req.query.author
        const title = req.query.title
        const tags = req.query.tags
        // If the author query parameter is present, find all published blogs by that author
        if (author) {
            var blogs = await blogModel.find({ author: author }).skip(skip).limit(limit)
        } 
        // If the title query parameter is present, find all published blogs with that title
        else if (title) {
            var blogs = await blogModel.find({ title: title }).skip(skip).limit(limit)
        } 
        // If the tags query parameter is present, find all published blogs with those tags
        else if (tags) {
            var blogs = await blogModel.find({ tags: tags }).skip(skip).limit(limit)
        }
        // If none of the above query parameters are present, find all published blogs
        else {
            var blogs = await blogModel.find({ "state": "published" }).skip(skip).limit(limit)
            // If there are no published blogs, return an error
            if (!blogs.state === "published") {
                return res.status(401).send(`There are no blogs that are published yet`)
            }
        }
        // Send a JSON response with the blogs
        return res.status(200).json({ blogs })
    } catch (e) {
        console.log(e)
        // If there is an error, return it
        return res.send(e)
    }
}

// Define a function for handling requests to get blogs sorted by a specific field
async function getBlogByOrder(req, res) {
    // Get the readcount, reading_time, and timestamp query parameters
    const readcount = req.query.readcount
    const reading_time = req.query.readingtime
    const timestamp = req.query.timestamp
    // Get the page and limit query parameters, or default to page 1 and limit 20
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    // Calculate the number of documents to skip based on the page and limit
    var skip = (page - 1) * limit;
    // If the readcount query parameter is "asc", find all published blogs sorted by read count in ascending order
    if (readcount === "asc") {
        const asc =
