;
(function(factory) {
  factory()
})(function() {
  function seriesWordCloud(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series, isChartEditor) {
    if (series && arguments.length == 6) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
        var copy = JSON.parse(JSON.stringify(seriesDefault));
        for (var i = 0; i < rows.length; i++) {
          series[j].data[i] = {
            name: rows[i][queryNameKeyX[0]],
            value: 1
          };
        }
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      var copy = JSON.parse(JSON.stringify(seriesDefault));
      var data = [];
      var nameX = []
      for (var i = 0; i < queryNameKeyX.length; i++) {
        for (var j = 0; j < rows.length; j++) {
          data.push({
            name: rows[j][queryNameKeyX[i]],
            // FIXME: 目前数据结构没有value,只有name
            value: 1
          });
        }
        for (var k = 0; k < columns.length; k++) {
          if (columns[k].name == queryNameKeyX[k]) {
            nameX.push(columns[k].source.text);
          }
        }
      }
      arr.push({
        data: data,
        type: 'wordCloud',
        name: nameX[0],
        size: copy.size,
        sizeRange: copy.sizeRange,
        rotationRange: (function() {
          if (series && series.length) {
            var rotationRange;
            for (var j = 0; j < series.length; j++) {
              if (series[j].name) {
                if (series[j].name == queryNameKeyX[0]) {
                  rotationRange = series[j].rotationRange
                }
              }
            }
            return rotationRange || copy.rotationRange
          } else {
            return copy.rotationRange
          }
        })()
      });
      return arr
    }
  }
  window.seriesWordCloud = seriesWordCloud;
  return seriesWordCloud
})