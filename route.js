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
var policies = require('./routes/policies');
var admin = require('./routes/admin');
var publicApi = require('./routes/publicApis');
var userPrivateApi = require('./routes/userPrivateApis');

var route = function (app) {
    app.use(function (req, res, next) {
        app.locals.year = parseInt(new Date().getFullYear());
        if (req.session.user) {
            app.locals.user = req.session.user;
        } else {
            app.locals.user = null;
        }
        next();
    });

    app.use('/api/public', publicApi);
    app.use('/api/private/user', userPrivateApi);
    app.use('/', routes);
    app.use('/policies', policies);
    app.use('/users', users);
    app.use('/login', auth);
    app.use('/auth', auth);
    app.use('/admin', admin);

    app.use('/report', report);
    app.use('/report-guide', report);
    app.use('/result', result);
    app.use('/user', user);
    app.use('/api/user', user);
    app.use('/card', card);
};

module.exports = route;