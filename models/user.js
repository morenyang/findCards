/**
 * Created by MorenYang on 2016/10/17.
 */

var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User', UserSchema);

module.exports = User;