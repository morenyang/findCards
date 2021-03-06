/**
 * Created by MorenYang on 2016/11/9.
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

router.get('/:type/:reportId', function (req, res) {
    var reportId = req.params.reportId;
    Card.findOne({reportId: reportId}, function (err, card) {
        if (!card || (card.loser.user != req.session.user._id && card.picker.user != req.session.user._id))
            return res.redirect('/user');
        if (card.matched) {
            if (card.loser.user == req.session.user._id) {
                User.findById(card.picker.user, function (err, user) {
                    var report = {
                        cardNo: card.cardNo,
                        studentName: card.studentName,
                        studentNo: card.studentNo,
                        reporterName: user.name,
                        phone: card.picker.contact.phone,
                        weChat: card.picker.contact.weChat
                    };
                    res.render('report-result', {
                        title: '在系统中找到以下记录 - findCards',
                        pageType: 'findcards-result',
                        result: true,
                        card: {
                            cardNo: card.cardNo.slice(0, 6) + ' ' + card.cardNo.slice(6, card.cardNo.length),
                            studentNo: card.studentNo,
                            studentName: card.studentName
                        },
                        report: report,
                        infoType: 'other',
                        infoCardType: 'lose',
                        cardStatus: 'matched'
                    });
                })
            } else {
                User.findById(card.loser.user, function (err, user) {
                    var report = {
                        cardNo: card.cardNo,
                        studentName: card.studentName,
                        studentNo: card.studentNo,
                        reporterName: user.name,
                        phone: card.loser.contact.phone,
                        weChat: card.loser.contact.weChat
                    };
                    res.render('report-result', {
                        title: '在系统中找到以下记录 - findCards',
                        pageType: 'findcards-result',
                        result: true,
                        card: {
                            cardNo: card.cardNo.slice(0, 6) + ' ' + card.cardNo.slice(6, card.cardNo.length),
                            studentNo: card.studentNo,
                            studentName: card.studentName
                        },
                        report: report,
                        infoType: 'other',
                        infoCardType: 'pick',
                        cardStatus: 'matched'
                    });
                })
            }
        } else {
            if (card.picker.user == req.session.user._id) {
                User.findById(card.picker.user, function (err, user) {
                    var report = {
                        cardNo: card.cardNo,
                        studentName: card.studentName,
                        studentNo: card.studentNo,
                        reporterName: user.name,
                        phone: card.picker.contact.phone,
                        weChat: card.picker.contact.weChat
                    };
                    res.render('report-result', {
                        title: '未找到匹配记录 - findCards',
                        pageType: 'findcards-result',
                        result: false,
                        card: {
                            cardNo: card.cardNo.slice(0, 6) + ' ' + card.cardNo.slice(6, card.cardNo.length),
                            studentNo: card.studentNo,
                            studentName: card.studentName
                        },
                        report: report,
                        infoType: 'your',
                        infoCardType: 'pick',
                        cardStatus: 'unmatched'
                    });
                })
            } else {
                User.findById(card.loser.user, function (err, user) {
                    var report = {
                        cardNo: card.cardNo,
                        studentName: card.studentName,
                        studentNo: card.studentNo,
                        reporterName: user.name,
                        phone: card.loser.contact.phone,
                        weChat: card.loser.contact.weChat
                    };
                    res.render('report-result', {
                        title: '未找到匹配记录 - findCards',
                        pageType: 'findcards-result',
                        result: false,
                        card: {
                            cardNo: card.cardNo.slice(0, 6) + ' ' + card.cardNo.slice(6, card.cardNo.length),
                            studentNo: card.studentNo,
                            studentName: card.studentName
                        },
                        report: report,
                        infoType: 'your',
                        infoCardType: 'lose',
                        cardStatus: 'unmatched'
                    });
                })
            }
        }
    })
});

module.exports = router;