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
