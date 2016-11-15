/**
 * Created by MorenYang on 2016/11/9.
 */

var mongoose = require('mongoose');
var CounterSchema = require('../schemas/counter')
var Counter = mongoose.model('Counter', CounterSchema);

module.exports = Counter;