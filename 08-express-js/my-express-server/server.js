const express = require("express");
const app = express(); //represents express module

//first is parameter is the location and second is callback function
app.get("/", function(req, res) {
    res.send("hello");
})

app.listen(3000, function() {
    console.log("server started on port 3000");
});