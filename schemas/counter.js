/**
 * Created by MorenYang on 2016/11/9.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var CounterSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    counterId: {
        /**
         * CardCount: 1
         */
        type: Number,
        unique: true
    },
    seq: {
        type: Number,
        default: 0,
        require: true
    }
});

CounterSchema.statics = {
    fetch: function (callBack) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(callBack)
    },
    findById: function (id, callBack) {
        return this
            .findOne({_id: id})
            .exec(callBack)
    },
    findByCountIdAndUpdate: function (id, callBack) {
        return this.findOneAndUpdate({counterId: id}, {$inc: {seq: 1}}).exec(callBack);
    }
};

module.exports = CounterSchema;