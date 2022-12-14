require('dotenv').config()
require('dotenv').config({ path: 'config.env' })
const express = require('express')
const { connectMongoDB } = require('./database/database')
const app = express()
const port = process.env.PORT || 3000;
const passport = require('passport')
const authRouter = require('./routes/auth.route')

// Middleware to handle passport authentication
require('./middleware/passport')

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Import routes
const { blogRouter } = require('./routes/blog.route')
const { route } = require('./routes/blog.route')

// Use the imported routes and apply passport authentication
app.use('/user', passport.authenticate('jwt', { session: false }), blogRouter)
app.use('/', authRouter)
app.use('/', route)

// Endpoint to test if the server is running correctly
app.get("/homepage", (req, res) => {
    return res.status(200).json({ message: "successful" })
})

// Default route for all other requests
app.use("*", (req, res) => {
    return res.status(404).json({ message: "route not found" })
})

module.exports = app;
