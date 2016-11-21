/**
 * Created by MorenYang on 2016/11/21.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Card = require('../models/card');

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

module.exports = router;