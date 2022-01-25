const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userroute = require('./api/route/user');
const adminroute= require('./api/route/admin')
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://notedb:sidmongo@cluster0.jrtkr.mongodb.net/dell?retryWrites=true&w=majority');

mongoose.connection.on('error',err=>{
    console.log('connection fail hehe');
});

mongoose.connection.on('connected', connected=>{
    console.log('connected with mongo');
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user',userroute)
app.use('/admin',adminroute)

app.use((req, res, next) =>{
    res.status(200).json({
        message : 'app running'
    })
})


module.exports = app;