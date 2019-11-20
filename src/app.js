const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require('body-parser') ;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));



app.use('/api/auth',require('./controllers/authController'));

module.exports = app;