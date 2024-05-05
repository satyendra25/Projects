//index.js

import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import "dotenv/config";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = 3000;
mongoose
  .connect("mongodb://127.0.0.1:27017/tweetdb")
  .then(() => console.log("Connected to mongodb!"));
const userschema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
userschema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userschema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
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
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/tweets", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne(req.user._id).then((data) => {
      if (data) {
        res.render("tweets", { user: data });
      }
    });
  } else {
    res.redirect("login");
  }
});
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local",
       { successRedirect: "tweets" })
       (req, res, function () {
          req.res.redirect("/tweets");
        }
      );
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});

   app.get("/delete",(req,res)=>{
    
   })

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});

// tweets.ejs

<%- include('partials/header') %>

    <section class="tweets-section p-5">
        <div class="container">
            <div class="row">
                <div class="col-4">
                    <div class="card" style="width: 18rem;">
                        <img src="https://www.pixground.com/wp-content/uploads/2023/06/Blue-Abstract-Background-4K-Wallpaper-1536x864.webp" class="card-img-top" alt="...">
                        <div class="card-body">
                            <p class="card-text mb-1">Welcome!</p>
                            <h2 class="card-title"><%= user.username %></h2>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a href="/logout" class="btn btn-outline-dark">Logout</a>
                    </div>
                </div>
                <div class="col-8">
                    <form class="row g-3 justify-content-center">
                        <div class="col-md-12">
                            <textarea class="form-control"
                             id="exampleFormControlTextarea1"
                              rows="3" placeholder="What would you like to share today?"></textarea>
                        </div>
                        <div class="col-12 d-flex justify-content-end">
                          <button type="submit" class="btn btn-primary">Share</button>
                        </div>
                    </form>
                    <div class="mt-5"></div>
                    <div class="card mb-4">
                        <div class="card-body">
                          <h5 class="card-title">John Doe</h5>
                          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                          <h5 class="card-title">John Doe</h5>
                          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                          <h5 class="card-title">John Doe</h5>
                          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                          <h5 class="card-title">John Doe</h5>
                          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                          <h5 class="card-title">John Doe</h5>
                          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<%- include('partials/footer') %>

// login.ejs

<%- include('partials/header') %>

    <section class="full">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-6">
                    <h1 class="wordmark mb-4">
                        <i class="fa-brands fa-twitter"></i>
                        <span class="logo">twitter</span>
                    </h1>
                    <h5 class="text-center">
                        Login
                        <br>
                        Welcome back!
                    </h5>
                    <form action="login" method="post" class="row g-3 justify-content-center">
                        <div class="col-md-7">
                          <label for="inputEmail4" class="form-label"><i class="fa-solid fa-envelope"></i> Email</label>
                          <input type="email" class="form-control" id="inputEmail4" name="username">
                        </div>
                        <div class="col-md-7">
                          <label for="inputPassword4" class="form-label"><i class="fa-solid fa-key"></i> Password</label>
                          <input type="password" class="form-control" id="inputPassword4" name="password">
                        </div>
                        <div class="col-7 d-flex justify-content-end">
                          <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                    </form>
                    <div class="swap row justify-content-center mt-4">
                        <div class="col-7">
                            <p>
                                <a href="/register">
                                    New user? Click here to register.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<%- include('partials/footer') %>

// register.ejs

<%- include('partials/header') %>

    <section class="full">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-6">
                    <h1 class="wordmark mb-4">
                        <i class="fa-brands fa-twitter"></i>
                        <span class="logo">twitter</span>
                    </h1>
                    <h5 class="text-center">
                        Register
                        <br>
                        Create a new account
                    </h5>
                    <form action="register" method="post" class="row g-3 justify-content-center">
                        <div class="col-md-7">
                          <label for="inputEmail4" class="form-label"><i class="fa-solid fa-user"></i> Name</label>
                          <input type="text" class="form-control" id="inputEmail4" name="name">
                        </div>
                        <div class="col-md-7">
                            <label for="inputEmail4" class="form-label"><i class="fa-solid fa-envelope"></i> Email</label>
                            <input type="text" class="form-control" id="inputEmail4" name="username">
                        </div>
                        <div class="col-md-7">
                          <label for="inputPassword4" class="form-label"><i class="fa-solid fa-key"></i> Password</label>
                          <input type="password" class="form-control" id="inputPassword4" name="password">
                        </div>
                        <div class="col-7 d-flex justify-content-end">
                          <button type="submit" class="btn btn-primary">Register</button>
                        </div>
                    </form>
                    <div class="swap row justify-content-center mt-4">
                        <div class="col-7">
                            <p>
                                <a href="/login">
                                    Already a user? Click here to login.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<%- include('partials/footer') %>

// .env
SECRET=Mysecretisbluesky
