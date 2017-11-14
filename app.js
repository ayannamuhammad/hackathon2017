// Chris Joakim, Microsoft, 2017/11/13

var express = require('express');
var path    = require('path');
var bodyParser = require('body-parser');
var logger  = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json()) 

// Application routers
var index_router = require('./routes/index');
var data_router  = require('./routes/data');
var admin_router = require('./routes/admin');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Attach the Routers to the web app; endpoints are defined in the Routers.
app.use('/',      index_router);
app.use('/data',  data_router);
app.use('/admin', admin_router);

// error handler
app.use(function(err, req, res, next) {
    var date = new Date();
    res.status(err.status || 500);
    var obj = {};
    obj.date = date;
    obj.epoch = date.getTime();
    obj.err = err;
    res.json(obj);
});

module.exports = app;
