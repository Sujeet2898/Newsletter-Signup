const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// Specifying static folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;

const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/f0ea15c88d";

  const options = {
    method: "POST",
    auth: "sujeet1:e690d8f77f2c4d338c7a3127edad2f6f-us10"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

  // console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
  res.redirect("/")
})

// Both Local Port and Heroku
app.listen(3000 || process.env.PORT, function () {
    console.log("Server is running on port 3000.");
  });

  // API Key: e690d8f77f2c4d338c7a3127edad2f6f-us10
  // List ID: f0ea15c88d