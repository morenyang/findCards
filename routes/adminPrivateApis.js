/**
 * Created by MorenYang on 2016/12/1.
 */
/**
 * Created by MorenYang on 2016/11/29.
 */
var express = require('express');
var router = express.Router();
var _ = require('underscore');

var User = require('../models/user');
var Card = require('../models/card');

var listSize = 10;

router.use(function (req, res, next) {
    if (!req.session.user || req.session.user.role == 1) {
        res.json({status: false, message: 'auth error'});
    } else next();
});

router.post('/passwordChange', function (req, res) {
    var uid = req.body.uid;
    var old_password = req.body.old_password;
    var new_password = req.body.new_password;
    if (!req.session.user || !(req.session.user.role == 1) || !(req.session.user._id == uid)) {
        return res.json({status: false, message: 'auth error'});
    } else {
        User.findOne({_id: uid}, function (err, user) {
            if (err) console.log(err);
            user.comparePassword(old_password, function (err, isMatched) {
                if (err) console.log(err);
                if (isMatched) {
                    var _user = _.extend(user, {password: new_password});
                    _user.save(function (err, user) {
                        if (err) console.log(err);
                        req.session.user = user;
                        req.app.locals.user = null;
                        return res.json({status: true, message: 'success', data: user});
                    });
                } else {
                    return res.json({status: false, message: 'password error'});
                }
            })
        })
    }
});

router.get('/queryReports', function (req, res) {

});

module.exports = router;