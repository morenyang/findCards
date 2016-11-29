/**
 * Created by MorenYang on 2016/11/21.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Card = require('../models/card');
var getAuth = require('../lib/getTssAuth');

router.get('/queryUserName', function (req, res) {
    if (!req.query.uid && !req.query.username) return res.json({status: false, message: 'request parameter error'});
    var uid = req.query.uid;
    var username = req.query.username;
    if (uid)
        User.findById(uid, function (err, user) {
            if (err) console.log(err);
            if (!user)
                return res.json({status: false, message: 'user not found'});
            return res.json({status: true, name: user.name, data: {username: user.username, name: user.name}});
        });
    else
        User.find({username: username}, function (err, user) {
            if (err) console.log(err);
            if (!user)
                return res.json({status: false, message: 'user not found'});
            return res.json({status: true, name: user.name, data: {username: user.username, name: user.name}});
        })
});

router.post('/queryUserAuth', function (req, res) {
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
                    return res.json({status: true, username: user.username, activation: true, data: user});
                } else {
                    return res.json({status: false, message: 'admin password error'});
                }
            })
        } else if (user && user.role == 1) {
            getAuth(username, password, function (auth) {
                if (auth) {
                    req.session.user = user;
                    req.app.locals.user = user;
                    if (user.activation) {
                        return res.json({status: true, username: user.username, activation: true, data: user});
                    } else {
                        return res.json({status: true, username: user.username, activation: false, data: user});
                    }
                } else {
                    return res.json({status: false, message: 'user password error'});
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
                            return res.json({status: true, username: user.username, activation: true, data: user});
                        } else {
                            return res.json({status: true, username: user.username, activation: false, data: user});
                        }
                    })
                } else {
                    return res.json({status: false, message: 'user not found or password error'});
                }
            })
        }
    })
});

module.exports = router;