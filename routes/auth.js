/**
 * Created by MorenYang on 2016/11/2.
 */

var express = require('express');
var router = express.Router();
var getAuth = require('../lib/getTssAuth');
var _ = require('underscore');

var User = require('../models/user');

router.get('/', function (req, res) {
    res.redirect('/auth/login');
});

router.get('/login', function (req, res, next) {
    if (!req.session.user) {
        res.render('login', {title: '登录到findCards'});
    } else if (!req.session.user.activation) {
        res.redirect('/auth/activation');
    } else {
        res.redirect('/user');
    }
});

router.get('/activation', function (req, res, next) {
    if (req.session.user && !req.session.user.activation) {
        res.render('activation', {title: '激活', username: req.session.user.username});
    }
    else {
        res.redirect('/login');
    }
});

router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.app.locals.user = null;
    return res.redirect('/');
});

router.post('/login/submit', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username}, function (err, user) {
        if (err) console.log(err);

        if (user && user.role != 1) {
            user.comparePassword(password, function (err, isMatched) {
                if (err) console.log(err);
                if (isMatched) {
                    req.session.user = user;
                    req.app.locals.user = user;
                    return res.redirect('/');
                } else {
                    return res.render('login', {title: '登录到findCards', alert: '用户名或密码错误！', username: req.body.username})
                }
            })
        } else if (user && user.role == 1) {
            getAuth(username, password, function (auth) {
                if (auth) {
                    req.session.user = user;
                    req.app.locals.user = user;
                    if (user.activation) {
                        return res.redirect('/');
                    } else {
                        return res.redirect('/auth/activation');
                    }
                } else {
                    return res.render('login', {title: '登录到findCards', alert: '用户名或密码错误！', username: req.body.username})
                }
            })
        } else {
            getAuth(username, password, function (auth) {
                if (auth) {
                    var _user = new User({username: username});
                    _user.save(function (err, user) {
                        if (err) console.log(err);
                        req.session.user = user;
                        req.app.locals.user = user;
                        if (user.activation) {
                            return res.redirect('/');
                        } else {
                            return res.redirect('/auth/activation');
                        }
                    })
                } else {
                    return res.render('login', {title: '登录到findCards', alert: '用户名或密码错误！', username: req.body.username})
                }
            })
        }
    })
});

router.post('/activation/submit', function (req, res) {
    var _username = req.session.user.username;
    if (req.body.username != _username) {
        delete res.session.user;
        res.app.locals.user = null;
        return res.render('/login', {title: '登录到findCards', alert: '操作非法，请重新登录！'});
    }
    else if (!req.body.name || req.body.name == '') {
        return res.render('/activation', {title: '激活你的账户', alert: '格式错误，请重新输入'});
    }

    User.findOne({username: _username}, function (err, user) {
        if (err) console.log(err);

        var _user = _.extend(user, {name: req.body.name, activation: true});
        _user.save(function (err, user) {
            if (err) console.log(err);
            req.session.user = user;
            req.app.locals.user = user;
            return res.redirect('/');
        })
    })
});

module.exports = router;