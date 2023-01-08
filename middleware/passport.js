const passport = require('passport')
const localStategy = require('passport-local').Strategy;
const { userModel } = require('../models/auth.model')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config()
require('dotenv').config({ path: 'config.env' })
const moment = require('moment')

// Use the JSON Web Token (JWT) strategy for authentication
// The 'secretOrKey' option specifies the secret used to sign the JWT
// The 'jwtFromRequest' option specifies a function that extracts the JWT from the request
// If the JWT is valid, the 'async' function is called with the token payload as an argument
passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async function (token, next) {
            try {
                return next(null, token.user)
            } catch (e) {
                next(e)
            }
        }
    )
)

// Use the local (username/password) strategy for sign up
// The 'usernameField' and 'passwordField' options specify the names of the fields in the request body
// The 'passReqToCallback' option is set to 'true' to pass the entire request to the callback function
// If the sign up is successful, the 'async' function is called with the new user object as an argument
passport.use(
    'signup',
    new localStategy(
        {
            usernameField: "email",
            passwordField: 'password',
            passReqToCallback: true
        },
        async function (req, username, password, next) {
            const email = req.body.email
            const first_name = req.body.first_name
            const last_name = req.body.last_name
            try {
                const user = await (await userModel.create({ email, password, first_name, last_name }))
                return next(null, user)
            } catch (e) {
                next(e)
            }
        }
    )
)

// Use the local (username/password) strategy for login
// The 'usernameField' and 'passwordField' options specify the names of the fields in the request body
// The 'passReqToCallback' option is set to 'true' to pass the entire request to the callback function
// If the login is successful, the 'async' function is called with the user object as an argument
// If the login fails, the function is called with 'null', 'false', and an error message as arguments
passport.use(
    'login',
    new localStategy(
        {
            usernameField: "email",
            passwordField: 'password',
            passReqToCallback: true
        },
        async function (req, username, password, next) {
            const email = req.body.email;
            try {
                const user = await
