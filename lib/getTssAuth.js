var http = require('http');
var queryString = require('querystring');

/**
 *
 * @author MorenYANG
 *
 * 通过用户名和密码模拟登陆BNUZ-TSS系统
 * 接口链接： http://es.bnuz.edu.cn:8080/login.do
 * callBack返回 Boolean类型值
 *  true: 验证通过
 *  false: 验证未通过或网络错误
 *
 * @param username
 * @param password
 * @param callBack
 */
var getTssAuth = function (username, password, callBack) {
    var contents = queryString.stringify({
        tssName: username, tssPassword: password
    });

    var options = {
        host: 'es.bnuz.edu.cn',
        port: 8080,
        path: '/login.do',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    };

    var req = http.request(options, function (res) {
        var options = {
            host: 'es.bnuz.edu.cn',
            port: 8080,
            path: '/welcome.do',
            method: 'GET',
            headers: {
                Cookie: res.headers['set-cookie'].join(',').match(/(JSESSIONID=.+?);/)[1]
            }
        };

        var req = http.request(options, function (res) {
            if(res.statusCode == 200){
                console.log("TSSAUTH / TRUE username:" + username + " getAuth:" + true);
                callBack(true)
            }else {
                console.log("TSSAUTH / FALSE username:" + username + " getAuth:" + false + " statusCode:" + res.statusCode);
                callBack(false)
            }
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.setTimeout(60000);
        req.end();
    });

    req.setTimeout(60000);

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(contents);
    req.end();
};

module.exports = getTssAuth;