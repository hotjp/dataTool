;
(function(factory) {
  factory()
})(function() {
  function seriesRadar(columns,rows, queryNameKeyX, queryNameKeyY, seriesDefault, series, flag) {
    var queryY=[]
    for(var i=0;i<queryNameKeyY.length;i++){
      for(var j=0;j<columns.length;j++){
        if(queryNameKeyY[i] == columns[j].name){
          queryY.push(columns[j].source.text)
        }
      }
    }
    if (series && arguments.length == 6) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
        series[j].data = []
        for (var i = 0; i < queryNameKeyY.length; i++) {
          if (series[j].name == queryY[i]) {
            var data = [];
            series[j].data.push({
              name: queryY[i],
              value: rows.map(function(x) {
                return x[queryNameKeyY[i]]
              })
            })
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
          var data = [];
          data.push({
            name: queryY[i],
            value: rows.map(function(x) {
              return x[queryNameKeyY[i]]
            })
          })
          arr.push({
            data: data,
            type: 'radar',
            itemStyle: (function(){
              if(series && series.length){
                var itemStyle;
                for(var j=0;j<series.length;j++){
                  if(series[j].name){
                    if(series[j].name == queryY[i]){
                      itemStyle = series[j].itemStyle
                    }
                  }
                }
                return itemStyle||copy.itemStyle
              }else{
                return copy.itemStyle
              }
            })(),
            name: queryY[i],
          });
        }
      } else {
        for (var i = 0; i < queryNameKeyY.length; i++) {
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          var data = [];
          data.push({
            name: queryY[i],
            value: rows.map(function(x) {
              return x[queryNameKeyY[i]]
            })
          })
          arr.push({
            data: data,
            type: 'radar',
            itemStyle: copy.itemStyle,
            name: queryY[i],
          });
        }
      }
      return arr
    }
  }
  window.seriesRadar = seriesRadar;
  return seriesRadar
})