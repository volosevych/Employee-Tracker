const mysql = require("mysql");
const inquirer = require("inquirer");
const express = require("express");

var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());