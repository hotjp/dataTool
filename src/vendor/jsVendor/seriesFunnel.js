;
(function(factory) {
  factory()
})(function() {
  function seriesFunnel(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series,isChartEditor) {
    if (series && arguments.length == 6) {
      // 只组织data
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
          type: 'funnel',
          label: copy.label || series[0].label,
          sort: copy.sort || series[0].sort
        });
      } else {
        // 0个维度多个数值，，，多个数值相加
        if (queryNameKeyY.length > 1) {
          var nameY = []
          for (var i = 0; i < queryNameKeyY.length; i++) {
            for (var j = 0; j < columns.length; j++) {
              if (columns[j].name == queryNameKeyY[i]) {
                nameY.push(columns[j].source.text);
              }
            }
          }
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
            type: 'funnel',
            label: copy.label,
            sort: copy.sort
          });
        }
      }
      return arr
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
            type: 'funnel',
            label: copy.label,
            sort: (function() {
              if (series && series.length) {
                for (var j = 0; j < series.length; j++) {
                  return series[j].sort || copy.sort
                }
              } else {
                return copy.sort
              }
            })()
          });
        } else {
          // 0个维度多个数值，，，多个数值相加
          if (queryNameKeyY.length > 1) {
            // 多个数值
            var nameY = []
            for (var i = 0; i < queryNameKeyY.length; i++) {
              for (var j = 0; j < columns.length; j++) {
                if (columns[j].name == queryNameKeyY[i]) {
                  nameY.push(columns[j].source.text);
                }
              }
            }
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
              type: 'funnel',
              label: copy.label,
              sort: (function() {
                if (series && series.length) {
                  for (var j = 0; j < series.length; j++) {
                    return series[j].sort || copy.sort
                  }
                } else {
                  return copy.sort
                }
              })()
            });
          }
        }

      return arr
    }
  }
  window.seriesFunnel = seriesFunnel;
  return seriesFunnel
})