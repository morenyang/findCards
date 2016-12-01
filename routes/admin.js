/**
 * Created by MorenYang on 2016/11/29.
 */
var express = require('express');
var router = express.Router();
var _ = require('underscore');

var User = require('../models/user');

router.get('/createAdminUser', function (req, res) {
    User.find({role: 0}, function (err, users) {
        if (err) console.log(err);
        if (users.length == 0) {
            var _adminUser = new User({
                username: 'admin',
                role: 0,
                password: 'findCards',
                name: 'Admin',
                activation: true
            });

            _adminUser.save(function (err, user) {
                if (err) console.log(err);
                return res.render('message', {
                    title: '提示',
                    message: '管理员账户已创建',
                    data: '管理员账户已创建',
                    redirectTo: '/user'
                });
            })
        } else {
            return res.render('message', {
                title: '提示',
                message: '管理员账户已存在',
                data: '管理员账户已存在',
                redirectTo: '/user'
            });
        }
    });
});

router.use(function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    } else if (req.session.user.role == 1) {
        return res.redirect('/user')
    } else {
        next();
    }
});

router.get('/', function (req, res) {

});

module.exports = router;