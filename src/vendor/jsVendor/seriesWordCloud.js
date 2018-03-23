;
(function(factory) {
  factory()
})(function() {
  function seriesWordCloud(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series, flag) {
    if (series && arguments.length == 6) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          for (var i = 0; i < rows.length; i++) {
            series[j].data[i]={
              name:rows[i][queryNameKeyX[0]],
              value:1
            };
          }
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      if (flag) {
        var copy = JSON.parse(JSON.stringify(seriesDefault));
        var data = [];
        for (var i = 0; i < queryNameKeyX.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            data.push({
              name: rows[j][queryNameKeyX[i]],
              // FIXME: 目前数据结构没有value,只有name
              value: 1
            });
          }
        }
        arr.push({
          data: data,
          type: 'wordCloud',
          name: 'wordCloud',
          size:copy.size,
          sizeRange:copy.sizeRange
        });

      } else {

        var copy = JSON.parse(JSON.stringify(seriesDefault));
        var data = [];
        for (var i = 0; i < queryNameKeyX.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            data.push({
              name: rows[j][queryNameKeyX[i]],
              // FIXME: 目前数据结构没有value,只有name
              value: 1
            });
          }
        }
        arr.push({
          data: data,
          type: 'wordCloud',
          name: 'wordCloud',
          size:copy.size,
          sizeRange:copy.sizeRange
        });
      }
      return arr
    }
  }
  window.seriesWordCloud = seriesWordCloud;
  return seriesWordCloud
})