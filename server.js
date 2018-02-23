require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");
const bodyParser = require("body-parser");

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport'); // sendgrid



// sendgrid
var options = {
    auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENDGRID_PASSWORD
    }
}

const sendgrid = sgTransport(options);

const client = nodemailer.createTransport(sendgrid); // Integrations




app.use(bodyParser()); // configure body parser


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});


app.post("/receive", (req, res) => {

    // req.body.email // get the data { email:"", name:"", password:"" }
    console.log("Body: ", req.body);


    const email = {
        from: 'awesome@bar.com',
        to: req.body.email,
        subject: 'Hello',
        text: 'Hello world',
        html: '<b>Hello world</b>'
    };

    client.sendMail(email, (err, info) => {
        if(err){
            // TODO
            // NO EMAIL
            console.log("Error: ", err);

            res.status(409).json({ error: "Not able to send" }); // send error
        } else{

            // TODO
            // Email has been sent!
            console.log("Email has been sent!", info);

            res.redirect("/dashboard");
        }
    }) // send an email

});

app.listen(port, () => {
    console.log("Server is starting at port ", port);
});