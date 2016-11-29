/**
 * Created by MorenYang on 2016/10/31.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.Promise = require('bluebird');

var UserSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String
    },
    name: String,
    password: {
        type: String,
        default: 'password'
    },
    role: {
        type: Number,
        default: 1
    },
    activation: {
        type: Boolean,
        default: false
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

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.role == 0 || (this.name && this.name != '')) {
        this.activation = true;
    }

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    if (user.role != 1) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

UserSchema.methods = {
    comparePassword: function (_password, callBack) {
        if (this.role == 1) callBack(null, true);
        else {
            bcrypt.compare(_password, this.password, function (err, isMath) {
                if (err) return callBack(err);
                callBack(null, isMath);
            });
        }
    }
};

UserSchema.statics = {
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
    }
};

module.exports = UserSchema;