page = {
  url: urlParas(window.location.href.split('#')[0])
};
var vars = {
  root: 'http://119.180.98.134:8880/dataviz/',
  api: 'http://119.180.98.134:8880/dataviz/api',
  // api:'http://192.168.50.200:8880/dataviz/api',
  src: 'http://localhost:8080/src', //打包用注释的
  // src:'http://119.180.98.134:8890/res/dataviz',
};

// 取数据
function getJson(url, param, success, error) {
  $.ajax({
    type: 'POST',
    url: vars.api + url,
    data: param,
    dataType: 'json',
    beforeSend: function(XMLHttpRequest) {
      // console.log(XMLHttpRequest);
      // XMLHttpRequest.setRequestHeader('token', 111)
    },
    success: function(data) {
      if (typeof success == 'function') {
        success(data);
      } else {
        console.info('send:' + JSON.stringify(param) + '\nto:' + url + '\nreturn:\n' + JSON.stringify(data, null, 4))
      }
    },
    error: function(msg) {
      if (typeof error == 'function') {
        error(msg);
      } else {
        console.error('send:' + JSON.stringify(param) + '\nto:' + url + '\nstatus:' + msg.status + '\nreturn:\n' + JSON.stringify(msg))
      }
    }
  });
}
// 渲染模板
function renderTmp(selector, tmpId, data, callback) {
  var Tpl = template(tmpId, data),
    el;
  if ('object' == typeof selector) {
    el = selector;
  } else {
    el = $(selector)[0];
  }
  if (typeof callback == 'function') {
    callback(el, Tpl);
    return;
  }

  // el.innerHTML+= Tpl;
  $(el).append(Tpl);
  if (el.className.indexOf('show') < 0) {
    el.className += ' show';
  }
}