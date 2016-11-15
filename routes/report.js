/**
 * Created by MorenYang on 2016/11/4.
 */

var express = require('express');
var router = express.Router();
var Card = require('../models/card');
var Counter = require('../models/counter');
var _ = require('underscore');

router.use(function (req, res, next) {
    // 初始化counter
    Counter.findOne({counterId: 1}, function (err, counter) {
        if (counter == null) {
            var lastOneId = 1955224;
            Card.fetchLastOne(function (err, cards) {
                if (err) console.log(err);
                if (cards.length != 0) {
                    lastOneId = cards[0].reportId + 1;
                }
                var _counter = new Counter({name: 'cardCount', counterId: 1, seq: lastOneId});
                _counter.save(function (err, counter) {
                    if (err) console.log(err);
                    console.log('COUNTER / Create "cardCount : 1" seq:' + lastOneId);
                    next();
                });
            });
        } else {
            next();
        }
    });
});

router.get('/', function (req, res) {
    res.render('report-guide');
});

router.get('/pick', function (req, res) {
    res.render('report', {title: '填入信息 拾卡 - findCards', type: 'pick', interface: '/report/pick/submit'});
});

router.get('/lose', function (req, res) {
    res.render('report', {title: '填入信息 丢卡 - findCards', type: 'lose', interface: '/report/lose/submit'});
});

router.post('/lose/submit', function (req, res) {
    var uid = req.session.user._id;
    var cardNo = req.body.cardno;
    var studentNo = req.body.studentno;
    var studentName = req.body.studentname;
    var contact = {phone: req.body.phone, weChat: req.body.wechat};
    var reportType = 1;
    var loser = {user: uid, contact: contact, reportAt: Date.now(), read: false};
    if (studentNo != req.session.user.username) {
        res.render('report', {type: 'lose', interface: '/report/lose/submit', alert: '操作非法，请重试！'})
    }

    // 使之前相同卡号或学号的报告失效
    Card.find({studentNo: studentNo, reportType: 1, valid: true, matched: false}, function (err, cards) {
        if (err) console.log(err);
        if (cards.length == 0) return;
        for (var i = 0; i < cards.length; i++) {
            (function (i) {
                var card = _.extend(cards[i], {valid: false});
                card.save();
            })(i);
        }
    });

    Card.multiFind(0, cardNo, studentNo, function (err, cards) {
        if (err) console.log(err);
        if (cards.length != 0) {
            var pick_reportAt = cards[0].picker.reportAt;
            var dayCount = (Math.abs(Date.now() - pick_reportAt)) / 1000 / 60 / 60 / 24;
            if (dayCount > 14) {
                var __card = _.extend(cards[0], {valid: false});
                __card.save(function (err, card) {
                    if (err) console.log(err);
                });
                return;
            }
            var card = _.extend(cards[0], {
                cardNo: cardNo,
                studentNo: studentNo,
                studentName: studentName,
                loser: loser,
                matched: true
            });
            card.save(function (err, card) {
                if (err) console.log(err);
                return res.redirect('/result/lose/' + card.reportId);
            });
        } else {
            Counter.findByCountIdAndUpdate(1, function (err, counter) {
                if (err) console.log(err);
                var reportId = counter.seq;
                var _card = new Card({
                    reportId: reportId,
                    cardNo: cardNo,
                    studentNo: studentNo,
                    studentName: studentName,
                    loser: loser,
                    matched: false,
                    reportType: reportType,
                    valid: true
                });
                _card.save(function (err, card) {
                    if (err) console.log(err);
                    return res.redirect('/result/lose/' + reportId);
                })
            });
        }
    });
});

router.post('/pick/submit', function (req, res) {
    var uid = req.session.user._id;
    var cardNo = req.body.cardno;
    var studentNo = req.body.studentno;
    var studentName = req.body.studentname;
    var contact = {phone: req.body.phone, weChat: req.body.wechat};
    var reportType = 0;
    var picker = {user: uid, contact: contact, reportAt: Date.now(), read: false};

    // 使之前相同卡号或学号的报告失效
    Card.find({cardNo: cardNo, reportType: 0, valid: true, matched: false}, function (err, cards) {
        if (err) console.log(err);
        if (cards.length == 0) return;
        for (var i = 0; i < cards.length; i++) {
            (function (i) {
                var card = _.extend(cards[i], {valid: false});
                card.save();
            })(i);

        }
    });
    Card.find({studentNo: studentNo, reportType: 0, valid: true, matched: false}, function (err, cards) {
        if (err) console.log(err);
        if (cards.length == 0) return;
        for (var i = 0; i < cards.length; i++) {
            (function (i) {
                var card = _.extend(cards[i], {valid: false});
                card.save();
            })(i);
        }
    });

    Card.multiFind(1, cardNo, studentNo, function (err, cards) {
        if (err) console.log(err);
        if (cards.length != 0) {
            var lose_reportAt = cards[0].loser.reportAt;
            var dayCount = (Math.abs(Date.now() - lose_reportAt)) / 1000 / 60 / 60 / 24;
            if (dayCount > 14) {
                var __card = _.extend(cards[0], {valid: false});
                __card.save(function (err, card) {
                    if (err) console.log(err);
                });
                return;
            }
            var card = _.extend(cards[0], {
                cardNo: cardNo,
                studentNo: studentNo,
                studentName: studentName,
                picker: picker,
                matched: true
            });
            card.save(function (err, card) {
                if (err) console.log(err);
                return res.redirect('/result/pick/' + card.reportId);
            });
        } else {
            Counter.findByCountIdAndUpdate(1, function (err, counter) {
                if (err) console.log(err);
                var reportId = counter.seq;
                var _card = new Card({
                    reportId: reportId,
                    cardNo: cardNo,
                    studentNo: studentNo,
                    studentName: studentName,
                    picker: picker,
                    matched: false,
                    reportType: reportType,
                    valid: true
                });
                _card.save(function (err, card) {
                    if (err) console.log(err);
                    return res.redirect('/result/pick/' + reportId);
                })
            });

        }
    });
});

router.get('/fetch', function (req, res) {
    Card.fetchLastOne(function (err, cards) {
        res.send(cards);
    })
});


module.exports = router;