// import express from 'express';
const express = require('express');
const app = express();
const db = require('./db');
// import db from './db.js';

app.get('/', function(req, res){
    res.send("Hello")
})

app.listen(5000, () => {
    console.log(" app running ");
})