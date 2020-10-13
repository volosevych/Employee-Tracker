const mysql = require("mysql");
const inquirer = require("inquirer");
const express = require("express");

var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("*", (req, res) => {
    res.send("Successful get to wildcard")
});

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT)
});