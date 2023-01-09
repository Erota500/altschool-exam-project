const { blogModel } = require('../models/blog.model.js')
const moment = require('moment');
const { userModel } = require('../models/auth.model.js');

async function getAllBlogs(req, res) {
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    var skip = (page - 1) * limit;
    try {
        const author = req.query.author
        const title = req.query.title
        const tags = req.query.tags
        if (author) {
            var blogs = await blogModel.find({ author: author }).skip(skip).limit(limit)
        } else if (title) {
            var blogs = await blogModel.find({ title: title }).skip(skip).limit(limit)
        } else if (tags) {
            var blogs = await blogModel.find({ tags: tags }).skip(skip).limit(limit)
        }
        else {
            var blogs = await blogModel.find({ "state": "published" }).skip(skip).limit(limit)
            if (!blogs.state === "published") {
                return res.status(401).send(`There are no blogs that are published yet`)
            }
        }
        return res.status(200).json({ blogs })
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}
async function getBlogByOrder(req, res) {
    // Check for query parameters for sorting by read count, reading time, or timestamp
    const readcount = req.query.readcount
    const reading_time = req.query.readingtime
    const timestamp = req.query.timestamp
    // Calculate the page and skip values for pagination
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    var skip = (page - 1) * limit;
    // If the readcount query parameter is "asc", sort the blogs by read count in ascending order
    if (readcount === "asc") {
        const asc = await blogModel.find({ "state": "published" }).sort({ read_count: 1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "read_count data in ascending order",
            blogs: { asc }
        })
    // If the readcount query parameter is "desc", sort the blogs by read count in descending order
    } else if (readcount === "desc") {
        const des = await blogModel.find({ "state": "published" }).sort({ read_count: -1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "read_count data in descending order",
            blogs: { des }
        })
    // If the reading_time query parameter is "asc", sort the blogs by reading time in ascending order
    } else if (reading_time === "asc") {
        const asc = await blogModel.find({ "state": "published" }).sort({ reading_time: 1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "reading_time data in ascending order",
            blogs: { asc }
        })
    // If the reading_time query parameter is "desc", sort the blogs by reading time in descending order
    } else if (reading_time === "desc") {
        const des = await blogModel.find({ "state": "published" }).sort({ reading_time: -1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "reading_time data in descending order",
            blogs: { des }
        })
    // If the timestamp query parameter is "asc", sort the blogs by timestamp in ascending order
    } else if (timestamp === "asc") {
        const asc = await blogModel.find({ "state": "published" }).sort({ timestamp: 1 }).skip(skip).limit(limit)
        return res.status(200).json({
            message: "timestamp data in ascending order",
            blogs: { asc }
        })
    // If the timestamp query parameter is "desc", sort the blogs by timestamp in descending order
    } else if (timestamp === "desc") {
        const des = await blogModel.find({ "state": "published" }).sort({ timestamp: -1 }).skip(skip).limit(limit)
       return res.status(200).json({
            message: "timestamp data in descending order",
            blogs: { des }
        })
    }
    const des = await blogModel.find({ "state": "published" }).sort({ read_count: -1 }).skip(skip).limit(limit)
    return res.status(200).json({
        message: "Highest read blog",
        blogs: des
    })
}
async function addBlog(req, res) {
    // Try block to catch any errors that may occur when creating the blog
    try {
        // Get the email of the user making the request
        const email = req.user.email
        // Get the author parameter from the request body, or use the user's email as the author if not provided
        var author = req.body.author
        // Get the title and tags from the request body
        const title = req.body.title
        const tags = req.body.tags
        // Get the body of the blog from the request body
        const body = req.body.body
        // Calculate the reading time of the blog based on the number of words and a reading speed of 225 words per minute
        const wpm = 225;
        const words = body.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        // Create the blog with the provided parameters and calculated reading time
        const blog = await blogModel.create({
            title: req.body.title,
            description: req.body.description,
            tags: `#${title.toLowerCase()}` || tags,
            author: author || email,
            timestamp: moment().toDate(),
            body: body,
            reading_time: `${time}min`
        })
        // Find the user in the database
        const user = await userModel.findById(req.user._id)
        // If the user is not found, return an unauthorized error
        if (!user) {
            return res.status(401).send("Unauthorized, pls login or signup")
        }
        // Add the blog to the user's list of blogs and set the user as the owner of the blog
        user.blogs.push(blog)
        blog.user = user
        // Save the updated user to the database
        await user.save()
        // Return a success message and the details of the created blog
        return res.status(200).json({
            message: "blog added successfully",
            blog: {
                _id: blog._id,
                title: blog.title,
                description: blog.description,
                tags: blog.tags,
                author: blog.author,
                state: blog.state,
                read_count: blog.read_count,
                reading_time: blog.reading_time,
                body: blog.body,
                timestamp: blog.timestamp
            },
            user: {
                _id: user._id
            }
        })
    // Catch any errors that may occur and return a server error response
    } catch (e) {
        return res.status(500).send(e)
    }
}
async function editBlogState(req, res) {
    // Get the state parameter from the request body
    const state = req.body.state
    // Get the id parameter from the request params
    const { id } = req.params;
    // Try block to catch any errors that may occur when updating the blog
    try {
        // Find the blog by its id and update the state to the provided state parameter
        const blog = await blogModel.findByIdAndUpdate(id, { "state": state }, { new: true })
        // If the blog is not found, return a not found error
        if (!blog) {
            return res.status(404).send(`Could not find blog`)
        }
        // Return a success message and the details of the updated blog
        return res.status(200).json({
            message: `Blog published successfully`,
            blog: { blog }
        })
    // Catch any errors that may occur and return a server error response
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}
async function editBlog(req, res) {
    // Get the id parameter from the request params
    var { id } = req.params
    // Get the body, title, description, and tags parameters from the request body
    var body = req.body.body
    var title = req.body.title
    var description = req.body.description
    // If the tags parameter is not provided, set it to a hash tag of the lowercase title
    var tags = req.body.tags || `#${ title.toLowerCase()}`
    var author = req.body.author
    // Set the words per minute value to 225
    var wpm = 225;
    // If the body parameter is provided
    if (body) {
        // Calculate the reading time based on the length of the body
        var words = body.trim().split(/\s+/).length;
        var time = Math.ceil(words / wpm);
        // Find the blog by its id and update the body, title, description, tags, author, and reading time
        var blog = await blogModel.findByIdAndUpdate(id, { "body": body, "title": title, "description": description, "tags": tags, "author": author, "reading_time": time }, { new: true })
    } 
    // If the body parameter is not provided
    else {
        // Find the blog by its id and update the title, description, tags, and author
        var blog = await blogModel.findByIdAndUpdate(id, {"title": title, "description": description, "tags": tags, "author": author}, { new: true })
    }
    // Return a success message and the updated blog details
    return res.status(200).json({
        message: "Blog updated successfully",
        blog: blog
    })
}
/**
 * Deletes a blog with the specified ID.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The response object with a message indicating success or failure
 */
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
/**
 * Retrieves a blog with the specified ID.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The response object with the blog data or an error message
 */
async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id).populate("user");
    if (!blog) {
      return res.status(404).send("Could not find blog");
    } else if (blog.state !== "published") {
      return res.status(400).send("This is not a published blog");
    } else {
      const userId = await blog.user._id;
      const user = await userModel.findById(userId);
      blog.read_count++;
      await blog.save();
      return res.status(200).json({
        message: `Data for ${blog.title} by ${blog.author}`,
        blog: {
          _id: blog._id,
          title: blog.title,
          description: blog.description,
          tags: blog.tags,
          author: blog.author,
          state: blog.state,
          read_count: blog.read_count,
          reading_time: blog.reading_time,
          body: blog.body,
          timestamp: blog.timestamp,
        },
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    return res.send(error);
  }
}
/**
 * Retrieves the blogs owned by the authenticated user.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The response object with the user's blog data or an error message
 */
async function myBlogs(req, res) {
  try {
    var page = req.query.page * 1 || 1;
    var limit = req.query.limit * 1 || 20;
    var skip = (page - 1) * limit;
    const id = req.user._id;
    var state = req.query.state;
    if (!state) {
      var blogs = await userModel.findById(id).populate({
        path: "blogs",
        options: { skip: skip, limit: limit },
      }).select("blogs").exec();
      return res.status(200).json({
        message: "These are your blogs",
        user: blogs,
      });
    } else {
      var blogs = await userModel.findById(id).populate({
        path: "blogs",
        options: { skip: skip, limit: limit },
        match: { state: state },
      }).select("blogs").exec();
      return res.status(200).json({
        message: `These are your ${state} blogs`,
        user: blogs,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

module.exports = {
  getAllBlogs,
  addBlog,
  editBlog,
  editBlogState,
  myBlogs,
  getBlogById,
  getBlogByOrder,
  deleteBlog,
};
