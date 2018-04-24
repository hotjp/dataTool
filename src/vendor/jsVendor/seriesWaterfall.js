;
(function(factory) {
  factory()
})(function() {
  function seriesWaterfall(columns, rows, queryNameKeyX, queryNameKeyY, seriesDefault, series,isChartEditor) {
    if (series && arguments.length == 6) {
      // 只组织data
      var data = [],
        helpdata = [0],
        sum = 0;
      // 两个以下维度，一个数值
      if (queryNameKeyY.length == 1) {
        var copy = JSON.parse(JSON.stringify(seriesDefault));
        for (var j = 0; j < rows.length; j++) {
          data.push(rows[j][queryNameKeyY[0]]);
          sum += rows[j][queryNameKeyY[0]]
        }
        data.unshift(sum)
        for (var i = 1; i < data.length; i++) {
          sum -= data[i];
          helpdata.push(sum);
        }
      } else {
        // 0个维度，两个以上数值,rows长度为1
        for (var i = 0; i < queryNameKeyY.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            data.push(rows[j][queryNameKeyY[i]]);
            sum += rows[j][queryNameKeyY[i]]
          }
        }
        data.unshift(sum)
        // 辅助数据
        for (var i = 1; i < data.length; i++) {
          sum -= data[i];
          helpdata.push(sum);
        }
      }

      //加入辅助数据        
      series[0].data = helpdata
      series[1].data = data

      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      var copy = JSON.parse(JSON.stringify(seriesDefault));
      var data = [],
        helpdata = [0],
        sum = 0;
      // 两个以下维度，一个数值
      if (queryNameKeyY.length == 1) {
        var copy = JSON.parse(JSON.stringify(seriesDefault));
        for (var j = 0; j < rows.length; j++) {
          data.push(rows[j][queryNameKeyY[0]]);
          sum += rows[j][queryNameKeyY[0]]
        }
        data.unshift(sum)
        for (var i = 1; i < data.length; i++) {
          sum -= data[i];
          helpdata.push(sum);
        }
      } else {
        // 0个维度，两个以上数值,rows长度为1
        for (var i = 0; i < queryNameKeyY.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            data.push(rows[j][queryNameKeyY[i]]);
            sum += rows[j][queryNameKeyY[i]]
          }
        }
        data.unshift(sum)
        // 辅助数据
        for (var i = 1; i < data.length; i++) {
          sum -= data[i];
          helpdata.push(sum);
        }
      }
      //加入辅助数据        
      arr.push({
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: helpdata
      })
      arr.push({
        data: data,
        type: 'bar',
        itemStyle: (function() {
          if (series && series.length) {
            var itemStyle;
            for (var j = 0; j < series.length; j++) {
              if (series[j].name) {
                if (series[j].name == queryNameKeyY[i] || series[j].name == '瀑布图') {
                  itemStyle = series[j].itemStyle
                }
              }
            }
            return itemStyle || copy.itemStyle
          } else {
            return copy.itemStyle
          }
        })(),
        name: '瀑布图',
        stack: '总量',
      });

      return arr
    }
  }
  window.seriesWaterfall = seriesWaterfall;
  return seriesWaterfall
})