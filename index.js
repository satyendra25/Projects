import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import 'dotenv/config'

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/tweetDB')
    .then(() => console.log("Connected to mongodb"));

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());

app.use(passport.session());

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    text: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('twitter/index')
});

app.get('/login', (req, res) => {
    res.render('twitter/login')
});

app.post('/login', (req, res) => {
    const user = new User({ username: req.body.username, password: req.body.password });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local", {
                successRedirect: 'tweets',
                // failureRedirect: 'tweets'
            })
                (req, res, function () {
                    res.redirect("/tweets")
                })
        }
    });
});

app.get('/register', (req, res) => {
    res.render('twitter/register')
});

app.post("/register", (req, res) => {
    User.register(
        { name: req.body.name, username: req.body.username, email: req.body.email },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/tweets");
                });
            }
        }
    );
});


app.get('/tweets', (req, res) => {
    if (req.isAuthenticated()) {
        // Fetch user data and pass it to the template
        User.find({}, '-_id name text') // Exclude the _id field from the query
            .then(users => {
                res.render('twitter/tweets', { nameList: users, user: req.user });
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                res.render('twitter/tweets', { nameList: [], user: req.user });
            });
    } else {
        res.redirect("/login");
    }
});

app.post('/tweets', (req, res) => {
    const text = req.body.text;
    const user = req.user; // Fetch the authenticated user
    const tweet = new User({ text: text });
    tweet.save()
        .then(() => res.redirect('/tweets'))
        .catch(err => {
            console.error('Error saving tweet:', err);
            res.redirect('/tweets');
        });
});

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err)

        }
    });
    res.redirect("/");
});

app.listen(port, () => {
    console.log("My first express project is live");
})