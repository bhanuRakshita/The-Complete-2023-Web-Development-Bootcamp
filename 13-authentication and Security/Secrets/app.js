//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//connection to mongoDB 
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

//DB schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//DB model
const User = mongoose.model("User", userSchema);

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

app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password),
    });

    if(newUser.save()){
        res.render("secrets");
    }else{
        res.send("Couldn't register user successfully.");
    }
});

app.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    const foundUser = await User.findOne({email: username});
    if(foundUser){
        if(foundUser.password===password){
            res.render("secrets");
        }else{
            res.send("passwords didn't match");
        }
    }else{
        res.send("User not found");
    }
})
////////////////////////////////////////
app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
});