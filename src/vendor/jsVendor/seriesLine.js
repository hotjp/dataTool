;
(function(factory) {
  factory()
})(function() {
  function seriesLine(columns, rows,queryNameKeyX, queryNameKeyY, seriesDefault, series, flag) {
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
      for (var j = 0; j < series.length; j++) {
        series[j].data = []
        for (var i = 0; i < queryNameKeyY.length; i++) {
          if (series[j].name == queryNameKeyY[i]) {
            for (var k = 0; k < rows.length; k++) {
              series[j].data.push(rows[k][
                [queryNameKeyY[i]]
              ])
            }
          }
        }
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      if (flag) {
        for (var i = 0; i < queryNameKeyY.length; i++) {
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          arr.push({
            data: rows.map(function(x) {
              return x[queryNameKeyY[i]]
            }),
            type: 'line',
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
            smooth: (function() {
              if (series && series.length) {
                var smooth;                
                for (var j = 0; j < series.length; j++) {
                  if (series[j].name) {
                    if (series[j].name == nameY[i]) {
                      smooth = series[j].smooth
                    }
                  }
                }
                return smooth || copy.smooth                
              } else {
                return copy.smooth
              }
            })(),
          });
        }
      } else {
        for (var i = 0; i < queryNameKeyY.length; i++) {
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          arr.push({
            data: rows.map(function(x) {
              return x[queryNameKeyY[i]]
            }),
            type: 'line',
            itemStyle: copy.itemStyle,
            smooth: copy.smooth,
            name: nameY[i]
          });
        }
      }
      return arr
    }
  }
  window.seriesLine = seriesLine;
  return seriesLine
})