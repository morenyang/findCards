/**
 * Created by MorenYang on 2016/11/21.
 */
var express = require('express');
var router = express.Router();
var _ = require('underscore');

var User = require('../models/user');
var Card = require('../models/card');

router.use(function (req, res, next) {
    if (!req.session.user) {
        return res.json({status: false, message: 'unauthorized access'});
    } else {
        next();
    }
});

router.post('/changeUserName', function (req, res) {
    var username = req.query.username;
    if (username != req.session.user.username)
        return res.json({status: false, message: 'authorized error'});
    var uid = req.body.uid;
    var name = req.body.name;
    User.findById(uid, function (err, user) {
        if (!user)
            return res.json({status: false, message: 'user not found'});
        if (user.username != username)
            return res.json({status: false, message: 'authorized error'});
        else {
            var _user = _.extend(user, {name: name});
            _user.save(function (err, user) {
                if (err) console.log(err);
                req.session.user = user;
                req.app.locals.user = user;
                return res.json({status: true, message: 'success', data: {username: username, name: name}});
            })
        }
    })
});

router.get('/countUserReports', function (req, res) {
    if (!req.query.username) return res.json({status: false, message: 'request parameter error'});
    var username = req.query.username;
    if (!req.session.user || req.session.user.username != username) {
        return res.json({status: false, message: 'authorized error'});
    } else {
        Card.countUserReports(req.session.user._id, function (err, counts) {
            if (err) console.log(err);
            return res.json({
                status: true,
                counts: counts,
                message: 'success',
                data: {username: username, counts: counts}
            });
        });
    }
});

router.get('countUserReportsByType', function (req, res) {
    if (!req.query.username || !(req.query.type || req.query.tab))
        return res.json({
            status: false,
            message: 'request parameter error'
        });
    var username = req.query.username;
    var type;
    if (req.query.type) {
        type = req.query.type;
    } else {
        if (tab == 'pick') type = 0; else type = 1;
    }
    if (!req.session.user || req.session.user.username != username) {
        return res.json({status: false, message: 'authorized error'});
    } else {
        Card.countUserReportsByType(req.session.user._id, type, function (err, counts) {
            if (err) console.log(err);
            return res.json({
                status: true,
                counts: counts,
                message: 'success',
                data: {username: username, counts: counts, type: type}
            });
        });
    }
});

module.exports = router;