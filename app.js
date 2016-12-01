var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

// router
var route = require('./route');

// app
var app = express();
app.set('env', 'production');

// database
var dbpath = 'mongodb://localhost/findCards';
var mongoose = require('mongoose');
mongoose.connect(dbpath);

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    outputStyle: 'compressed',
    indentedSyntax: true,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
    secret: 'findCards',
    resave: false,
    saveUninitialized: true,

    store: new mongoStore({
        url: dbpath,
        collection: 'sessions',
        autoRemove: 'interval',
        autoRemoveInterval: 60 // In minutes. Default
    })
}));

// route
route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: (err.status || 500) + ' - findCards',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: (err.status || 500) + ' - findCards',
        pageType: 'findcards-err',
        url: req.url,
        status: err.status,
        message: err.message,
        error: {}
    });
});

module.exports = app;
