const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

var items=["one", "two", "three"];
var workItems = ["code", "work"];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/check-list", (req,res)=>{

    let day = date.getDay();
    
    res.render("list", {listTitle: day, newListItems: items});

});


app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work", newListItems: workItems});
});

app.post("/additem", (req,res)=>{
    item = req.body.newItem;
    console.log(req.body.list);

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }

    else {
        items.push(item);
        res.redirect("/check-list");
    }

}); 

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
});