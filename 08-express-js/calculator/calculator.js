const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);

    var result = num1+num2;
    res.send("result of the calculation is " + result);

});

app.get("/bmi", function(req, res) {
    res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmi-calculator", function(req,res) {
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);

    var bmi = weight/(height*height);
    res.send("your bmi is " + bmi);
});

app.listen(3000, function() {
    console.log("server is running on port 3000");
});