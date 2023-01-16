const express = require('express')
const app = express()
const passport = require('passport')
const logger = require('morgan')
const flash = require('express-flash')
const methodOverride = require("method-override")
const connectDB = require('./config/database')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const mainRoutes = require('./routes/main')
const postRoutes = require('./routes/posts')

require('dotenv').config({path: './config/.env'}) // use environment variables
require('./config/passport')(passport) // passport config

// connect to MongoDB
connectDB()

app.set('view engine', 'pug') // tell express we're using pug as template engine
app.use(express.static(__dirname + '/public')) // tell express to make 'public' folder accessible to the public by using built-in middleware
app.use(express.urlencoded({ extended:true })) // get data from forms
app.use(express.json()) // teach server to read JSON
app.use(logger('dev')) // tell to use morgan as logger
app.use(methodOverride("_method")) // override HTML forms to use PUT/DELETE requests
app.use(flash()) // use flash messages for errors, info, etc...

// setup sessions - stored in MongoDB
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// setup routes where the server is listening
app.use('/', mainRoutes)
app.use('/post', postRoutes)

// create server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}, you better go catch it!`)
})