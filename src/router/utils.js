import { ajax } from 'jquery';
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
    if (c_start != -1) {
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
    url: vars.api + url + '?origin=' + location.origin,
    data: param,
    xhrFields: {
      withCredentials: true // 要在这里设置  
    },
    dataType: 'json',
    // jsonp:'_jsonp',
    // jsonpCallback: 'jsonp'+Math.floor(Math.random() * 99999999),
    success: function(data) {
      if (typeof success == 'function') {
        success(data);
      } else {
        console.info('send:' + JSON.stringify(param) + '\nto:' + url + '\nreturn:\n' + JSON.stringify(data, null, 4));
      }
    },
    error: function(msg) {
      if (typeof error == 'function') {
        error(msg);
      } else {
        console.error('send:' + JSON.stringify(param) + '\nto:' + url + '\nstatus:' + msg.status + '\nreturn:\n' + JSON.stringify(msg));
      }
    }
  });
}
/**
 * 格式化时间
 * @param date
 * @param format
 * @returns {string}
 */
function dateFormat(date, format) {
  if (typeof date == 'string' && date.indexOf('-') != -1) {
    date = date.replace(/-/g, '/');
  }
  date = new Date(date);
  var map = {
    'M': date.getMonth() + 1, //月份
    'd': date.getDate(), //日
    'h': date.getHours(), //小时
    'm': date.getMinutes(), //分
    's': date.getSeconds(), //秒
    'q': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
}
export {
  setCookie,
  getCookie,
  getJson,
  dateFormat
};