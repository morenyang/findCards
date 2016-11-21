/**
 * Created by MorenYang on 2016/11/13.
 */
var express = require('express');
var router = express.Router();
var Card = require('../models/card');
var User = require('../models/user');

router.use(function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    } else if (!req.session.user.activation) {
        return res.redirect('/auth/activation')
    } else {
        next();
    }
});

router.get('/:reportid', function (req, res) {
    var reportid = parseInt(req.params.reportid);
    Card.findOne({reportId: reportid}, function (err, card) {
        if (!card || ( (card.picker.user && card.picker.user != req.session.user._id) && (card.loser.user != req.session.user._id))) {
            return res.redirect('/user');
        } else {
            var status = card.valid ? card.matched ? '已匹配' : '未匹配' : '已失效';
            var cardNo = card.cardNo.slice(0, 6) + ' ' + card.cardNo.slice(6, card.cardNo.length), studentName = card.studentName, studentNo = card.studentNo;
            var report = {
                status: status,
                cardNo: cardNo,
                studentNo: studentNo,
                studentName: studentName,
                reportid: reportid
            };
            if (card.picker.user) {
                getUserInfo(card.picker, function (picker) {
                    var picker = picker;
                    if (card.loser.user) {
                        getUserInfo(card.loser, function (loser) {
                            var loser = loser;
                            return res.render('card', {report: report, picker: picker, loser: loser});
                        })
                    } else {
                        var loser = {reporterName: "", phone: "", weChat: ""};
                        return res.render('card', {report: report, picker: picker, loser: loser});
                    }
                });
            } else {
                var picker = {reporterName: "", phone: "", weChat: ""};
                if (card.loser.user) {
                    getUserInfo(card.loser, function (loser) {
                        var loser = loser;
                        return res.render('card', {report: report, picker: picker, loser: loser});
                    })
                } else {
                    var loser = {reporterName: "", phone: "", weChat: ""};
                    return res.render('card', {report: report, picker: picker, loser: loser});
                }
            }
        }
    });
});

var getUserInfo = function (card_User, callBack) {
    User.findById(card_User.user, function (err, user) {
        var user_report = {
            reporterName: user.name,
            phone: card_User.contact.phone,
            weChat: card_User.contact.weChat,
            reportAt: new Date(card_User.reportAt).toLocaleString()
        };
        callBack(user_report);
    })
};

module.exports = router;