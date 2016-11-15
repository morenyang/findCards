/**
 * Created by MorenYang on 2016/11/1.
 */

var http = require('http');
var queryString = require('querystring');

var getTMSAuth = function (username, password, callBack) {
    var contents = queryString.stringify({
        j_username: username,
        j_password: password
    });

    var options = {
        host: 'tms.bnuz.edu.cn',
        port: 80,
        path: '/tms/j_spring_security_check',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;',
            'Content-Length': contents.length
        }
    };

    var req = http.request(options, function (res) {
       var status = res.statusCode;
        console.log(status);
        console.log(res.headers.location);
        callBack(status);
    });
    req.write(contents);req.end();
};

module.exports = getTMSAuth;