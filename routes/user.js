/**
 * Created by MorenYang on 2016/11/12.
 */
var express = require('express');
var router = express.Router();
var Card = require('../models/card');
var User = require('../models/user');
var _ = require('underscore');

var listSize = 10; // 每页条目数量

router.use(function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    } else if (!req.session.user.activation) {
        return res.redirect('/auth/activation')
    } else {
        next();
    }
});

router.get('/', function (req, res) {
    // User info
    var joinDate = new Date(req.session.user.meta.createAt).toLocaleDateString();
    var count = {total: 0, pick: 0, lose: 0};

    Card.countUserReports(req.session.user._id, function (err, counts) {
        if (err) console.log(err);
        count.total = counts;
        Card.countUserReportsByType(req.session.user._id, 0, function (err, counts) {
            if (err) console.log(err);
            count.pick = counts;
            Card.countUserReportsByType(req.session.user._id, 1, function (err, counts) {
                if (err) console.log(err);
                count.lose = counts;

                var tab = req.query.tab;
                res.render('user', {
                    title: req.session.user.name + ' 个人中心 - findCards',
                    joinDate: joinDate,
                    tab: tab,
                    count: count,
                    pageType: 'findcards-user-center'
                });
            });
        });
    });


});

router.use(function (req, res, next) {
    Card.find({valid: true, matched: false}, function (err, cards) {
        if (err) console.log(err);
        if (cards.length == 0) next();
        else {
            var pick_reportAt = cards[0].picker.reportAt;
            var dayCount = (Math.abs(Date.now() - pick_reportAt)) / 1000 / 60 / 60 / 24;
            if (dayCount > 14) {
                var __card = _.extend(cards[0], {valid: false});
                __card.save(function (err, card) {
                    if (err) console.log(err);
                });
            }
            next();
        }
    });
});

router.get('/queryCards', function (req, res) {
    var pageSize;
    var cards;
    var page = req.query.page, tab = req.query.tab;
    if (!page) page = 1;
    if (!tab && tab != 'pick' && tab != 'lose') {
        Card.countUserReports(req.session.user._id, function (err, counts) {
            if (err) console.log(err);
            pageSize = (counts == 0 ? 0 : parseInt((counts + listSize - 1) / listSize));
            if (page > pageSize) {
                cards = [];
                var response = {pageSize: pageSize, cards: cards};
                res.json(response);
            } else {
                Card.queryUserReports(req.session.user._id, page, listSize, function (err, CardRecords) {
                    if (err) console.log(err);
                    cards = CardRecords;
                    var response = {pageSize: pageSize, cards: cards};
                    res.json(response);
                })
            }
        });
    } else if (tab == 'pick' || tab == 'lose') {
        var Type;
        if (tab == 'pick') Type = 0; else Type = 1;
        Card.countUserReportsByType(req.session.user._id, Type, function (err, counts) {
            if (err) console.log(err);
            pageSize = (counts == 0 ? 0 : parseInt((counts + listSize - 1) / listSize));
            if (page > pageSize) {
                cards = [];
                var response = {pageSize: pageSize, cards: cards};
                res.json(response);
            } else {
                Card.queryUserReportsByType(req.session.user._id, Type, page, listSize, function (err, CardRecords) {
                    if (err) console.log(err);
                    cards = CardRecords;
                    var response = {pageSize: pageSize, cards: cards};
                    res.json(response);
                })
            }
        });
    }
});



module.exports = router;