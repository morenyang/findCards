/**
 * Created by MorenYang on 2016/11/15.
 */
var cardNoReg = /^(\d{16}|\d{19})$/;
var phoneReg = /^(\d{6}|\d{11})$/;
var idReg = /^(\d{5}|\d{10}|\d{12})$/;
$('#cardno').blur(function () {
    this.value = this.value.replace(/[^0-9]*$/g, '');
    this.onkeyup();
    if (this.value.length == 0) {
        $(this).removeClass('input-complete').removeClass('input-error');
    } else if (this.value.length != 0 && cardNoReg.test(this.value)) {
        $(this).addClass('input-complete');
    } else {
        $(this).addClass('input-error');
        $(this).addClass('shake');
    }
}).focus(function () {
    $(this).removeClass('input-error');
    $(this).removeClass('input-complete');
});

$('#phone').blur(function () {
    this.value = this.value.replace(/[^0-9]*$/g, '');
    if (this.value.length == 0) {
        $(this).removeClass('input-complete').removeClass('input-error');
    } else if (this.value.length != 0 && phoneReg.test(this.value)) {
        $(this).addClass('input-complete');
    } else {
        $(this).addClass('input-error');
    }
}).focus(function () {
    $(this).removeClass('input-error');
    $(this).removeClass('input-complete');
});

$('#studentno').blur(function () {
    this.value = this.value.replace(/[^0-9]*$/g, '');
    this.onkeyup();
    if (this.value.length == 0) {
        $(this).removeClass('input-complete').removeClass('input-error');
    } else if (this.value.length != 0 && idReg.test(this.value)) {
        $(this).addClass('input-complete');
    } else {
        $(this).addClass('input-error');
    }
}).focus(function () {
    $(this).removeClass('input-error');
    $(this).removeClass('input-complete');
});
$('.input-card > form > input').not($('#cardno')).not($('#phone')).not($('#studentno')).blur(function () {
    if (this.value.length == 0) {
        $(this).removeClass('input-complete').removeClass('input-error');
    } else {
        $(this).addClass('input-complete');
    }
}).focus(function () {
    $(this).removeClass('input-error');
    $(this).removeClass('input-complete');
});

document.getElementById('cardno').onkeyup = function () {
    var content = this.value;
    if (this.value.length == 0) {
        content = '&nbsp;';
    }
    if (this.value.length > 6) {
        content = content.slice(0, 6) + ' ' + content.slice(6, content.length)
    }
    document.getElementById('cardview-no').innerHTML = content;
};

document.getElementById('studentname').onkeyup = function () {
    var content = this.value;
    if (this.value.length == 0) {
        content = '&nbsp;';
        document.getElementById('ci-name-title').innerHTML = '&nbsp'
    } else {
        document.getElementById('ci-name-title').innerHTML = '姓名：'
    }
    document.getElementById('cardview-name').innerHTML = content;
};
document.getElementById('studentno').onkeyup = function () {

    var content = this.value;
    if (this.value.length == 0) {
        content = '&nbsp;';
        document.getElementById('ci-sno-title').innerHTML = '&nbsp';
    } else {
        document.getElementById('ci-sno-title').innerHTML = '学号：';
    }
    document.getElementById('cardview-sno').innerHTML = content;
};

window.onkeyup = function () {
    if (document.getElementById('studentname').value.length == 0 && document.getElementById('cardno').value.length == 0 && document.getElementById('studentno').value.length == 0) {
        $('.card-view .card').addClass('display-hidden');
    } else {
        $('.card-view .card').removeClass('display-hidden');
    }
};

window.onload = function () {
    $("input").blur();
};