import { ajax } from 'jquery';
import vars from '../assets/js/vars';
// 把变量存入cookie
function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + '=' + escape(value) +
    ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/';
}
// 从cookie中取出已存入的变量
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + '=');
    if (c_start!= -1) {
      c_start = c_start + c_name.length + 1;
      var c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
}
// 调取接口的方法 与电商框架里的一致
function getJson(url, param, success, error) {
  ajax({
    type: 'POST',
    url: vars.api + url,
    data: param,
    dataType: 'json',
    success: function (data) {
      if (typeof success == 'function') {
        success(data);
      } else {
        console.info('send:' + JSON.stringify(param) + '\nto:' + url + '\nreturn:\n' + JSON.stringify(data, null, 4));
      }
    },
    error: function (msg) {
      if (typeof error == 'function') {
        error(msg);
      } else {
        console.error('send:' + JSON.stringify(param) + '\nto:' + url + '\nstatus:' + msg.status + '\nreturn:\n' + JSON.stringify(msg));
      }
    }
  });
}
export {
  setCookie,
  getCookie,
  getJson
};