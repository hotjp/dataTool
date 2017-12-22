var id = typeof page.url.get('id') == 'string' ? page.url.get('id') : '';
if (!id.length) {
  alert('缺少ID！')
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
// TODO: 根据仪表盘id取charts列表,生成dom结构，实例栅格
function getChartList(chartId) {
  $.ajax({
    type: "post",
    url: "http://192.168.50.200:8880/dataviz/api/dashboard/info.do",
    // async: false, // 设为同步
    data: {
      dashboard: chartId
    },
    dataType: "json",
    success: function(res) {
      if (res.success) {
        $('.top .title').text(res.data.text)
        var data = {
          xData: res.data.layout
        }
        renderTmp('#dash', 'gridItem', data)
        loadGrid();
        $('.grid-stack-item').each(function() {
          var chartId = $(this).data('id');
          getChartData(chartId)
        });

      }
    }
  });

}

// 获取单一图表数据
function getChartData(chartId) {
  // 查询图表源 数据
  getJson('http://192.168.50.200:8880/dataviz/api/chart/info.do', {
    chart: chartId,
  }, function(res) {
    if (res.data.option) {
      // 手动清空series里数据
      if (res.data.option && res.data.option.series) {
        for (var j = 0; j < res.data.option.series.length; j++) {
          res.data.option.series[j].data = [];
        }
      }
      var queryInfo = JSON.stringify(res.data.query),
        viewId = res.data.tableName.sql

      $.ajax({
        type: "post",
        url: "http://192.168.50.200:8880/dataviz/api/query.do",
        async: false, // 设为同步
        data: {
          view: viewId,
          query: queryInfo
        },
        dataType: "json",
        success: function(data) {
          if (res.data.type == 'table') {
            res.data.chartData = dataHandler(data.data, res.data.option.series, res.data.type)
          } else {
            res.data.option.series = dataHandler(data.data, res.data.option.series, res.data.type)
          }
        }
      })
      if (res.data.type == 'table') {
        // 处理数据
        var chartData = res.data.chartData;
        renderTmp('#chart' + chartId, 'tableViewTpl', chartData)

      } else {
        var myChart = echarts.init(document.getElementById('chart' + chartId));
        myChart.setOption(res.data.option);
        myChart.resize();
      }

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
  if (type == 'bar') {
    var queryNameY = query.valueColumns.map(x => x.name);
    var queryNameKeyY = queryNameY.map(function(x) {
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].source.name == x) {
          return columns[i].name;
        }
      }
    });
    series = Object.assign(
      [],
      seriesBar(rows, queryNameKeyY, {}, series)
    );
    return series
  } else if (type == 'line') {
    var queryNameY = query.valueColumns.map(x => x.name);
    var queryNameKeyY = queryNameY.map(function(x) {
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].source.name == x) {
          return columns[i].name;
        }
      }
    });
    series = Object.assign(
      [],
      seriesLine(rows, queryNameKeyY, {}, series)
    );
    return series
  } else if (type == 'pie') {
    // 获取维度和数值的name
    let queryNameX = query.categoryColumns.map(x => x.name);
    let queryNameY = query.valueColumns.map(x => x.name);
    // 根据name获取对应的key
    let queryNameKeyX = queryNameX.map(function(x) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].source.name == x) {
          return columns[i].name;
        }
      }
    });
    let queryNameKeyY = queryNameY.map(function(x) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].source.name == x) {
          return columns[i].name;
        }
      }
    });

    series = Object.assign(
      [],
      seriesPie(rows, queryNameKeyX, queryNameKeyY, {}, series)
    );
    return series
  } else if (type == 'table') {
    var chartData = replaceNull(data.data)
    return chartData
  }

}


// 禁用栅格
function disable() {
  dash.disable();
};
// 启用栅格
function enable() {
  dash.movable('.grid-stack-item', true);
  dash.resizable('.grid-stack-item', true);
};
// 加载拖拽栅格
function loadGrid() {
  $('#dash').gridstack(dashOptions);
  dash = $('#dash').data('gridstack');
  disable();
}

// 点击展示单个图表
var singleChart = echarts.init(document.getElementById('singleChart'));

$('body').on('click', '.grid-stack-item', function() {
  $('.chart_box').show();
  $('body').addClass('ovh')
  var chartId = $(this).attr('data-id');
  getJson('http://192.168.50.200:8880/dataviz/api/chart/info.do', {
    chart: chartId,
  }, function(res) {
    if (res.data.option) {
      var viewId = res.data.tableName.sql,
        queryInfo = JSON.stringify(res.data.query);
      $.ajax({
        type: "post",
        url: "http://192.168.50.200:8880/dataviz/api/query.do",
        async: false, // 设为同步
        data: {
          view: viewId,
          query: queryInfo
        },
        dataType: "json",
        success: function(data) {

          if (res.data.type == 'table') {
            res.data.chartData = dataHandler(data.data, res.data.option.series, res.data.type)
          } else {
            res.data.option.series = dataHandler(data.data, res.data.option.series, res.data.type)
          }
        }
      });
      if (res.data.type == 'table') {
        $('#singleChart').hide();
        $('#singleTable').show();
        singleChart.clear()
        var chartData = res.data.chartData;
        $('#singleTable').html('');
        renderTmp('#singleTable', 'tableViewTpl', chartData)
      } else {
        $('#singleChart').show();
        $('#singleTable').hide();
        singleChart.clear()
        singleChart.setOption(res.data.option);
        singleChart.resize();
      }


    }

  })

});

$('body').on('click', '.close', function() {
  $('.chart_box').hide();
  $('body').removeClass('ovh')

});
function replaceNull(chartData){
  // 空值替换为 '-'
  for(var i=0;i<chartData.rows.length;i++){
    for(var key in chartData.rows[i]){
      if(chartData.rows[i][key] === null){
        chartData.rows[i][key] = '-'
      }
    }
  }
  return chartData
}