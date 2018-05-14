var id = typeof page.url.get('id') == 'string' ? page.url.get('id') : '';
if (!id.length) {
  alert('缺少ID！');
}

// 预留lesson
if ('lesson') {

}
// 栅格设置
var dash, dashOptions = {
  draggable: false,
  resizable: false,
  cellHeight: 80,
  verticalMargin: 0,
  width: 6
};

getChartList(id);

function getChartList(chartId) {
  getJson('/dashboard/info.do',{
      dashboard: chartId
    }, function(res) {
      if (res.success) {
        $('.top .title').text(res.data.text);
        if(res.data.dashboardBgcolor){
          $('.dash_wrap').css('background',res.data.dashboardBgcolor)
        }
        var data = {
          xData: res.data.layout
        };
        renderTmp('#dash', 'gridItem', data);
        loadGrid();
        var chartIdArr = []
        $('.grid-stack-item').each(function() {
          var chartId = $(this).data('id');
          chartIdArr.push(chartId)
          getChartData(chartId)
        });


      }
    })
}

// 获取单一图表数据
function getChartData(chartId) {
  // 查询图表源 数据
  getJson('/chart/info.do', {
    chart: chartId
  }, function(res) {
    if (res.data.option) {
      //TODO: 手动清空series里数据，后期不存在
      if (res.data.option && res.data.option.series) {
        for (var j = 0; j < res.data.option.series.length; j++) {
          res.data.option.series[j].data = [];
        }
      }
      var queryInfo = JSON.stringify(res.data.query),
        viewId = res.data.tableName.sql;
        getJson('/query.do',{
          view: viewId,
          query: queryInfo
        }, function(data) {
          if (res.data.type == 'table') {
            res.data.chartData = dataHandler(data.data, res.data.option.series, res.data.type);
            // 处理表格数据
            var chartData = res.data.chartData;
            var rows = chartData.rows;
            var columns = chartData.columns;
            // 最多显示500条
            if (rows.length > 500) {
              rows.length = 500
            }
            var html = '';
            html += '<table class="chart_table">'
            html += '<thead>'
            html += '<tr>'
            for (var i = 0; i < columns.length; i++) {
              html += '<td>' + columns[i].source.text + '</td>'
            }
            html += '</tr>'
            html += '</thead>'
            // 以下为两种处理方式，是否合并相同数值
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
            $('#chart' + chartId).append(html).addClass('ova')

          } else {
            res.data.option.series = dataHandler(data.data, res.data.option.series, res.data.type);
            res.data.option.title.text = ''
            var myChart = echarts.init(document.getElementById('chart' + chartId));
            myChart.setOption(res.data.option);
            myChart.resize();
          }
          $('#chart' + chartId).closest('.grid-stack-item').find('.chart_tit').text(res.data.text)
          res.data.background?res.data.background:{
            backgroundColor:'#fff',
            backgroundRepeat:'no-repeat',
            backgroundImage:''
          }
          $('#chart' + chartId).closest('._wrap').css({
            'background-color':res.data.background.backgroundColor,
            'background-repeat':res.data.background.backgroundRepeat,
            'background-image':res.data.background.backgroundImage
          })
        })
    }

  })

}

// 根据type处理数据
function dataHandler(data, series, type) {
  if (data.dataError || !data.data) {
    return;
  }
  var query = data.query;
  var columns = data.data.columns;
  var rows = data.data.rows;
  // 获取维度和数值的name
  var queryNameX = query.categoryColumns.map(x => x.name);
  var queryNameY = query.valueColumns.map(x => x.name);
  // 根据name获取对应的key
  var queryNameKeyX = queryNameX.map(function(x) {
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].source.name == x) {
        return columns[i].name;
      }
    }
  });
  var queryNameKeyY = queryNameY.map(function(x) {
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].source.name == x) {
        return columns[i].name;
      }
    }
  });
  if (type == 'bar') {
    series = Object.assign(
      [],
      seriesBar(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'line') {
    series = Object.assign(
      [],
      seriesLine(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'pie') {
    series = Object.assign(
      [],
      seriesPie(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'table') {
    var chartData = replaceNull(data.data);
    return chartData;
  } else if (type == 'area') {
    series = Object.assign(
      [],
      seriesArea(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'funnel') {
    series = Object.assign(
      [],
      seriesFunnel(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'rosePie') {
    series = Object.assign(
      [],
      seriesRosePie(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'radar') {
    series = Object.assign(
      [],
      seriesRadar(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'treemap') {
    series = Object.assign(
      [],
      seriesTreemap(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'waterfall') {
    series = Object.assign(
      [],
      seriesWaterfall(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  } else if (type == 'stackbar') {
    series = Object.assign(
      [],
      seriesStackbar(columns, rows, queryNameKeyY, {}, series)
    );
    return series;
  }else if (type == 'gauge') {
    series = Object.assign(
      [],
      seriesGauge(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  }else if (type == 'wordCloud') {
    series = Object.assign(
      [],
      seriesWordCloud(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  }else if (type == 'percentStackbar') {
    series = Object.assign(
      [],
      seriesPercentStackbar(columns, rows, queryNameKeyY, {}, series)
    );
    return series;
  }else if (type == 'bar3D') {
    series = Object.assign(
      [],
      seriesBar3D(columns, rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series;
  }
  
}

// 禁用栅格
function disable() {
  dash.disable();
}
// 启用栅格
function enable() {
  dash.movable('.grid-stack-item', true);
  dash.resizable('.grid-stack-item', true);
}
// 加载拖拽栅格
function loadGrid() {
  $('#dash').gridstack(dashOptions);
  dash = $('#dash').data('gridstack');
  disable();
}

// 点击展示单个图表
var singleChart = echarts.init(document.getElementById('singleChart'));

// 双击打开单图表弹窗
$('body').on('dblclick', '.grid-stack-item', function() {
  $('.chart_box').show();
  $('body').addClass('ovh');
  var chartId = $(this).attr('data-id');
  getJson('/chart/info.do', {
    chart: chartId
  }, function(res) {
    if (res.data.option) {
      var viewId = res.data.tableName.sql,
        queryInfo = JSON.stringify(res.data.query);
      getJson('/query.do',{
          view: viewId,
          query: queryInfo
        }, function(data) {
          if (res.data.type == 'table') {
            res.data.chartData = dataHandler(data.data, res.data.option.series, res.data.type);
            $('#singleChart').hide();
            $('#singleTable').show();
            singleChart.clear()
            var chartData = res.data.chartData;
            $('#singleTable').html('');
            renderTmp('#singleTable', 'tableViewTpl', chartData);
            res.data.background?res.data.background:res.data.background={
              backgroundColor:'#fff',
              backgroundRepeat:'no-repeat',
              backgroundImage:''
            }
            $('#singleTable').css({
              'background-color':res.data.background.backgroundColor,
              'background-repeat':res.data.background.backgroundRepeat,
              'background-image':res.data.background.backgroundImage
            })
          } else {
            res.data.option.series = dataHandler(data.data, res.data.option.series, res.data.type);
            $('#singleChart').show();
            $('#singleTable').hide();
            singleChart.clear()
            singleChart.setOption(res.data.option);
            singleChart.resize();
            res.data.background?res.data.background:res.data.background={
              backgroundColor:'#fff',
              backgroundRepeat:'no-repeat',
              backgroundImage:''
            }
            $('#singleChart').css({
              'background-color':res.data.background.backgroundColor,
              'background-repeat':res.data.background.backgroundRepeat,
              'background-image':res.data.background.backgroundImage
            })
          }
          
        })
    }
  })
});

// 关闭单图表弹窗
$('body').on('click', '.close', function() {
  $('.chart_box').hide();
  $('body').removeClass('ovh');
  $('#singleTable').attr('css','')

});

// 空值替换为 '-'
function replaceNull(chartData) {
  for (var i = 0; i < chartData.rows.length; i++) {
    for (var key in chartData.rows[i]) {
      if (chartData.rows[i][key] === null) {
        chartData.rows[i][key] = '-';
      }
    }
  }
  return chartData;
}