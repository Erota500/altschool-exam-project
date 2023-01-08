const jwt = require('jsonwebtoken')
const passport = require('passport')

// Load environment variables from .env file
require('dotenv').config()
// Load environment variables from example.env file
require('dotenv').config({ path: 'example.env' })

// Define a function for handling signup requests
function signup(req, res) {
    try {
        // Send a JSON response indicating that the signup was successful
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    } catch (e) {
        console.log(e)
        return res.send(e)
    }
}

// Define an async function for handling login requests
async function login(req, res, next) {
    // Use passport to authenticate the login request
    passport.authenticate('login', async function (e, user, info) {
        try {
            if (e) {
                // If there is an error, pass it to the next middleware function
                return next(e)
            }
            if (!user) {
                // If the login credentials are invalid, return an error
                const error = new Error('email or Password is incorrect')
                return next(error)
            }

            // Use the req.login method to log the user in
            req.login(user, { session: false },
                async function (e) {
                    if (e) {
                        // If there is an error, pass it to the next middleware function
                        return next(e)
                    }
                    // Create a JSON web token (JWT)
                    const body = { _id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name };
                    const token = jwt.sign({ user: body }, process.env.SECRET || 'sth-secret', {
                        expiresIn: '1h'
                    })
                    // Send a JSON response indicating that the login was successful, along with the JWT
                    return res.status(200).json({message: "Login successful", token: token })
                })
        } catch (e) {
            // If there is an error, pass it to the next middleware function
            return next(e)
        }
    })(req, res, next)
}

// Export the signup and login functions
module.exports = {
    signup,
    login
}
