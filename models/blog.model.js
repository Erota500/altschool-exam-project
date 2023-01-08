const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Define the blog schema
const blogSchema = new Schema({
    // The `title` field is a required field of type String
    title: {
        type: String,
        required: true
    },
    // The `description` field is an optional field of type String
    description: {
        type: String
    },
    // The `tags` field is an optional field of type String
    tags: {
        type: String
    },
    // The `author` field is an optional field of type String
    author: {
        type: String
    },
    // The `timestamp` field is an optional field of type String
    timestamp: {
        type: String
    },
    // The `state` field is a required field of type String, with a default value of 'draft'
    // The field is also restricted to the values 'draft' and 'published' using the `enum` keyword
    state: {
        type: String,
        required: true,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    // The `read_count` field is a required field of type Number, with a default value of 0
    read_count: {
        type: Number,
        required: true,
        default: 0
    },
    // The `reading_time` field is a required field of type String, with a default value of "0s"
    reading_time: {
        type: String,
        required: true,
        default: "0s"
    },
    // The `body` field is a required field of type String
    body: {
        type: String,
        required: true
    },
    // The `user` field is a reference to the `users` collection
    user:
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
})

// Create the blog model from the schema
const blogModel = mongoose.model('blogs', blogSchema)

// Export the blog model
module.exports = {blogModel}
