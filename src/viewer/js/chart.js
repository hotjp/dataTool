if (!window.$) {
  console.warn('缺少jquery')
}
if (!window.echarts) {
    console.warn('缺少echarts')
}
var scr = document.getElementsByTagName("script");
scr = scr[scr.length - 1];
var scriptUrl = getParam(scr.getAttribute('src'));

var id = scriptUrl.id
if (!id.length) {
  alert('缺少id!')
}

var WIDTH = 'string' == typeof scriptUrl.width ? initSize(scriptUrl.width) : '100%'
var HEIGHT = 'string' == typeof scriptUrl.height ? initSize(scriptUrl.height) : '100%'

$(scr).after('<div id="chartWrap" style="height:' + HEIGHT + ';width:' + WIDTH + '" ></div>')
getChartData(id);

// 获取单一图表数据
function getChartData(chartId) {
  // 查询图表源 数据
  getJson('http://192.168.50.200:8880/dataviz/api/chart/info.do', {
    chart: chartId,
  }, function(res) {
    if (res.data.option) {
      var myChart = echarts.init(document.getElementById('chartWrap'));
      myChart.setOption(res.data.option);
      myChart.resize();
    }
  })
}

// 对尺寸格式化
function initSize(size) {
  if ('undefined' == typeof size) {
    return '100%'
  } else if ('number' == typeof size) {
    return size
  }
  if (size.indexOf('%') == size.length - 1 || size.indexOf('px') == size.length - 2) {
    return size
  } else if (/\D/.test(size)) {
    return '100%'
  } else {
    return size + 'px'
  }
}

function getParam(url, option) {
  var paraStr, paras;
  if (url) {
    paraStr = (function(url) {
      if (url.indexOf('#') > 0) {
        url = url.split('#')[0];
      }
      return url.split('?')[1];
    })(url);
    if (paraStr) {
      paras = {};
      paraStr = paraStr.split('&');
      for (var n = 0; n < paraStr.length; n++) {
        var name = paraStr[n].split('=')[0];
        var value = paraStr[n].split('=')[1];
        paras[name] = value;
      }
    } else {
      return {};
    }
    if (!option) {
      return paras;
    } else {
      return paras[option] ? paras[option] : '';
    }


  }
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