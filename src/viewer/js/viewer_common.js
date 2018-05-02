page = {
  url: urlParas(window.location.href.split('#')[0])
};

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