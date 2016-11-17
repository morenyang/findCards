/**
 * Created by MorenYang on 2016/11/13.
 */
var uid = document.getElementById("userid").innerHTML;
var uname = document.getElementById("_user_name").innerHTML;
var pageSize = 0;
var page = 0;
var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
};

var getMoreReports = function () {
    page++;
    itemListAdaptor(page);
};

var itemListAdaptor = function (reqPage) {
    $("#refresher-btn").addClass('hidden');
    document.getElementById("loadingSign").innerHTML = document.getElementById('loading-sign-template').innerHTML;
    page = reqPage;
    var tab = getQueryString('tab');
    if (!tab || tab == '') {
        $.getJSON('/api/user/queryCards?page=' + page, function (response) {
            pageSize = response.pageSize;
            page = pageSize != 0 ? page > pageSize ? pageSize : page : 1;
            var items = response.cards;
            itemListWriter(items);
            document.getElementById("loadingSign").innerHTML = '';
            if (page >= pageSize) {
                $("#refresher-btn").addClass('hidden');
            } else {
                $("#refresher-btn").removeClass('hidden');
            }
            if (pageSize == 0) {
                document.getElementById("loadingSign").innerHTML = '<div class=\'text\'><p>未查询到相关记录</p></div>';
            }
        });
    } else {
        $.getJSON('/api/user/queryCards?page=' + page + '&tab=' + tab, function (response) {
            pageSize = response.pageSize;
            page = pageSize != 0 ? page > pageSize ? pageSize : page : 1;
            var items = response.cards;
            itemListWriter(items);
            document.getElementById("loadingSign").innerHTML = '';
            if (page >= pageSize) {
                $("#refresher-btn").addClass('hidden');
            } else {
                $("#refresher-btn").removeClass('hidden');
            }
            if (pageSize == 0) {
                document.getElementById("loadingSign").innerHTML = '<div class=\'text\'><p>未查询到相关记录</p></div>';
            }
        });
    }
};

var itemListWriter = function (items) {
    var content_template = document.getElementById('user-profile-card-template').innerHTML;
    var user_report_type_value = ['拾卡', '丢卡'];
    $.each(items, function (index, item) {
        var user_report_type = (item.picker.user == uid ? 0 : 1);
        var user_report_at = user_report_type == 0 ? item.picker.reportAt : item.loser.reportAt;
        user_report_at = new Date(user_report_at).toLocaleDateString();
        var item_content = content_template;
        item_content = item_content
            .replace(/%user-report-type%/g, user_report_type_value[user_report_type])
            .replace(/%user-report-at%/g, user_report_at);

        if (item.cardNo != '')
            item_content = item_content
                .replace(/%class-for-cardno%/g, 'cardno')
                .replace(/%cardno%/g, item.cardNo);
        else
            item_content = item_content
                .replace(/%class-for-cardno%/g, '')
                .replace(/%cardno%/g, '');

        if (item.studentNo != '')
            item_content = item_content
                .replace(/%class-for-studentno%/g, 'studentno')
                .replace(/%studentno%/g, item.studentNo);
        else
            item_content = item_content
                .replace(/%class-for-studentno%/g, '')
                .replace(/%studentno%/g, '');
        item_content = item_content
            .replace(/%reportid%/g, item.reportId)
            .replace(/%reportstatus%/, item.valid ? item.matched ? '已匹配' : '未匹配' : '已失效')
            .replace(/%update-at%/, new Date(item.meta.updateAt).toLocaleDateString());
        var pickername = '', losername = '';
        $.ajaxSettings.async = false;
        if (item.picker.user) {
            if (item.picker.user == uid) {
                pickername = uname;
            } else
                $.getJSON('/api/user/queryUserName?uid=' + item.picker.user, function (response) {
                    pickername = response.name;
                });
        }
        if (item.loser.user) {
            if (item.loser.user == uid) {
                losername = uname
            } else
                $.getJSON('/api/user/queryUserName?uid=' + item.loser.user, function (response) {
                    losername = response.name;
                });
        }
        item_content = item_content
            .replace(/%picker-name%/g, pickername)
            .replace(/%loser-name%/g, losername);
        document.getElementById('user-profile-cards').innerHTML += item_content;
        $.ajaxSettings.async = true;
    })
};
