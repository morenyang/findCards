/**
 * Created by MorenYang on 2016/11/13.
 */
var uid = document.getElementById("userid").innerHTML;
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
        user_report_at = new Date(user_report_at).toDateString();
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
            .replace(/%update-at%/, new Date(item.meta.updateAt).toDateString());
        var pickername = '', losername = '';
        $.ajaxSettings.async = false;
        if (item.picker.user) {
            $.getJSON('/api/user/queryUserName?uid=' + item.picker.user, function (response) {
                pickername = response.name;
            });
        }
        if (item.loser.user) {
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


var nameChange = function () {
    $("#user_name").addClass('hidden');
    $("#name_change_sign").addClass('hidden');
    document.getElementById("user_name_placeholder").innerHTML = document.getElementById("name-changer-template").innerHTML;
    document.getElementById("name_changer").focus();
};
var nameChangeSubmit = function () {
    var old_name = document.getElementById("user_name").innerHTML;
    var reg = new RegExp(old_name, 'g');
    var new_name = document.getElementById("name_changer").value;
    if (new_name.length == 0 || new_name.length > 12) {
        $("#name_changer").addClass('input-error');
        return;
    }
    if (new_name === old_name) {
        document.getElementById('user_name_placeholder').innerHTML = '';
        $("#user_name").removeClass("hidden");
        $("#name_change_sign").removeClass("hidden");
        return;
    }
    var uid = document.getElementById("userid").innerHTML;
    $.ajax({
        url: '/api/user/changeUserName?username=#{user.username}',
        type: 'POST',
        dataType: 'json',
        data: {uid: uid, name: new_name},
        async: false,
        cache: false,
        success: function (response) {
            if (response.status) {
                document.getElementById('user_name').innerHTML = document.getElementById('user_name').innerHTML.replace(reg, new_name);
                document.getElementById('user_name_placeholder').innerHTML = '';
                document.getElementById('nav_username').innerHTML = new_name;
                $("#user_name").removeClass("hidden");
                $("#name_change_sign").removeClass("hidden");
                document.getElementById('user-profile-cards').innerHTML = document.getElementById('user-profile-cards').innerHTML.replace(reg, new_name);
                document.getElementById('name-changer-template').innerHTML = document.getElementById('name-changer-template').innerHTML.replace(reg, new_name);
                document.title = document.title.replace(reg, new_name);
            } else {
                window.location.reload();
            }
        }
    })
};
