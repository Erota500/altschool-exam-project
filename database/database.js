const mongoose = require('mongoose');
require('dotenv').config()
require('dotenv').config({ path: 'config.env' })

// Connect to the MongoDB database specified in the 'MONGO_URL' environment variable
// The connection is established when the 'connected' event is emitted
// If there is an error while connecting, the 'error' event is emitted with the error object as an argument
function connectMongoDB() {
    mongoose.connect(process.env.MONGO_URL)
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB Successfully');
    })
    mongoose.connection.on('error', (e) => {
        console.log('An error occured while connecting to MongoDB');
        console.log(e);
    })
}

module.exports = { connectMongoDB }
