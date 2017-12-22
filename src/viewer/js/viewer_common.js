page = {
  url: urlParas(window.location.href.split('#')[0])
}

// 取数据
function getJson(url, param, success, error) {
  $.ajax({
    type: 'POST',
    url: url,
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