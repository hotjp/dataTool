if (!Array.prototype.collect) {
  /**
	 * 搜集数组项
	 * @param {Function} func
	 * @returns 与数组长度相等的func返回值列表
	 */
  Array.prototype.collect = function(func) {
    var arr = [];
    for (var i = 0, j = this.length; i < j; ++i)
      arr.push(func.call(this[i], this, i));
    return arr;
  };
}
if (!Array.prototype.toMap) {
  /**
	 * 将数组转换为一个map
	 * @param {Function} func 返回一个值，作为map的值
	 * @param {Boolean} 
	 */
  Array.prototype.toMap = function(func, reverseKv) {
    var map = {};
    for (var i = 0, j = this.length; i < j; ++i) {
      var k = this[i], v = func.call(k, this, i);
      if (reverseKv) {
        var k2 = k;
        k = v;
        v = k2;
      }
      map[k] = v;
    }
    return map;
  };
}

/**
 * 加载view
 * 
 * @param url
 * @param viewId
 * @param success 数据加载回调
 * @param newViewProvider 创建新视图的函数
 */
function loadView(url, viewId, success, newViewProvider) {
  viewId = parseInt(viewId, 10) || 0;
  if (!viewId) {
    var view = newViewProvider();
    success(view);
  } else {
    var fail = function(msg, err, viewId) {
      alert(msg + (err ? (': ' + err) : ''));
      try {
        opener.viewDetailFailed(viewId);
      } catch (e) {
        trace(e);
      }
    };
    
    getAsyncJSON(url, {
      keyId : viewId
    }, function(data) {
      success(data.en);
    }, function(err) {
      if (err && typeof err == 'object' && err.errorMessages)
        err = unwrapActionError(err);
      fail('无法加载视图', err, viewId);
    }, function(err) {
      if (err && typeof err == 'object' && err.errorMessages)
        err = unwrapActionError(err);
      fail('无法加载视图', err, viewId);
    }, SUPPRESS_ERR_DLG);
  }
}
	
function getNewViewProvider(viewType) {
  var provider = function() {
    return {
      viewId : null,
      viewName : '',
      dispName : '',
      viewType : viewType,
      viewSchema : null,
      dataSrcId : null,
      columns : [],
      columnMaps : [],
      viewRefs : [],
      viewRefRelations : [],
      viewFilters : [],
      viewOrders : [],
      viewParams : [],
      subViews : [],
      subViewColumns : []
    };
  };
  return provider;
}




// 生成唯一id
var ___id_counters = {};
function newId(key) {
  var id = ___id_counters[key] || 0;
  return ___id_counters[key] = (--id);
}
function initviewRelId(){
  if(vb._view.joins.length){
    ___id_counters['viewRelId']=vb._view.joins[0].viewRelId;    
    for(var i = 0;i<vb._view.joins.length;i++){
      if(vb._view.joins[i].viewRelId<___id_counters['viewRelId']){
        ___id_counters['viewRelId']=vb._view.joins[i].viewRelId;
      }
    }
  }
}