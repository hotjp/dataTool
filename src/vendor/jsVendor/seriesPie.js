;
(function(factory) {
  factory()
})(function() {
  function seriesPie(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series,isChartEditor) {
    var nameY = []
    for (var i = 0; i < queryNameKeyY.length; i++) {
      for (var j = 0; j < columns.length; j++) {
        if (columns[j].name == queryNameKeyY[i]) {
          nameY.push(columns[j].source.text);
        }
      }
    }
    if (series && arguments.length == 6) {
      // 只组织data
      if (queryNameKeyX.length) {
        // 一个维度一个数值
        // 一个数值
        for (var j = 0; j < series.length; j++) {
          series[j].data = []
          for (var i = 0; i < rows.length; i++) {
            series[j].data.push({
              name: rows[i][queryNameKeyX[0]],
              value: rows[i][queryNameKeyY[0]]
            });
          }
        }

      } else {
        // 0个维度多个数值，，，多个数值相加
        if (queryNameKeyY.length > 1) {
          // 多个数值
          for (var j = 0; j < series.length; j++) {
            series[j].data = []
            for (var i = 0; i < queryNameKeyY.length; i++) {
              series[j].data.push({
                value: rows[0][queryNameKeyY[i]],
                name: nameY[i]
              });
            }
          }
        }
      }

      return series
    } else {
      // chart_eitor组件用
      var arr = [];
        if (queryNameKeyX.length) {
          // 一个维度一个数值
          // 一个数值
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          var data = [];
          for (var i = 0; i < rows.length; i++) {
            data.push({
              name: rows[i][queryNameKeyX[0]],
              value: rows[i][queryNameKeyY[0]]
            });
          }
          arr.push({
            data: data,
            type: 'pie',
            radius: (function() {
              if (series && series.length) {
                for (var j = 0; j < series.length; j++) {
                  return series[j].radius || copy.radius
                }
              } else {
                return copy.radius
              }
            })()
          });
        } else {
          // 0个维度多个数值，，，多个数值相加
          if (queryNameKeyY.length >= 1) {
            // 多个数值
            var copy = JSON.parse(JSON.stringify(seriesDefault));
            var data = [];
            for (var i = 0; i < queryNameKeyY.length; i++) {
              data.push({
                value: rows[0][queryNameKeyY[i]],
                name: nameY[i]
              });
            }
            arr.push({
              data: data,
              type: 'pie',
              radius: (function() {
                if (series && series.length) {
                  for (var j = 0; j < series.length; j++) {
                    return series[j].radius || copy.radius
                  }
                } else {
                  return copy.radius
                }
              })()
            });
          }
        }
      
      return arr
    }
  }
  window.seriesPie = seriesPie;
  return seriesPie
})