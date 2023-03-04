const express = require("express");
const { Http2ServerRequest } = require("http2");
const https = require("https"); //native node module already bundled with node 
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, ()=>{
    console.log("server is running on port 3000!")
});

app.get("/weather", function(req,res) {

    res.redirect(__dirname + "/index.html");
});

app.post("/weather", function(req, res) {
    
    const query = req.body.cityName;
    const appid = "9de6ea72fc687974c6cdbd2101029fc2";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + appid;
    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(d) {
            // console.log(d);
            // the above gives hexadecimal data
            //to convert it in js

            const data = JSON.parse(d);
            const temp = data.main.temp;
            const descr = data.weather[0].description;
            const icon = data.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p> " + query + " is experiencing " + descr + ". </p>");
            res.write("<h1>The temp is " + temp + " degree celsius. </h1>");
            res.write("<img src = "+ imgUrl +">");
            res.send();
        })
    });
});