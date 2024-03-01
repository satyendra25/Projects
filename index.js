import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/tweetDB", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    textarea: String
});
const User = new mongoose.model("User", userSchema);

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
    res.render('twitter/tweets22',{
      
    })
})
// app.post('/tweets22', (req, res) => {
//     const inputtext = req.body.textarea;
//     const newinput = new User({textarea: inputtext});
//     newinput.save();
//     res.render('twitter/tweets22', {
//         inputtext: inputtext
//     })
// })

app.post("/tweets22", (req, res) => {
    const newName = req.body.name;
    const text = req.body.textarea;
    
    res.render('twitter/tweets22', {
        text, newName
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
    res.render('twitter/register22')
})
app.post("/register22", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    newUser.save();
    res.render('twitter/tweets22')
})

app.get('/login22', (req, res) => {
    const msg = "Welcome to Twitter"
    const login = "Login"
    res.render('twitter/login22', {
        msg, login
    })
})

app.post('/login22', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then((foundUser) => {
        if(foundUser) {
            if(foundUser.password === password) {
                res.redirect('/tweets22')
            }else {
                res.redirect('/login22')
            }
        } else {
            res.redirect('/login22')
        }
    })
})



app.listen(port);
console.log("app is running")