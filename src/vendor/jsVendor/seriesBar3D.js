
(function(factory) {
  factory();
})(function() {
  function seriesBar3D(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series, isChartEditor) {
    var x, y, z;
    for (var k = 0; k < queryNameKeyX.length; k++) {
      if (k == 0) {
        x = queryNameKeyX[0];
      } else if (k == 1) {
        y = queryNameKeyX[1];
      }
    }
    if (queryNameKeyY.length) {
      z = queryNameKeyY[0];
    }
    
    if (series && arguments.length == 6) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
        var data=[];
        for (var i = 0; i < rows.length; i++) {
          data.push([rows[i][x], rows[i][y], rows[i][z] ? rows[i][z]:0 ]);
        }
        series[j].data=data;
      }
      return series;
    } else {
      // chart_eitor组件用
      var arr = [],
        data = [];
      var copy = JSON.parse(JSON.stringify(seriesDefault));

      for (var i = 0; i < rows.length; i++) {
        data.push([rows[i][x], rows[i][y], rows[i][z] == '-' ? 0 : rows[i][z]]);
      }

      arr.push({
        data: data,
        type: 'bar3D',
        shading: 'lambert'
      });

      return arr;
    }
  }
  window.seriesBar3D = seriesBar3D;
  return seriesBar3D;
});