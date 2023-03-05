//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//initialize express-session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

//inialize passport and us eit to manage sessions
app.use(passport.initialize());
app.use(passport.session()); 

//connection to mongoDB 
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

//DB schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    secret: String
});

//add passport-local-mongoose plugin to schema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//DB model
const User = mongoose.model("User", userSchema);

//configure passport-local
passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

//Configure passport-google-oauth20 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//Configure passport-facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//Routes
app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});


app.get("/logout", (req,res)=>{
    req.logOut(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//Routes to authenticate users through google
app.get("/auth/google",
passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets", 
passport.authenticate("google", { failureRedirect: "/login" }),
function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
});

//Routes to authenticate users through Fcaebook
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
});

//Route to view secrets
app.get("/secrets", (req,res)=>{
    User.find({"secret":{$ne: null}}, function(err, foundUsers){
        if(err){
            console.log(err);
        } else {
            if(foundUsers){
                res.render("secrets", {usersWithSecrets: foundUsers});
            }
        }
    });
});

//Route to let users submit secrets
app.get("/submit", (req,res)=>{
    if(req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/register", (req,res)=>{

    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", async (req,res)=>{
    const userLogin = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(userLogin, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    });
});

//Post request to submit a secret in db
app.post("/submit", (req,res)=>{
    const submittedSecret = req.body.secret;

    //finding current user using id
    User.findById(req.user.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    res.redirect("/secrets");
                });
            } else {
                console.log("No user  found");
            }
        }
    });

});

////////////////////////////////////////
app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
});