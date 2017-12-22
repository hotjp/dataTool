;(function(factory) {
  factory()
})( function() {
  function seriesPie(rows,queryNameKeyX, queryNameKeyY, seriesDefault, series) {
    if (series) {
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
          type: 'pie',
          itemStyle: copy.itemStyle||series[0].itemStyle,
          radius: copy.radius||series[0].radius
        });
      } else {
        // 0个维度多个数值，，，多个数值相加
        if (queryNameKeyY.length > 1) {
          // 多个数值
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          var data = [];
          for (var i = 0; i < queryNameKeyY.length; i++) {
            data.push({
              value: rows[0][queryNameKeyY[i]],
              name: queryNameKeyY[i]
            });
          }
          arr.push({
            data: data,
            type: 'pie',
            itemStyle: copy.itemStyle,
            radius: copy.radius
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
          type: 'pie',
          itemStyle: copy.itemStyle,
          radius: copy.radius
        });
      } else {
        // 0个维度多个数值，，，多个数值相加
        if (queryNameKeyY.length > 1) {
          // 多个数值
          var copy = JSON.parse(JSON.stringify(seriesDefault));
          var data = [];
          for (var i = 0; i < queryNameKeyY.length; i++) {
            data.push({
              value: rows[0][queryNameKeyY[i]],
              name: queryNameKeyY[i]
            });
          }
          arr.push({
            data: data,
            type: 'pie',
            itemStyle: copy.itemStyle,
            radius: copy.radius
          });
        }
      }
      return arr
    }
  }
  window.seriesPie = seriesPie;
  return seriesPie
})