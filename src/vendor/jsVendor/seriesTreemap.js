;
(function(factory) {
  factory()
})(function() {
  function seriesTreemap(query,rows, queryNameKeyX, queryNameKeyY, seriesDefault, series,isChartEditor) {
    function compareArr(arr,nameKey){
      for(var j=0;j<arr.length;j++){
        if(arr[j].name == nameKey){
          return true 
        }
      }
      return false            
    }
    function setData(ind){
      if(ind>=queryNameKeyX.length){
        return null
      }
      var dataArr=[],value=1;
      for(var i=0;i<rows.length;i++){
        // 去除重复值
        if(compareArr(dataArr,rows[i][queryNameKeyX[ind]])){
          continue
        }
        if(ind == queryNameKeyY.length-1 ){
          value = rows[i][queryNameKeyY[0]]
        }else{
          value = 1
        }
        dataArr.push({
          value:value,
          name:rows[i][queryNameKeyX[ind]],
          children:setData(ind+1),
          label:{
            normal:{
              formatter: '{b}: {c}'
            }
          },
        })
      }
      return dataArr
    }
    if (series && arguments.length == 6) {
      // 只组织data
      for (var j = 0; j < series.length; j++) {
        series[j].data = []
        series[j].data=setData(0);
      }
      return series
    } else {
      // chart_eitor组件用
      var arr = [];

        var copy = JSON.parse(JSON.stringify(seriesDefault));        
        // 有数值时按数值分匹配百分比，只有维度时平分
        var arrData = setData(0);
        arr.push({
          data: arrData,
          type: 'treemap',
          itemStyle: copy.itemStyle,
          name: '全部',
        });
      
      return arr
    }
  }
  window.seriesTreemap = seriesTreemap;
  return seriesTreemap
})