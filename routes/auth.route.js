const controller = require('../controllers/auth.controller')
const express = require('express')
const authRouter = express.Router()
const passport = require('passport')

// POST /auth/signup
// Sign up a new user with the provided username and password
// Request body: { username: String, password: String }
// Response: 201 if successful, 400 if invalid request data or username already exists
authRouter.post('/signup', passport.authenticate('signup', { session: false }), controller.signup)

// POST /auth/login
// Log in an existing user with the provided username and password
// Request body: { username: String, password: String }
// Response: 200 if successful, 400 if invalid request data or username doesn't exist, 401 if invalid password
authRouter.post('/login', controller.login)

module.exports = authRouter;
