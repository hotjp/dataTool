// 非vue文件公用ajax
function getJson(url, param, success, error) {
  $.ajax({
    type: 'POST',
    url: vars.api + url+ '?origin='+location.origin,
    data: param,
    dataType: 'json',
    xhrFields: {  
      // withCredentials: true    // 要在这里设置  
    },
    beforeSend: function(XMLHttpRequest) {
      // console.log(XMLHttpRequest);
      // XMLHttpRequest.setRequestHeader('token', 111)
    },
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
//存储介质
if (window.localStorage) {
  var local = {
    _dur: 0,
    /**
     * 存储数据
     * @param key 关键字
     * @param [val] 值，为空则删除
     * @param [dur] 缓存周期，单位：小时，默认不限制
     */
    set: function(key, val, dur) {
      if (!val) {
        localStorage.removeItem(key);
      }
      dur = 'number' == typeof dur ? dur * 60 * 60 * 1000 : this._dur * 60 * 60 * 1000;
      val = $.extend({ data: val }, { _t: Date.parse(new Date()), _d: dur });
      localStorage[key] = JSON.stringify(val);
    },
    get: function(key) {
      var value = localStorage[key] ? JSON.parse(localStorage[key]) : {};
      if (!value.data) {
        return value;
      }
      var endTime = value._t + value._d;
      if (0 == value._d || Date.parse(new Date()) <= endTime) {
        return value.data;
      } else {
        return {};
      }
    }
  };
}