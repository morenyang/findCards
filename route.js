/**
 * Created by MorenYang on 2016/10/30.
 */

var app = require('./app');
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var report = require('./routes/report');
var result = require('./routes/result');
var user = require('./routes/user');
var card = require('./routes/card');

var route = function (app) {
    app.use(function (req, res, next) {
        if (req.session.user) {
            app.locals.user = req.session.user;
            app.locals.year = parseInt(new Date().getFullYear());
        }else {
            app.locals.user = null;
        }
        next();
    });

    app.use('/', routes);
    app.use('/users', users);
    app.use('/login', auth);
    app.use('/auth', auth);

    // require sign in and activation
    app.use(function (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        } else if (!req.session.user.activation) {
            return res.redirect('/auth/activation')
        } else {
            next();
        }
    });

    app.use('/report', report);
    app.use('/report-guide', report);
    app.use('/result', result);
    app.use('/user', user);
    app.use('/api/user', user);
    app.use('/card', card);
};

module.exports = route;