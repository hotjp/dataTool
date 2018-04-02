;(function(factory) {
  factory()
})(function() {
  function seriesBar(columns,rows,queryNameKeyX, queryNameKeyY, seriesDefault, series, flag) {
    var nameY = []
    for (var i = 0; i < queryNameKeyY.length; i++) {
      for(var j=0;j<columns.length;j++){
        if(columns[j].name == queryNameKeyY[i]){
          nameY.push(columns[j].source.text);
        }
      }
    }
    if (series && arguments.length == 6) {
      // 只组织data
      for (var j = 0;j < series.length;j++) {
        if(queryNameKeyX.length){
          for (var i = 0; i < queryNameKeyY.length;i++) {
            var name;
            queryNameKeyX.length==1?name =nameY[i]: name =queryNameKeyY[i]
            if (series[j].name == name) {
              series[j].data = rows.map(function(x) {
                return x[queryNameKeyY[i]]
              });
              series[j].type='bar'
            }
          }
        }else{
          var copy = JSON.parse(JSON.stringify(seriesDefault));          
          var data=[];
          for (var i = 0; i < queryNameKeyY.length; i++) {
            for(var k=0;k<rows.length;k++){
              data.push(rows[k][queryNameKeyY[i]]);
            }
          }
          series[j].data = data;
        }
        
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];
      if(flag){
        if(queryNameKeyX.length){
          for (var i = 0; i < queryNameKeyY.length; i++) {
            var copy = JSON.parse(JSON.stringify(seriesDefault));
            arr.push({
              data: rows.map(function(x){
                return x[queryNameKeyY[i]]
              }),
              type: 'bar',
              itemStyle: (function(){
                // TODO: if(series)最好每个类型都加
                if(series && series.length){
                  var itemStyle;                  
                  for(var j=0;j<series.length;j++){
                    if(series[j].name){
                      if(series[j].name == nameY[i]){
                        itemStyle = series[j].itemStyle
                      }
                    }
                  }
                  return itemStyle||copy.itemStyle
                  
                }else{
                  return copy.itemStyle
                }
                
              })(),
              name: nameY[i],
              stack:null
            });
          }
        }else{
          var copy = JSON.parse(JSON.stringify(seriesDefault));          
          var data=[];
          for (var i = 0; i < queryNameKeyY.length; i++) {
            for(var j=0;j<rows.length;j++){
              data.push(rows[j][queryNameKeyY[i]]);
            }
          }
          arr.push({
            data: data,
            type: 'bar',
            itemStyle: (function(){
              // TODO: if(series)最好每个类型都加
              if(series && series.length){
                var itemStyle;                
                for(var j=0;j<series.length;j++){
                  if(series[j].name){
                    if(series[j].name == queryNameKeyY[i]){
                      itemStyle = series[j].itemStyle
                    }
                  }
                }
                return itemStyle||copy.itemStyle                
              }else{
                return copy.itemStyle
              }
            })(),
            name: '柱图',
            stack:null
          });
        }
      }else{
        if(queryNameKeyX.length){
          for (var i = 0; i < queryNameKeyY.length; i++) {
            var copy = JSON.parse(JSON.stringify(seriesDefault));
            arr.push({
              data: rows.map(function(x){
                return x[queryNameKeyY[i]]
              }),
              type: 'bar',
              itemStyle: copy.itemStyle,
              name: nameY[i],
              stack:null
            });
          }
        }else{
          var copy = JSON.parse(JSON.stringify(seriesDefault));          
          var data=[];
          for (var i = 0; i < queryNameKeyY.length; i++) {
            for(var j=0;j<rows.length;j++){
              data.push(rows[j][queryNameKeyY[i]]);
            }
          }
          arr.push({
            data: data,
            type: 'bar',
            itemStyle: copy.itemStyle,
            name: '柱图',
            stack:null
          });
        }
      }
      return arr
    }
  }
  window.seriesBar = seriesBar;
  return seriesBar
})