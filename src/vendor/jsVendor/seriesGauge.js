;
(function(factory) {
  factory()
})(function() {
  function seriesGauge(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series, flag) {
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
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          var data = [0];
          for (var i = 0; i < queryNameKeyY.length; i++) {
            for (var k = 0; k < rows.length; k++) {
              data[0]+=rows[k][queryNameKeyY[i]];
            }
          }
          series[j].data = data;
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      if (flag) {
        var copy = JSON.parse(JSON.stringify(seriesDefault));
        var data = [0];
        for (var i = 0; i < queryNameKeyY.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            data[0]+=rows[j][queryNameKeyY[i]];
          }
        }
        arr.push({
          data: data,
          type: 'gauge',
          max:(function(){
            if(series && series.length){
              var max;                
              for(var j=0;j<series.length;j++){
                if(series[j].name){
                  if(series[j].name == nameY[0]){
                    max = series[j].max
                  }
                }
              }
              return max|| copy.max<data[0]?data[0]:copy.max               
            }else{
              return copy.axisLine
            }
          })(),
          name: nameY[0],
          axisLine: (function(){
            if(series && series.length){
              var axisLine;                
              for(var j=0;j<series.length;j++){
                if(series[j].name){
                  if(series[j].name == nameY[0]){
                    axisLine = series[j].axisLine
                  }
                }
              }
              return axisLine||copy.axisLine                
            }else{
              return copy.axisLine
            }
          })()
        });

      } else {

        var copy = JSON.parse(JSON.stringify(seriesDefault));
        var data = [0];
        for (var i = 0; i < queryNameKeyY.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            data[0]+=rows[j][queryNameKeyY[i]];            
          }
        }
        arr.push({
          data: data,
          type: 'gauge',
          name: nameY[0],
          max:copy.max,
          axisLine: copy.axisLine
        });
      }
      return arr
    }
  }
  window.seriesGauge = seriesGauge;
  return seriesGauge
})