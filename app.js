const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request")

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/contact", function(req,res){
    res.sendFile(__dirname+"/contact.html");
});

app.post("/contact/send", function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const description = req.body.description;
    console.log(description);

    const data = {
        members : [
            {
                email_address : email,
                status : 'subscribed',
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us7.api.mailchimp.com/3.0/lists/fb61cb872d";
    const options = {
        method : "POST",
        auth : "admin:acff42c7a5f128e1dfab2f9cbe5a6966-us7"
    }

    const myRequest = https.request(url, options, function(response){
        response.on('data', function(d){
            if(response.statusCode == 200){
                res.sendFile(__dirname+"/contact-response-success.html");
            }
            else{
                console.log(response.statusCode,JSON.parse(d));
                res.sendFile(__dirname+"/contact-response-failure.html");
            }
        });
        response.on('error', function(e){
            console.log(e);
        });
    });

    myRequest.write(jsonData);
    myRequest.end();

});

app.post("/contact/done", function(req, res){
    res.redirect("/");
});

app.post("/contact/failed", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("listening at port 3000...");
});