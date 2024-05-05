

import express from 'express';
// : This line imports the Express.js framework, allowing you to create web applications and APIs using JavaScript.
import mongoose from 'mongoose';
// : This line imports Mongoose, an object data modeling (ODM) library for MongoDB and Node.js, which provides a straightforward schema-based solution to model your application data.
import bodyParser from 'body-parser';
// : This line imports the body-parser middleware, which parses incoming request bodies in a middleware before your handlers, and makes it available under the req.body property.
import session from "express-session";
// : This line imports the express-session middleware, which is used for managing user sessions in Express applications.
import passport from "passport";
// : This line imports the Passport middleware, which is an authentication middleware for Node.js.
import passportLocalMongoose from "passport-local-mongoose";
// : This line imports the Passport-Local Mongoose plugin, which simplifies building username and password login with Passport and Mongoose.
import 'dotenv/config';
// : This line imports and configures the dotenv module, which loads environment variables from a .env file into process.env.

const app = express();
// : This line creates an instance of the Express application, allowing you to configure routes, middleware, and other settings.
const port = 5000;
// : This line defines the port number on which the Express application will listen for incoming requests.

app.use(express.static('public'));
// : This line serves static files located in the 'public' directory. Static files include images, CSS, JavaScript, and other files that don't require processing by the server.
app.set('view engine', 'ejs');
// : This line sets the view engine to EJS (Embedded JavaScript), allowing you to render dynamic HTML pages using EJS templates.
app.use(bodyParser.urlencoded({ extended: false }));
// : This line configures the body-parser middleware to parse URL-encoded data from form submissions and make it available in req.body.

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
// app.use(session({...}));
// : This line configures the Express application to use sessions. It initializes the session middleware with the provided options.
// secret: process.env.SECRET,: This line sets the session secret to the value stored in the SECRET environment variable, which is loaded from the .env file using dotenv.
// resave: false,: This line configures the session middleware to not save the session if it hasn't been modified.
// saveUninitialized: false: This line configures the session middleware to not save uninitialized sessions.

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/testdb').then(() => console.log("Mongodb is connected"));
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    password: String,
    date: { type: Date, default: true }
});
const User = new mongoose.model('User', userSchema);
userSchema.plugin(passportLocalMongoose);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get('/', (req, res) => {
    res.render('index')
});

app.listen(port, () => {
    console.log('app is running ');
});


