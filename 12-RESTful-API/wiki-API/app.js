const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
    useNewUrlParser: true
});

const articleScheme = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleScheme);

app.get("/", (req,res)=>{
    res.send("hi");
});

app.route("/articles")

.get(async (req, res)=>{
    let articles = await Article.find({});
    res.send(articles);
})

.post((req, res)=>{

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    if(newArticle.save()){
        res.send("Article saved successfully ");
    }
})

.delete(async (req, res)=>{
    
    if(await Article.deleteMany({})){
        res.send("Successfully deleted all articles");
    }
    else{
        res.send("All articles weren't deleted");
    }
});

//routes for "article/:title"

app.route("/article/:articleTitle")

.get(async (req,res)=>{
    let article = await Article.findOne({title: req.params.articleTitle});
    if(article){
        res.send(article);
    }
    else{
        res.send("Couldn't find any article with that title");
    }
})

.put(async (req,res)=>{
    if(await Article.replaceOne(
        {title: req.params.articleTitle}, 
        {title: req.body.title, content: req.body.content})){
        res.send("Successfully updated the entire document"); 
        }
    else{
        res.send("Couldn't update document");
    }
})

.patch(async (req, res)=>{
    if(await Article.updateOne(
        {title: req.params.articleTitle}, //condition
        {$set: req.body}, //specific updates
    )){
        res.send("Successfully updated");
    }
    else{
        res.send("Couldn't update document");
    }
})

.delete(async (req, res)=>{    
    if(await Article.deleteOne({title: req.params.articleTitle})){
        res.send("Successfully deleted the article");
    }
    else{
        res.send("Couldn't delete this article");
    }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});