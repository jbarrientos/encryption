//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

//console.log(process.env.API_KEY);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"]
// });
//

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (!err) {
      const user = new User({
        email: req.body.username,
        password: hash
      });

      user.save(err => {
        if (err) console.log(err);
        else res.render("secrets");
      });
    } else {
      res.send(err);
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundedUser) => {
    if (err) console.log(err);
    else if (foundedUser) {
      bcrypt.compare(req.body.password, foundedUser.password, (err, result) => {
        if (result === true) res.render("secrets");
        else res.send("/");
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
