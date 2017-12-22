;(function(factory) {
  factory()
})(function() {
  function seriesArea(rows, queryNameKeyY, seriesDefault, series) {
    if (series) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
        series[j].data=[]    
        for (var i = 0; i < queryNameKeyY.length; i++) {
          if (series[j].name == queryNameKeyY[i]) {
            for(var k =0;k<rows.length;k++){
              series[j].data.push(rows[k][[queryNameKeyY[i]]])
            }
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
          type: 'line',
          itemStyle: copy.itemStyle,
          smooth: copy.smooth,
          areaStyle: copy.areaStyle,
          name: queryNameKeyY[i]
        });
      }
      return arr
    }
  }
  window.seriesLine = seriesLine;
  return seriesLine
})