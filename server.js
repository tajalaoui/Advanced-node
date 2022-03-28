"use strict"
require("dotenv").config()
const express = require("express")
const app = express()
const myDB = require("./connection")
const fccTesting = require("./freeCodeCamp/fcctesting.js")
const session = require("express-session")
const passport = require("passport")
const db = require("mongodb")
const ObjectID = require("mongodb").ObjectID

app.set("view engine", "pug")

fccTesting(app) //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)

app.use(passport.initialize())
app.use(passport.session())

// app.route("/").get((req, res) => {
//   res.render(process.cwd() + "/views/pug", { title: "Hello", message: "Please login" })
// })

myDB(async (client) => {
  const myDataBase = await client.db("database").collection("users")

  // Be sure to change the title
  app.route("/").get((req, res) => {
    //Change the response to render the Pug template
    res.render("pug", {
      title: "Connected to Database",
      message: "Please login",
    })
  })

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    db.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc)
    })
  })

  // Be sure to add this...
}).catch((e) => {
  app.route("/").get((req, res) => {
    res.render("pug", { title: e, message: "Unable to login" })
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Listening on port " + PORT)
})
