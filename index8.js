import express, { Router } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// import encrypt from 'mongoose-encryption';
import md5 from 'md5';
// import 'dotenv/config';

import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {Strategy as LocalStrategy} from 'passport-local';
import session from 'express-session';


// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

userSchema.plugin(passportLocalMongoose);

const router = express.Router();

const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({secret:'your_secret_key',
resave: false,
saveUninitialized: false
}));

mongoose.connect("mongodb://localhost:27017/tweetDB", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    username:String,
    password:String,
    
});

const SECRET= "Thissatenishot";
const User = new mongoose.model("User", userSchema);

//  userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

// const User = mongoose.model('User', { name: String, email: String, password: String });
let textdata = [];

app.get('/', (req, res) => {
    const logo = "Twitter";
    const login = "Login"
            res.render("twitter/index", {
                logo, login,
    })
})

app.get('/tweets22', (req, res) => {
    res.render('twitter/tweets22',{  welcome: ''
      
    })
})

app.post("/tweets22", (req, res) => {
    const newName = req.body.name;
    const text = req.body.textarea;
    const welcome = "Welcome to tweet page";
    res.render('twitter/tweets22', {
        text, newName,
        welcome
    })
})



// app.get(delete)
app.post('/delete', function(req, res) {
    const indexToRemove = req.body.indexToRemove;
    textdata.splice(indexToRemove, 1);
    res.render('twitter/tweets', {textdata
    })
})

app.get('/register22', (req, res) => {
    res.render('twitter/register22', { message: ''})
})

app.post("/register22", async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email:req.body.email,
        password: md5(req.body.password)
    })
    newUser.save();
    const { email,password } = md5(req.body);  
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('twitter/register22', { message: 'Email already registered' });
        }
        // If email does not exist, create new user
        await User.create({ email, password });
        // res.send('User registered successfully');       
    res.render('twitter/tweets22', { welcome: " Welcome to Tweets page though Registration"})
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/login22', (req, res) => {
    res.render('twitter/login22', { incorrect: '' })
})

router.post('/login22', passport.authenticate ('local', {
    successRedirect:'/twitter/tweets22',
    failureRedirect: '/twitter/login22',
    failureFlash:true
}));

router.post('/register22', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.error("Error register user:", err);
            return res.redirect('/twitter/register');
        }
        res.redirect('/login22')
    })
})
app.post('/login22', (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    User.findOne({ email: email }).then((foundUser) => {
        if(foundUser) {
            if(foundUser.password === password) {
                // res.redirect('/tweets22', {welcome: "Welcome to tweets page"})
                res.render('twitter/tweets22', { welcome: "Welcome to tweets page through login"})
            }else {
                res.redirect('/login22')
            }
        } else {
            // res.redirect('/login22')
            res.render('twitter/login22' , { incorrect : "The email id or password that you've entered is incorrect."})

        }
    })
})



app.listen(port);
console.log("app is running")