/**
 * Created by MorenYang on 2016/11/3.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var Counter = require('../models/counter');
var Card = require('../models/card');

mongoose.Promise = require('bluebird');

var CardSchema = mongoose.Schema({
    cardNo: String, // Card Number
    studentNo: String, // Student Number
    studentName: String, // Student Name
    reportType: Number, // 0 picker report / 1 loser report
    reportId: {type: Number, unique: true},
    reportAt: { // Report Time
        type: Date,
        default: Date.now()
    },
    matched: { // is matched 标注是否已匹配过
        type: Boolean,
        default: false
    },
    valid: { // is valid 标注是否有效
        type: Boolean,
        default: true
    },
    picker: { // Card Picker
        user: {
            type: ObjectId,
            ref: 'User'
        },
        contact: { // Card Picker Contact Ways
            phone: String,
            weChat: String
        },
        reportAt: { // Report Time
            type: Date,
            default: Date.now()
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    loser: { // Card Loser
        user: {
            type: ObjectId,
            ref: 'User'
        },
        contact: { // Card Loser Contact Ways
            phone: String,
            weChat: String
        },
        reportAt: { // Report Time
            type: Date,
            default: Date.now()
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

CardSchema.pre('save', function (next) {
    if (this.isNew) {
        this.reportAt = this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next();
});

CardSchema.statics = {
    fetch: function (callBack) {
        return this
            .find({})
            .sort('reportAt')
            .exec(callBack)
    },
    findById: function (id, callBack) {
        return this
            .findOne({_id: id})
            .exec(callBack)
    },
    multiFind: function (reportType, cardNo, studentNo, callBack) {
        return this
            .find()
            .where('valid', true)
            .where('matched', false)
            .where('reportType', reportType)
            .or([{cardNo: eval("/" + cardNo + "/")}, {studentNo: eval("/" + studentNo + "/")}])
            .sort({'reportAt': -1})
            .exec(callBack)
    },
    fetchLastOne: function (callBack) {
        return this
            .find({})
            .sort({'meta.createAt': -1})
            .limit(1)
            .exec(callBack);
    },
    countUserReports: function (username, callBack) {
        return this.count().or([{'picker.user': username}, {'loser.user': username}]).exec(callBack);
    },
    queryUserReports: function (username, reqPage, listSize, callBack) {
        return this.find()
            .or([{'picker.user': username}, {'loser.user': username}])
            .sort({'reportAt': -1})
            .skip((reqPage - 1) * listSize)
            .limit(listSize)
            .exec(callBack);
    },
    countUserReportsByType: function (username, reportType, callBack) {
        if (reportType == 0) {
            return this.count({'picker.user': username}).exec(callBack);
        } else {
            return this.count({'loser.user': username}).exec(callBack);
        }
    },
    queryUserReportsByType: function (username, reportType, reqPage, listSize, callBack) {
        var query = this.find();
        if (reportType == 0) {
            query = query.where('picker.user', username);
        } else {
            query = query.where('loser.user', username);
        }
        return query
            .sort({'reportAt': -1})
            .skip((reqPage - 1) * listSize)
            .limit(listSize)
            .exec(callBack);
    }
};

module.exports = CardSchema;