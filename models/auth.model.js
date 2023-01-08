const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

// Define the user schema
const userSchema = new Schema({
    // The `created_at` field will store the date the user was created
    created_at: Date,
    // `first_name` and `last_name` are required fields of type String
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    // `email` is a required field of type String, and it must be lowercase and unique
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    // `password` is a required field of type String
    password: {
        type: String,
        required: true
    },
    // The `blogs` field is an array of references to the `blogs` collection
    blogs:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'blogs'
            }
        ]
});

// Define a middleware function that will be run before saving the document to the database
userSchema.pre(
    'save',
    async function (next) {
        // If the password field has not been modified, skip this middleware function
        if (!this.isModified('password')) return;
        // Hash the user's password with bcrypt
        const hash = await bcrypt.hash(this.password, 6)
        // Replace the plain text password with the hashed password
        this.password = hash
        // Call the next middleware function
        next()
    }
)

// Define a custom method for validating a user's password
userSchema.methods.validPassword = async function (password) {
    // Compare the provided plain text password with the hashed password stored in the database
    const compare = await bcrypt.compare(password, this.password)
    // Return the result of the comparison
    return compare
}

// Create the user model from the schema
const userModel = mongoose.model('users', userSchema);

// Export the user model
module.exports = { userModel }
