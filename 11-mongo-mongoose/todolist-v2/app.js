//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');

//creating a schema
const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "<--Welcome to todo list."
});

const item2 = new Item({
  name: "<--Hit + to add ana item."
});

const item3 = new Item({
  name: "<--Hit this to delete ana item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    if(foundItems.length===0) {
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err.message);
        }
        else{
          console.log("successfully added the default items");
        }
      });
      res.redirect("/");
    }

    if(err){
      console.log(err);
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
  
});

app.get("/:customList", function(req, res){
  var customList = _.capitalize(req.params.customList);

  List.findOne({name:customList}, function(err, foundList){
    if(!err){
      if(foundList){
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
      else{
        const list = new List({
          name:customList,
          items: defaultItems
        });
      
        list.save();
        res.redirect("/"+customList); 
      }
    }
    else{
      console.log("errorrsss in findOne");
    }
  })
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }

  else{
    List.findOne({name:listName}, function(err, foundList){
      if(!err){
        if(foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/"+foundList.name);
        }
      }
    });
  }
});

app.post("/delete", function(req, res){

  const checkedItemId = req.body.deletedItem;
  const listName = req.body.listName;

  if(listName==="Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log("OOPSSS!! ERROR");
      }
      else{
        res.redirect("/"); 
      }
    });
  }


  else{
    List.findOneAndUpdate(
      {name: listName},
      {$pull:{items:{_id: checkedItemId}}},
      function(err, foundList){
        if(!err){
          console.log("deleted successsssss");
          res.redirect("/"+listName);
        }
        else{
          console.log(err.message);
        }
      }
    );
  }
  
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
