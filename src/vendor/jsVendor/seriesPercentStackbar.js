;
(function(factory) {
  factory()
})(function() {
  function seriesPercentStackbar(columns, rows, queryNameKeyY, seriesDefault, series,isChartEditor) {
    var nameY = []
    for (var i = 0; i < queryNameKeyY.length; i++) {
      for (var j = 0; j < columns.length; j++) {
        if (columns[j].name == queryNameKeyY[i]) {
          nameY.push(columns[j].source.text);
        }
      }
    }
    if (series && arguments.length == 5) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
        for (var i = 0; i < queryNameKeyY.length; i++) {
          if (series[j].name == nameY[i]) {
            series[j].data = rows.map(function(x) {
              return x[queryNameKeyY[i]]
            });
            series[j].type = 'bar';
            series[j].tooltip = {
              formatter: '{c}%'
            }
          }
        }
      }
      for (var i = 0; i < rows.length; i++) {
        var sum = 0
        for (var j = 0; j < series.length; j++) {
          sum += series[j].data[i]
        }
        for (var j = 0; j < series.length; j++) {
          series[j].data[i] = Math.round(series[j].data[i] / sum * 100)
        }
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
        for (var i = 0; i < queryNameKeyY.length; i++) {
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          arr.push({
            data: rows.map(function(x) {
              return x[queryNameKeyY[i]]
            }),
            type: 'bar',
            itemStyle: (function() {
              if (series && series.length) {
                var itemStyle;
                for (var j = 0; j < series.length; j++) {
                  if (series[j].name) {
                    if (series[j].name == nameY[i]) {
                      itemStyle = series[j].itemStyle
                    }
                  }
                }
                return itemStyle || copy.itemStyle
              } else {
                return copy.itemStyle
              }
            })(),
            name: nameY[i],
            stack: '总量',
            tooltip: {
              formatter: '{c}%'
            }
          });
        }
        for (var i = 0; i < rows.length; i++) {
          var sum = 0
          for (var j = 0; j < arr.length; j++) {
            sum += arr[j].data[i]
          }
          for (var j = 0; j < arr.length; j++) {
            arr[j].data[i] = Math.round(arr[j].data[i] / sum * 100)
          }
        }
      
      return arr
    }
  }
  window.seriesPercentStackbar = seriesPercentStackbar;
  return seriesPercentStackbar
})