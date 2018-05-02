// document.write('<script language=javascript src="../vendor/jsVendor/seriesBar.js"></script>'+
// '<script src="../vendor/jsVendor/seriesLine.js"></script>'+
// '<script src="../vendor/jsVendor/seriesPie.js"></script>'+
// '<script src="../vendor/jsVendor/seriesArea.js"></script>'+
// '<script src="../vendor/jsVendor/seriesFunnel.js"></script>'+
// '<script src="../vendor/jsVendor/seriesRosePie.js"></script>'+
// '<script src="../vendor/jsVendor/seriesRadar.js"></script>'+
// '<script src="../vendor/jsVendor/seriesTreemap.js"></script>'+
// '<script src="../vendor/jsVendor/seriesStackbar.js"></script>'+
// '<script src="../vendor/jsVendor/seriesWaterfall.js"></script>');

if (!window.$) {
  console.warn('缺少jquery');
}
if (!window.echarts) {
  console.warn('缺少echarts');
}
// 获取参数
var scr = document.getElementsByTagName('script');
scr = scr[scr.length - 1];
var UrlParams = getParam(location.href).hasOwnProperty('id') ? getParam(location.href) : getParam(scr.getAttribute('src'));
// 默认配置
var options = {
  id: null,
  width: '100%',
  height: '100%'
};

$.extend(options, UrlParams);

var id = options.id;
if (!id || !id.length) {
  alert('缺少id!');
}

var WIDTH = 'string' == typeof options.width ? initSize(options.width) : '100%';
var HEIGHT = 'string' == typeof options.height ? initSize(options.height) : '100%';

$(scr).after('<div class="chart_wrap"><div id="chartWrap" style="height:' + HEIGHT + ';width:' + WIDTH + '" ></div></div>');
getChartData(id);

// 获取单一图表数据
function getChartData(chartId) {
  // 查询图表源 数据
  getJson('/chart/info.do', {
    chart: chartId
  }, function(res) {
    if (res.data.background) {
      $('.chart_wrap').css('background',res.data.background.backgroundColor)
    }
    if (res.data.option) {
      // TODO: 缺少table
      resize();
      // 图表时数据处理
      if (res.data.type == 'table') {
        var queryInfo = JSON.stringify(res.data.query),
          viewId = res.data.tableName.sql
          getJson("/query.do",{
            view: viewId,
            query: queryInfo
          }, function(data) {
            // 处理数据
            var chartData = replaceNull(data.data.data)
            // renderTmp('#chart' + chartId, 'tableViewTpl', chartData);
            var rows = chartData.rows;
            var columns = chartData.columns;
            // 最多显示500条
            if (rows.length > 500) {
              rows.length = 500
            }

            var html = '';
            html+='<div class="table_title">'+ res.data.option.title.text+'</div>'
            html += '<table class="chart_table">'
            html += '<thead>'
            html += '<tr>'
            for (var i = 0; i < columns.length; i++) {
              html += '<td>' + columns[i].source.text + '</td>'
            }
            html += '</tr>'
            html += '</thead>'
            // 合并
            var num = [];
            for (var j = 0; j < columns.length; j++) {
              num[j] = 0
            }
            function comp(rows1, rows2, index) {
              // 循环对比
              var ind = index
              if (ind > 0) {
                if (rows1[columns[ind - 1].name] == rows2[columns[ind - 1].name]) {
                  comp(rows1, rows2, ind - 1)
                  if (ind - 1 == 0) {
                    return true
                  }
                } else {
                  return false
                }
              }
            }
            for (var i = 0; i < rows.length; i++) {
              html += '<tr>';
              for (var j = 0; j < columns.length; j++) {
                if (i < num[j]) {
                  continue
                } else {
                  var rowspan = 1;
                  if (i + 1 < rows.length) {
                    for (var k = i + 1; k < rows.length; k++) {
                      if (rows[i][columns[j].name] == rows[k][columns[j].name]) {
                        if (j == 0) {
                          rowspan++;
                          num[j]++;
                        } else if (rows[i][columns[j].name] == rows[k][columns[j].name] && comp(rows[i], rows[k], j)) {
                          rowspan++;
                          num[j]++;
                        }
                      } else {
                        num[j]++;
                        break
                      }

                    }
                    html += '<td rowspan="' + rowspan + '">' + rows[i][columns[j].name] + '</td>'
                  } else {
                    // 最后一个
                    if (rows[i][columns[j].name] != rows[i - 1][columns[j].name]) {
                      html += '<td rowspan="' + rowspan + '">' + rows[i][columns[j].name] + '</td>'

                    }

                  }
                }
              }
              html += '</tr>'
            }
            // 不合并
            // for (var j = 0; j < rows.length; j++) {
            //   html+='<tr>'
            //   for(var i=0;i<columns.length;i++){
            //       html+='<td rowspan="">'+rows[j][columns[i].name]+'</td>'
            //   }
            //   html+='</tr>'
            // }
            $('#chartWrap').append(html).addClass('ova')
          })
      } else {
        var myChart = echarts.init(document.getElementById('chartWrap'));
        myChart.setOption(res.data.option);
        myChart.resize();
      }
      //用于使chart自适应高度和宽度
      window.onresize = function() {
        //重置容器高宽
        resize();
        myChart?myChart.resize():'';
      };
    }
  });
}

function resize() {
  if (options.width == '100%') {
    $('#chartWrap').width(window.innerWidth + 'px');
  }
  if (options.height == '100%') {
    $('#chartWrap').height(window.innerHeight + 'px');
  }

}
// 对尺寸格式化
function initSize(size) {
  if ('undefined' == typeof size) {
    return '100%';
  } else if ('number' == typeof size) {
    return size;
  }
  if (size.indexOf('%') == size.length - 1 || size.indexOf('px') == size.length - 2) {
    return size;
  } else if (/\D/.test()) {
    return '100%';
  } else {
    return size + 'px';
  }
}
// 根据URL 获取参数
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

// 空值替换为 '-'
function replaceNull(chartData) {
  for (var i = 0; i < chartData.rows.length; i++) {
    for (var key in chartData.rows[i]) {
      if (chartData.rows[i][key] === null) {
        chartData.rows[i][key] = '-'
      }
    }
  }
  return chartData
}