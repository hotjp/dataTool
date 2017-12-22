;(function(factory) {
  factory()
})(function() {
  function seriesBar(rows, queryNameKeyY, seriesDefault, series) {
    if (series) {
      // 只组织data
      for (var j = 0;j < series.length;j++) {
        for (var i = 0; i < queryNameKeyY.length;i++) {
          if (series[j].name == queryNameKeyY[i]) {
            series[j].data = rows.map(function(x) {
              return x[queryNameKeyY[i]]
            });
          }
        }
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      for (var i = 0; i < queryNameKeyY.length; i++) {
        var copy = JSON.parse(JSON.stringify(seriesDefault));
        arr.push({
          data: rows.map(function(x){
            return x[queryNameKeyY[i]]
          }),
          type: 'bar',
          itemStyle: copy.itemStyle,
          name: queryNameKeyY[i]
        });
      }
      return arr
    }
  }
  window.seriesBar = seriesBar;
  return seriesBar
})