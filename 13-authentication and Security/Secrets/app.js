//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

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
    password: String
});

//add passport-local-mongoose plugin to schema
userSchema.plugin(passportLocalMongoose);

//DB model
const User = mongoose.model("User", userSchema);

//configure passport-local
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/secrets", (req,res)=>{

    if(req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
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

////////////////////////////////////////
app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
});