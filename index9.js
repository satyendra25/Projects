import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import flash from 'express-flash';

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/twitter-clone', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const tweetSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    text: String,
    author: String,

    content: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [{ content: String }],
    // comments: [{ type:String , ref: 'Comment'}], // Array of comments, you can modify as needed
    username: String,
    // Other user fields...
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
    { timestamps: true }
);


tweetSchema.plugin(passportLocalMongoose);
const Tweet = new mongoose.model('Tweet', tweetSchema);
passport.use(Tweet.createStrategy());
passport.use(new LocalStrategy({
    usernameField: 'email'
}, Tweet.authenticate()
));

passport.serializeUser(Tweet.serializeUser());
passport.deserializeUser(Tweet.deserializeUser());

const name = "Saten";

app.get('/', (req, res) => {
    res.render('twitter/index')
});

app.get('/login', (req, res) => {
    res.render('twitter/login')
});

app.post('/login', (req, res) => {
    const user = new Tweet({ username: req.body.username, password: req.body.password });
    const tweets = Tweet.find().sort({ createdAt: -1 });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local", {
                successRedirect: 'tweets',
                failureRedirect: 'tweets'
            })
                (req, res, function () {
                    res.redirect("/tweets", {tweets});
                    // res.render('index', { tweets, name });

                })
        }
    });
});

app.get('/register', (req, res) => {
    res.render('twitter/register')
});

app.post("/register", (req, res) => {
     Tweet.register(
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
        Tweet.find({}, '-_id name text') // Exclude the _id field from the query
            .then(users => {
                res.render('tweets', { nameList: users, user: req.user });
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                res.render('tweets', { nameList: [], user: req.user });
            });
    } else {
        res.redirect("/login");
    }
});

app.post('/tweets', (req, res) => {
    const text = req.body.text;
    const user = req.user; // Fetch the authenticated user
    const tweet = new Tweet({ text: text });
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


app.get('/main', async (req, res) => {
    try {
        const tweets = await Tweet.find().sort({ createdAt: -1 });
        res.render('main', { tweets, name });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


app.get('/index', async (req, res) => {
    try {
        const tweets = await Tweet.find().sort({ createdAt: 'desc' });
        res.render('index', { tweets });
    } catch (err) {
        console.error("Error fetchin tweets :", err);
        res.status(500).send('Internal Server Error')
    }
})
app.post('/index', async (req, res) => {
    try {
        const { tweet } = req.body.comment;
        const newTweet = new Tweet({ content: tweet });
        await newTweet.save();
        res.redirect('index');
    } catch (err) {
        console.error("Error saving comment", err)
    }
})
// app.post('/tweets', async (req, res) => {
//     const { author, content } = req.body;
//     try {
//         await Tweet.create({ author, content });
//         // Fetch all tweets again after adding a new tweet
//         const tweets = await Tweet.find().sort({ createdAt: -1 });
//         res.render('index', { tweets, name });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });


// app.post('/tweets', async (req, res) => {
//     try {
//         const newTweet = new Tweet(req.body);
//         await newTweet.save();
//         res.redirect('/tweets');

//     } catch (err) {

//         console.error(err);
//         res.status(500).send('Server Error');

//     }
// });

const newTweet = new Tweet({
    _id: new mongoose.Types.ObjectId(), // Generate new ObjectId
    author: 'John Doe',
    content: "this is a tweet"
});
newTweet.save()
    .then(tweet => {
        console.log('Tweet saved:', tweet);
    })
    .catch(err => {
        console.error('Error saving tweet:', err);
    });



app.get('/search', (req, res) => {
    res.render('search')
})

app.get('/profile', (req, res) => {
    // Fetch user information from the database
    // Example: const user = await User.findById(req.user.id);
    const user = Tweet.findById(req.body)
    // Render the profile page with user data and messages
    res.render('profile', { user: user, successMessage: req.flash('success'), errorMessage: req.flash('error') });
});


app.post('/profile', (req, res) => {
    const { name, email, password } = req.body;

    // Update user's information in the database
    // Example: Find user by ID and update name, email, and password fields
    const user = Tweet.findById(req.user._id);
    res.redirect('/profile', { user: user }); // Redirect to the user's profile page after updating
});

app.get('/edit-profile', (req, res) => {
    res.render('edit-profile');
});


// Like a tweet
app.post('/like', async (req, res) => {
    const { tweetId } = req.body;
    try {
        // Find the tweet by ID and update its likes count
        await Tweet.findByIdAndUpdate(tweetId, { $inc: { likes: 1 } });
        // Redirect back to the homepage or send a success response
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Like post Error');
    }
});
app.post('/', function (req, res) {
    const comment = req.body.content;
    const newItem = new Tweet({ comment: comment });
    newItem.save();
    res.redirect("/");
})

// Comment on a tweet
app.post('/comment', async (req, res) => {
    const { tweetId, comment } = req.body;
    try {
        // Find the tweet by ID and push the new comment to the comments array
        const tweet = await Tweet.findById(tweetId);
        tweet.comments.push(comment);
        await tweet.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Comment post Error');
    }
});
const userProfile = {
    _id: '123456789', // User ID
    username: 'example_user', // User's username
    // Other user profile information...
};

app.post('/follow/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const currentUser = await User.findById(req.user.id); // Assuming you have user authentication and req.user contains the current user's data
        const targetUser = await User.findById(userId);

        // Update followers and following arrays
        currentUser.following.push(targetUser._id);
        targetUser.followers.push(currentUser._id);

        await currentUser.save();
        await targetUser.save();

        res.status(200).send('Followed successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Function to follow a user
async function followUser(userId) {
    try {
        const response = await fetch(`/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            // Reload the page or update UI to indicate successful follow
            location.reload(); // Reload the page
        } else {
            console.error('Failed to follow user');
        }
    } catch (err) {
        console.error(err);
    }
}

// Function to unfollow a user
async function unfollowUser(userId) {
    try {
        const response = await fetch(`/unfollow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            // Reload the page or update UI to indicate successful unfollow
            location.reload(); // Reload the page
        } else {
            console.error('Failed to unfollow user');
        }
    } catch (err) {
        console.error(err);
    }
}


app.use('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


app.listen(port);
console.log("app is running")