//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const secret = "thisIsOurLittleSecret.";

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
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
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save(err => {
    if (err) console.log(err);
    else res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundedUser) => {
    if (err) console.log(err);
    else {
      if (foundedUser) {
        if (foundedUser.password === req.body.password) {
          res.render("secrets");
        }
      }
      res.redirect("/");
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
