/**
 * Created by MorenYang on 2016/11/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
   return res.render('policies');
});

module.exports = router;