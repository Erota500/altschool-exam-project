const express = require('express')
const { connectMongoDB } = require('./database/database')
const app = express()

// Load environment variables
require('dotenv').config({ path: 'config.env' })
require('dotenv').config()

// Set port
const port = process.env.PORT || 3000;

// Load passport
const passport = require('passport')

// Load routers
const authRouter = require('./routes/auth.route')
const { blogRouter } = require('./routes/blog.route')
const { route } = require('./routes/blog.route')

// Load passport middleware
require('./middleware/passport')

// Use body parser and url encoder middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Use the passport middleware to authenticate requests to the 'user' route
app.use('/user', passport.authenticate('jwt', { session: false }), blogRouter)

// Use the auth router for all requests to '/'
app.use('/', authRouter)

// Use the route router for all requests to '/'
app.use('/', route)

// Welcome message for the root route
app.get('/', (req, res) => {
res.send('WELCOME TO BASETRADE BLOG')
})

// Connect to the database
connectMongoDB()

// Start the server
app.listen(port, () => {
console.log(Server listening on port ${port})
})
