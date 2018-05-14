// 常量

var VIEW_TYPE_USER_COMPOSITE = 'C';
var VIEW_TYPE_USER_SQL = 'S';
var VIEW_TYPE_VIEW = 'V';
var VIEW_TYPE_TABLE = 'T';


var SUPPRESS_ERR_DLG = false;

/**
 * view builder
 */
var vb = {
  _view:{
    filters:[],
    joins:[],
    orders:[],
    tables:[]
  },
  opts: {},
  init: function (opts) {
    $.extend(this.opts, opts || {});
    return this;
  },

  /**
	 * 加载view
	 * 
	 * @param viewId
	 */
  load: function (viewId) {
    // extractViewDef返回当前视图数据
    var view=page.url.get('view')&&'string'==typeof page.url.get('view') ? page.url.get('view') : 0;
    if(view){
      getJson('/dataview/design/info.do',{
        view: view
      },
      function(res) {
        if(res.success){
          vb.showView(res.data.structure);
          getNewViewProvider(VIEW_TYPE_USER_COMPOSITE);
          $('#viewName').val(res.data.name);
          vb._layout=res.data.layout;
          // vb._folder=res.data.folder;
        }
      });
    }else{
      vb.showView(vb._view);
    }
  },

  /**
	 * 保存查询
	 */
  save: function () {
    var view = JSON.parse(JSON.stringify(this._view));
    view.viewName = $.trim($('#viewName').textbox('getValue'));
    view.dispName = $.trim($('#viewDispName').textbox('getValue'));
    view.dataSrcId = vb.dataSource.getCurrentDataSource().data_src_id;

    console.info('保存视图:');
    console.info(view);
    if (!this.validate(this._view, view)) {
      return;
    }

    function succeeded(data) {
      console.info('保存成功:');
      console.info(data);
      alert('保存成功');
      location.href = replaceSearch({ keyId: data.keyId });
    }
    function failed(err) {
      console.info('保存失败:');
      console.info(err);
      if (err && typeof err == 'object' && err.errorMessages)
        err = unwrapActionError(err);
      alert('保存失败:' + err);
    }

    getAsyncJSON(
      this.opts['viewSaveUrl'],
      { viewJson: JSON.stringify(view) },
      succeeded,
      failed,
      failed,
      SUPPRESS_ERR_DLG);















  },
  // validate: function (oldView, newView) {
  //   // 如果查询名称更改则提示，如果没有名称则禁止提交
  //   if (!newView.viewName) {
  //     $('#viewName').textbox('setValue', '').textbox('validate');
  //     alert('必须填写视图名');
  //     return false;
  //   }
  //   if (newView['viewName'] != oldView['viewName'] && oldView['viewName']) {
  //     if (!confirm('如果修改视图名，可能会造成已有视图和查询报表无法使用，是否继续？')) {
  //       $('#viewName').textbox('setValue', oldView['viewName']);
  //       return false;
  //     }
  //   }
  //   if (!newView.dispName) {
  //     $('#viewDispName').textbox('setValue', '').textbox('validate');
  //     alert('必须填写视图显示名');
  //     return false;
  //   }
  //   if (!newView.dataSrcId)
  //     return !!alert('必须选择数据源');
  //   if (!newView.columns || !newView.columns.length)
  //     return !!alert('必须选择输出列');

  //   // 如果有多个子视图，则不允许存在游离视图
  //   if (newView.viewRefs.length > 1) {
  //     var viewRefMap = newView.viewRefs.toMap(function () { return this.viewRefId; }, true);
  //     $.each(newView.viewRefRelations, function () {
  //       delete viewRefMap[this.srcViewRefId];
  //       delete viewRefMap[this.destViewRefId];
  //     });
  //     var unconnectedViews = [];
  //     for (var viewRefId in viewRefMap) {
  //       if (viewRefMap.hasOwnProperty(viewRefId)) {
  //         var viewRef = viewRefMap[viewRefId];
  //         unconnectedViews.push(viewRef.view.dispName + '(' + viewRef.viewAlias + ')');
  //       }
  //     }
  //     if (unconnectedViews.length > 0) {
  //       alert('视图之间必须建立关联关系，以下视图没有建立关联：' + unconnectedViews.join(','));
  //       return false;
  //     }
  //   }

  //   // 不可能所有的视图都是子查询，子查询之间不能互相关联
  //   // 如果子查询关联了多个标准视图，则这些标准视图之间必须通过某种关系关联到一起
  //   if (newView.viewRefs.length) {
  //     var subQueries = newView.viewRefs.filter(function () { return this.isSubQuery; });
  //     if (subQueries.length == newView.viewRefs.length)
  //       return !!alert('不能将所有的视图定义为子查询');

  //     // 从子查询上连接的标准视图出发，如果标准视图之间能够互相连接，则该关联合法
  // 	  /**
  // 	   * 检查viewRefMap中的视图是否能连通，如果连通则标记_connected = 1
  // 	   */
  //     function traverseViews(viewRefMap, viewRefRels, viewRef) {
  //       if (!viewRef) {
  //         // 递归入口
  //         // 清除所有viewRef的_connected标记
  //         for (var i in viewRefMap)
  //           if (viewRefMap.hasOwnProperty(i))
  //             delete viewRefMap[i]._connected;
  //         // 从任意viewRef开始遍历
  //         for (var viewRefId in viewRefMap) {
  //           if (viewRefMap.hasOwnProperty(viewRefId)) {
  //             traverseViews(viewRefMap, viewRefRels, viewRefMap[viewRefId]);
  //             break;
  //           }
  //         }
  //       } else {
  //         // 从viewRefRel递归查找所有关联的viewRef
  //         viewRef._connected = true;
  //         for (var i = 0, j = viewRefRels.length, viewRefRel, destViewRef; i < j; ++i) {
  //           viewRefRel = viewRefRels[i];
  //           if (viewRefRel.srcViewRefId == viewRef.viewRefId) {
  //             destViewRef = viewRefMap[viewRefRel.destViewRefId];
  //           } else if (viewRefRel.destViewRefId == viewRef.viewRefId) {
  //             destViewRef = viewRefMap[viewRefRel.srcViewRefId];
  //           }
  //           // 继续遍历标准视图
  //           if (destViewRef && !destViewRef._connected) {
  //             traverseViews(viewRefMap, viewRefRels, destViewRef);
  //           }
  //         }
  //       }
  //     }

  //     var subQueryReferencedSubQueries = []; // 与子查询关联的子查询
  //     var unconnectedStandardViewsReferencedBySubQueries = []; // 与子查询关联的，但与其他视图没有互通的视图，{ viewRef : 子查询, unconnectedViewRefs : [ 未连通的标准视图, ... ] }
  //     $.each(newView.viewRefs, function () {
  //       var viewRef = this;
  //       if (!viewRef.isSubQuery)
  //         return;

  //       // 当前子查询直接关联的所有标准视图，要检查视图之间的连通性
  //       var standardViewRefMap = {};
  //       $.each(newView.viewRefRelations, function () {
  //         var viewRefRel = this,
  //           targetViewRef;
  //         if (viewRefRel.srcViewRefId == viewRef.viewRefId) {
  //           targetViewRef = vb.findViewRef(viewRefRel.destViewRefId);
  //         } else if (viewRefRel.destViewRefId == viewRef.viewRefId) {
  //           targetViewRef = vb.findViewRef(viewRefRel.srcViewRefId);
  //         } else {
  //           return;
  //         }

  //         if (targetViewRef.isSubQuery) {
  //           // 检查目标视图是否子查询
  //           if (!subQueryReferencedSubQueries.first(function () { return this.viewRefId == targetViewRef.viewRefId; })) {
  //             // 添加源视图
  //             if (!subQueryReferencedSubQueries.first(function () { return this.viewRefId == viewRef.viewRefId; }))
  //               subQueryReferencedSubQueries.push(viewRef);
  //             // 添加目标视图
  //             subQueryReferencedSubQueries.push(targetViewRef);
  //           }
  //         } else {
  //           // 搜集子视图所有关联的标准视图
  //           standardViewRefMap[targetViewRef.viewRefId] = targetViewRef;
  //         }
  //       });

  //       // 如果是标准视图，则遍历所有关联视图，检查视图之间是否能够连通
  //       traverseViews(standardViewRefMap, newView.viewRefRelations);
  //       var unconnectedViewRefs = [];
  //       for (var viewRefId in standardViewRefMap) {
  //         if (standardViewRefMap.hasOwnProperty(viewRefId)) {
  //           if (!standardViewRefMap[viewRefId]._connected) {
  //             unconnectedViewRefs.push(standardViewRefMap[viewRefId]);
  //           }
  //         }
  //       }
  //       // 记录当前视图和未连通的标准视图
  //       if (unconnectedViewRefs.length) {
  //         unconnectedStandardViewsReferencedBySubQueries.push({
  //           viewRef: viewRef,
  //           unconnectedViewRefs: unconnectedViewRefs
  //         });
  //       }
  //     });

  //     if (subQueryReferencedSubQueries.length) {
  //       return !!alert('子查询之间不能直接关联，以下视图之间不能建立关联:\n' + subQueryReferencedSubQueries.collect(function () {
  //         return this.view.dispName + '(' + this.viewAlias + ')';
  //       }).join(', '));
  //     }

  //     if (unconnectedStandardViewsReferencedBySubQueries.length) {
  //       var msg = '子查询关联到的标准视图之间必须互相连通，以下视图可能未连通到其他标准视图:\n' +
  //         unconnectedStandardViewsReferencedBySubQueries.collect(function () {
  //           return '子视图: ' + this.viewRef.view.dispName + '(' + this.viewRef.viewAlias + ')，未连通的标准视图: ' +
  //             this.unconnectedViewRefs.collect(function () {
  //               return this.view.dispName + '(' + this.viewAlias + ')';
  //             }).join(',');
  //         }).join(';\n');
  //       return !!alert(msg);
  //     }

  //   }

  //   return true;
  // },

  // /**
  //  * 请求父页面关闭tab，如果父页面无响应则尝试关闭页面
  //  */
  // close: function () {
  //   try {
  //     var search = extractSearch();
  //     window.opener.closeTab(search['keyId']);
  //   } catch (e) {
  //     console.info(e);
  //     window.close();
  //   }
  // },




  // _view: null,
  /**
	 * 显示视图
	 * @param view
	 */
  showView: function (view) {
    this._view = view;
    // 初始化关联关系id
    initviewRelId();
    // if (view.dataSrcId) {
    //   // 锁定dataSource，更新视图列表
    //   $('#dataSources').combobox('setValue', view.dataSrcId).combobox('disable');
    //   vb.dataSource.reloadViewList();
    // }

    // 为没有映射的列创建虚拟映射关系，以简化布局逻辑。在保存之前过滤掉没有使用的

    // 映射view/viewRef/viewRefRelation/viewColumnMap
    // 将subViewColumns分配到subView.columns
    // 同时标记对象的TYPE属性，用于在graph函数中根据TYPE处理图形
    // var viewColumnMap = {},
    //   viewColumnMapMap = {};

    // // 映射viewRefId/colId -> viewColumnMap
    // $.each(view['columnMaps'] || [], function () {
    //   viewColumnMapMap[this['subViewRefId'] + '/' + this['subColId']] = this;
    // });

    // // 映射viewId -> view
    // this.registerView(view);
    // view['TYPE'] = 'VIEW';
    // $.each(view['subViews'] || [], function () {
    //   var subView = this;
    //   vb.registerView(subView);
    //   subView['TYPE'] = 'VIEW';

    //   // 从subViewColumns查找属于subView的column
    //   var cols = [];
    //   $.each(view.subViewColumns || [], function () {
    //     if (this['viewId'] == subView['viewId']) {
    //       cols.push(this);
    //       this['TYPE'] = 'COLUMN';
    //     }
    //     viewColumnMap[this['colId']] = this;
    //   });
    //   subView['columns'] = cols;
    // });

    // $.each(view['columns'] || [], function () {
    //   viewColumnMap[this['colId']] = this;
    // });

    // 映射viewRefId -> viewRef
    $.each(view['tables'] || [], function () {
      var viewRef = this;
      // view = vb.findView(viewRef['alias']);
      vb.registerViewRef(viewRef);
      // viewRef['view'] = view;
      viewRef['TYPE'] = 'REFERENCE';
    });
    //   // 添加column映射关系，映射关系与view的columns一一对应，如果不存在映射则创建虚拟映射
    //   var colMappings = [];
    //   $.each(view.columns, function () {
    //     var col = $.extend({}, this, { TYPE: 'COLUMN_MAPPING_SUB' }),
    //       colMap = viewColumnMapMap[viewRef['viewRefId'] + '/' + col['colId']],
    //       parentCol = null;
    //     if (!colMap) {
    //       parentCol = $.extend({}, col, {
    //         colId: vb.newId('colId'),
    //         viewId: view['viewId'],
    //         output: false
    //       });

    //       colMap = {
    //         parentViewId: view['viewId'],
    //         parentColId: parentCol.colId,
    //         parentCol: parentCol,
    //         seqId: null,
    //         subColId: col['colId'],
    //         subViewRefId: viewRef['viewRefId'],
    //         viewColMapId: vb.newId('viewColMapId')
    //       };
    //     } else {
    //       parentCol = viewColumnMap[colMap['parentColId']];
    //       parentCol = $.extend({}, parentCol, { output: true });
    //     }
    //     parentCol['TYPE'] = 'COLUMN_MAPPING_PARENT';

    //     colMap['parentCol'] = parentCol;
    //     colMap['subCol'] = col;
    //     colMap['TYPE'] = 'COLUMN_MAPPING';
    //     colMappings.push(colMap);
    //   });
    //   viewRef['columnMappings'] = colMappings;
    // });

    // 映射viewRelId -> viewRefRel
    $.each(view['joins'] || [], function () {
      vb.registerViewRefRelation(this);
      this['TYPE'] = 'RELATION';
    });

    this.diagram.show(view, this.opts['container']);
  },

  _viewMap: {}, // viewId -> view
  _viewRefMap: {}, // viewRefId -> viewRef
  _viewRefRelationMap: {}, // viewRelId -> viewRefRelation
  findView: function (viewId) {
    return this._viewMap[viewId];
  },
  findViewRef: function (viewRefId) {
    return this._viewRefMap[viewRefId];
  },
  findViewRefRelation: function (viewRelId) {
    return this._viewRefRelationMap[viewRelId];
  },
  // registerView: function (view) {
  //   this._viewMap[view.viewId] = view;
  // },
  registerViewRef: function (viewRef) {
    if (this._viewRefMap[viewRef.alias]) {
      alert('视图已存在');
      return false;
    } else {
      this._viewRefMap[viewRef.alias] = viewRef;
      return true;
    }
  },
  registerViewRefRelation: function (viewRefRel) {
    if (!viewRefRel.viewRelId) {
      viewRefRel.viewRelId = vb.newId('viewRelId');
    }
    this._viewRefRelationMap[viewRefRel.viewRelId] = viewRefRel;
  },

  // /**
  //  * 显示设计器说明
  //  * @param target
  //  */
  // showHelp: function (target) {
  //   qutils.showHelp(target, $('#diagramHelp'));
  // },

  // 生成唯一id
  newId: function (key) {
    return newId(key);
  }
};

// /**
//  * 数据源分析
//  */
// vb.dataSource = {
//   newViewBuilder: function () {
//     openWindow(replaceSearch({ keyId: '' }), null, null, $(window).width(), $(window).height());
//   },
//   newSqlViewBuilder: function () {
//     openWindow(vb.opts['sqlViewBuilderUrl'], null, null, $(window).width(), $(window).height());
//   },
//   onDataSourceChanged: function (newValue, oldValue, callback) {
//     $('#vb-dataSource-viewListContainer').show();
//     vb.dataSource.showViewList(newValue, null, callback);
//   },
//   reloadViewList: function (callback) {
//     var dataSrcId = $('#dataSources').combobox('getValue');
//     delete this._dataViewListMap[dataSrcId];
//     this.onDataSourceChanged(dataSrcId, dataSrcId, callback);
//   },
// _dataViewListMap: {},
// dataSrcId -> objList
// /**
//  * 显示视图定义列表
//  */
// showViewList: function (dataSrcId, objType, shownCallback) {
//   var list = $('#vb-dataSource-viewList').empty();

//   // 加载并显示数据
//   var viewList = this._dataViewListMap[dataSrcId];
//   if (viewList) {
//     // 显示视图列表
//     // 视图versionId < 0表示不可用，通常是这些视图引用了当前视图或是当前视图本身
//     $.each(viewList, function () {
//       var viewItem = $('<li>' + this.dispName + (this.viewType == VIEW_TYPE_USER_COMPOSITE ? '' : ' *') +
//         '<br/><span class=\'note\'>' + this.viewName + '</note></li>')
//         .data('view', this)
//         .click(function () {
//           $(this).addClass('selected').siblings().removeClass('selected');
//           var editLink = $(this).children('.editLink');
//           if (!editLink.length)
//             editLink = $('<a class=\'qb-icon-edit editLink\' onclick=\'vb.dataSource.onClickView(this)\'>&nbsp;</a>').appendTo($(this));
//         })
//         .appendTo(list);
//       if (this.viewId > 0) {
//         viewItem
//           .attr('ondblclick', 'vb.dataSource.addToDiagram($(this).data(\'view\'))')
//           .attr('title', '双击以添加视图');
//       } else {
//         viewItem
//           .addClass('vb-view-unavailable')
//           .attr('title', '此视图引用了当前视图或是当前视图自身，不能添加到关系图中');
//       }
//     });
//     if (shownCallback)
//       shownCallback(viewList);
//   } else {
//     var fail = function (err) {
//       console.info(err);
//       if (window.confirm('无法获取数据源信息，是否重试？')) {
//         vb.dataSource.showViewList(dataSrcId, objType, shownCallback);
//       }
//     };
//     getAsyncJSON(vb.opts['viewListByDataSourceUrl'], {
//       keyId: dataSrcId,
//       excludeByViewId: vb._view.viewId // 结果视图列表中不能引用或包含指定的视图
//     }, function (data) {
//       vb.dataSource._dataViewListMap[dataSrcId] = data.en || [];
//       vb.dataSource.showViewList(dataSrcId, objType, shownCallback);
//     }, fail, fail, SUPPRESS_ERR_DLG);
//   }
// },
// onClickView: function (viewLink) {
//   var view = $(viewLink).closest('LI').data('view');
//   if (view) {
//     var url = replaceSearch({ keyId: view.viewId });
//     window.open(url);
//   } else {
//     alert('无视图数据');
//   }
// },

// /**
//  * 添加视图到关系图
//  */
// addToDiagram: function (view) {
//   // 锁定dataSource，不支持从多个数据源添加视图
//   $('#dataSources').combobox('disable');

//   // TODO 验证：禁止添加视图自身或依赖于当前视图的视图
//   // 过滤已在后台读取视图列表时实现
//   if (vb._view.viewId == view.viewId) {
//     return alert('不能添加当前视图');
//   }
//   vb.diagram.addView(view);
// },

// /**
//  * 获取当前所选数据源 { data_src_id, data_src_name, ... }
//  */
// getCurrentDataSource: function () {
//   var dataSrcSelect = $('#dataSources'),
//     dataSrcId = parseInt(dataSrcSelect.combobox('getValue'), 10),
//     dataSrc = dataSrcSelect.combobox('getData').first(function () { return this.data_src_id == dataSrcId; });
//   return dataSrc;
// },

//   _browserDataSrcId: null,
//   /**
// 	 * 打开数据库对象选择
// 	 */
//   openDatabaseBrowser: function (clearSelection) {
//     var dataSrc = this.getCurrentDataSource();
//     if (!dataSrc) {
//       return alert('未找到数据源');
//     }
//     var title = '选择要添加的对象 - ' + dataSrc.data_src_name + '(' + dataSrc.data_src_type + ')';
//     this.showDatabaseBrowser(title);

//     if (this._browserDataSrcId != dataSrc.data_src_id) {
//       // 刷新对象列表
//       $('#dataSourceSchemas').combobox({
//         url: vb.opts['dataSourceSchemaListUrl'] + '?dataSrcId=' + dataSrc.data_src_id,
//         loadFilter: function (data) {
//           return data.data.collect(function () {
//             return { text: this, value: this };
//           });
//         },
//         onChange: function (newValue) {
//           vb.dataSource.loadViewList(dataSrc, newValue);
//         }
//       });
//     }

//     if (clearSelection)
//       $('#t-databaseObject').datagrid('unselectAll').datagrid('reload');
//     this._browserDataSrcId = dataSrc.data_src_id;
//   },
//   loadViewList: function (dataSrc, schema, callback) {
//     var dg = $('#t-databaseObject').datagrid('loadData', []);
//     var loadObjectList = function () {
//       getAsyncJSON(vb.opts['dataSourceObjectListUrl'], {
//         dataSrcId: dataSrc.data_src_id,
//         schema: schema
//       }, function (data) {
//         // 显示对象列表
//         dg.datagrid('unselectAll').datagrid('loadData', data.data);
//         if (callback)
//           callback(data.data);
//       }, fail, fail, SUPPRESS_ERR_DLG);
//     };
//     var fail = function (err) {
//       console.info(err);
//       if (window.confirm('无法加载对象列表，是否重试？')) {
//         loadObjectList(dataSrc.data_src_id);
//       }
//     };
//     loadObjectList(dataSrc.data_src_id);
//   },
//   showDatabaseBrowser: function (title) {
//     $('#vb-dataSource-browser').dialog({ closed: false, title: title });
//   },
//   closeDatabaseBrowser: function () {
//     $('#vb-dataSource-browser').dialog({ closed: true });
//   },
//   /**
// 	 * 确认选择
// 	 */
//   confirmSelectedDatabaseObjects: function () {
//     var selected = $('#t-databaseObject').datagrid('getSelections');
//     if (!selected.length)
//       return alert('未选择对象');
//     this.openViewInfoCollector(selected);
//   },
//   _getExistingViewNameMap: function () {
//     var dataSrc = vb.dataSource.getCurrentDataSource(),
//       viewList = vb.dataSource._dataViewListMap[dataSrc.data_src_id];
//     if (!viewList.viewNameMap) {
//       viewList.viewNameMap = viewList.toMap(function () { return this.viewName.toUpperCase(); }, true);
//     }
//     return viewList.viewNameMap;
//   },
//   _findExistingView: function (view) {
//     var viewNameMap = vb.dataSource._getExistingViewNameMap();
//     return viewNameMap[view.viewName.toUpperCase()];
//   },
//   databaseObjectStyler: function (value, row) {
//     if (vb.dataSource._findExistingView(row))
//       return 'background-color:#ddd';
//     return null;
//   },
//   databaseObjectNameFormatter: function (val) {
//     return '<span class=\'qb-icon-info\' title=\'查看对象信息\' onclick="stopEvent(event);vb.dataSource.showDatabaseObjectInfo(\'' + val + '\');">&nbsp;</span> ' + val;
//   },

//   showDatabaseObjectInfo: function (objName) {
//     var dataSrc = vb.dataSource.getCurrentDataSource(),
//       schema = $('#dataSourceSchemas').combobox('getValue');
//     alert('对象信息:' + schema + '.' + objName);
//     // TODO
//   },


//   showViewInfoCollector: function () {
//     $('#vb-dataSource-viewInfoCollector').dialog({ closed: false });
//   },
//   /**
// 	 * 完善要生成的视图信息
// 	 */
//   openViewInfoCollector: function (dbObjectList) {
//     this.closeDatabaseBrowser();
//     this.showViewInfoCollector();
//     // 判断对象的操作类型：已经存在对应视图模型的只做更新
//     $.each(dbObjectList, function () {
//       var existingView = vb.dataSource._findExistingView(this);
//       if (existingView) {
//         this._op = 'UPDATE';
//         this.dispName = existingView.dispName;
//       } else {
//         this._op = 'CREATE';
//       }
//     });
//     $('#t-databaseObject-viewInfo').datagrid('unselectAll').datagrid('loadData', dbObjectList);
//   },
//   formatViewOperation: function (val) {
//     if (val == 'CREATE')
//       return '创建';
//     else if (val == 'UPDATE')
//       return '更新';
//     else
//       return '';
//   },
//   /**
// 	 * 刷新浏览对象浏览对话框视图列表
// 	 */
//   reloadDatabaseObjectList: function (callback) {
//     // 刷新视图列表
//     var dataSrc = vb.dataSource.getCurrentDataSource(),
//       schema = $('#dataSourceSchemas').combobox('getValue');
//     vb.dataSource.loadViewList(dataSrc, schema, callback);
//   },
//   /**
// 	 * 完善数据库对象信息，创建视图模型
// 	 */
//   buildViewForDatabaseObjects: function (closeDialogWhenGenerate) {
//     var dg = $('#t-databaseObject-viewInfo'),
//       data = dg.datagrid('getData').rows;
//     if (!data.length) {
//       return;
//     } else if (data.length > 5 && !confirm('要生成的对象如果太多，可能要等待很长时间才能完成操作，是否继续生成？')) {
//       return;
//     }

//     gridHelper.applyEdit(dg);

//     // 检查名称
//     for (var i = 0; i < data.length; ++i) {
//       var view = data[i];
//       view.dispName = $.trim(view.dispName);
//       if (!view.dispName)
//         return alert('对象\'' + view.viewName + '\'的显示名必须填写');
//       else if (view.dispName.length > 30)
//         return alert('名称\'' + view.dispName + '\'(' + view.dispName.length + '个字符)超长，最长不能超过30个字符');
//     }

//     // 生成对象
//     var viewList = [].concat(data), total = viewList.length;
//     // 记录未生成的视图，成功后移除，如果中途取消，则重新打开未生成的视图
//     var todoViewMap = viewList.toMap(function () { return this.viewName.toUpperCase(); }, true);
//     var generate = function () {
//       var view = viewList.shift();
//       if (!view) {
//         // done
//         alert('视图模型生成完毕');
//         $('body').unmask();
//         vb.dataSource.closeViewInfoCollector();
//         vb.dataSource.reloadDatabaseObjectList();
//         vb.dataSource.reloadViewList();
//         return;
//       }
//       $('body').mask('生成视图模型 ' + (total - viewList.length) + '/' + total + '...');

//       // 生成失败处理
//       var fail = function (err) {
//         console.info(err);
//         if (err && typeof err == 'object' && err.errorMessages)
//           err = unwrapActionError(err);
//         if (confirm('生成视图模型\'' + view.dispName + '\'失败:' + (err.constructor == Error ? err.message : err.substring(0, 100)) + '，是否继续？')) {
//           generate();
//         } else {
//           viewList.length = 0;
//           $('body').unmask();
//           vb.dataSource.reloadViewList(function () {
//             vb.dataSource.reloadDatabaseObjectList(function (objectList) {
//               // 更新视图列表后，重新打开对话框
//               // 筛选出未成功和未生成的
//               var todoList = [];
//               $.each(objectList, function () {
//                 if (todoViewMap[this.viewName.toUpperCase()])
//                   todoList.push(this);
//               });
//               vb.dataSource.openViewInfoCollector(todoList);
//             });
//           });
//         }
//       };

//       var dataSrc = vb.dataSource.getCurrentDataSource();
//       getAsyncJSONWithoutProgress(vb.opts['viewGenerateUrl'], {
//         'en.dataSrcId': dataSrc.data_src_id,
//         'en.viewSchema': view.viewSchema,
//         'en.viewName': view.viewName,
//         'en.dispName': view.dispName,
//         operation: view._op
//       }, function (data) {
//         // 生成成功
//         // 删除待办列表中的视图，继续生成
//         view._generated = true;
//         delete todoViewMap[view.viewName.toUpperCase()];
//         generate();
//       }, fail, fail, SUPPRESS_ERR_DLG);
//     };

//     if (closeDialogWhenGenerate)
//       this.closeViewInfoCollector();
//     generate();
//   },
//   closeViewInfoCollector: function () {
//     $('#vb-dataSource-viewInfoCollector').dialog({ closed: true });
//   },

//   // 编辑
//   // 当前编辑行index
//   editIndex: -1,
//   resetEditState: function () {
//     this.editIndex = -1;
//     $('#t-databaseObject-viewInfo').datagrid('clearSelections');
//   },
//   endEditing: function () {
//     var editor = vb.dataSource,
//       editIndex = editor.editIndex,
//       dg = $(this);
//     if (editIndex == -1) {
//       return true;
//     }
//     if (!dg.datagrid('validateRow', editIndex))
//       return false;
//     dg.datagrid('endEdit', editIndex);
//     editor.editIndex = -1;
//     return true;
//   },
//   onClickInfoCollectorCell: function (index, field, value) {
//     var editor = vb.dataSource,
//       editIndex = editor.editIndex,
//       dg = $(this),
//       row = dg.datagrid('getData').rows[index];
//     if (row._op != 'UPDATE' && editor.endEditing.call(this)) {
//       dg.datagrid('selectRow', index).datagrid('beginEdit', index);
//       editor.editIndex = index;
//     } else {
//       dg.datagrid('selectRow', editIndex);
//     }
//   }
// };

/**
 * 编辑关联关系
 */
vb.viewRefRelationEditor = {
  _viewRefRel: null,
  /**
   * 编辑关联关系
   * @param viewRefRel
   */
  edit: function (viewRefRel, availableButtons, allowClose) {
    console.info('editViewRefRelation :');
    console.info(viewRefRel);

    this._viewRefRel = viewRefRel;


    var srcViewRef = vb.findViewRef(viewRefRel.left),
      destViewRef = vb.findViewRef(viewRefRel.right);

    // 表达式去掉视图别名
    // var leftExpr = viewRefRel.exprConditional.leftExpr,
    //   rightExpr = viewRefRel.exprConditional.rightExpr;
    // if (leftExpr.substring(0, srcViewRef.viewAlias.length + 1) == srcViewRef.viewAlias + '.') {
    //   leftExpr = leftExpr.substring(srcViewRef.viewAlias.length + 1);
    // } else {
    //   console.info('无效的左表达式\'' + leftExpr + '\'，表别名与源表\'' + srcViewRef.viewAlias + '\'不一致');
    // }
    // if (rightExpr.substring(0, destViewRef.viewAlias.length + 1) == destViewRef.viewAlias + '.') {
    //   rightExpr = rightExpr.substring(destViewRef.viewAlias.length + 1);
    // } else {
    //   console.info('无效的右表达式\'' + rightExpr + '\'，表别名与目标表\'' + destViewRef.viewAlias + '\'不一致');
    // }

    // $('#viewRefRelLeftExpr').textbox('setValue', leftExpr);
    // $('#viewRefRelRightExpr').textbox('setValue', rightExpr);
    // $('#viewRefRelOper').combobox('setValue', viewRefRel.exprConditional.oper);
    // $('#viewRefRelAllSrcRows').attr('checked', viewRefRel.allSrcRows ? 'checked' : null);
    // $('#viewRefRelAllDestRows').attr('checked', viewRefRel.allDestRows ? 'checked' : null);

    var title = [
      '编辑连接 - ',
      srcViewRef.name,
      ' - ',
      destViewRef.name
    ].join('');

    var dlg = $('#viewRefRelEditor').show();
    dlg.find('.title').text(title);
    dlg.find('.list').eq(0).empty();

    this.show(viewRefRel);
    if (!availableButtons) {
      dlg.find('DIV.dialog-button>A').show();
    } else {
      var names = availableButtons.split(',');
      dlg.find('DIV.dialog-button>A').each(function () {
        var btn = $(this);
        if (-1 < names.indexOf($.trim(btn.text())))
          btn.show();
        else
          btn.hide();
      });
    }
  },
  addItem: function () {
    var viewRefRel = JSON.parse(JSON.stringify(this._viewRefRel));
    viewRefRel.columns = [{
      left: '',
      op: '=',
      right: ''
    }];
    this.show(viewRefRel);
  },
  show: function (rel) {
    var viewRefRel = rel;
    var srcViewRef = vb.findViewRef(viewRefRel.left),
      destViewRef = vb.findViewRef(viewRefRel.right);

    var data = {
      ops: [
        '=',
        '>=',
        '=<',
        '<>'
      ],
      srcViewRef: srcViewRef,
      destViewRef: destViewRef,
      viewRefRel: viewRefRel
    };
    renderTmp($('#viewRefRelEditor').find('.list').get(0), 'viewRefRelListTpl', data);
    $('select').select2({
      minimumResultsForSearch: -1 
    });
  },
  /**
   * 删除当前关系
   */
  remove: function () {
    var viewRefRel = this._viewRefRel;

    // 删除edge
    var diagram = vb.diagram,
      graph = diagram.getGraph(),
      viewRefRelCellId = diagram.getViewRefRelationCellId(viewRefRel.viewRelId),
      viewRefRelCell = graph.getModel().getCell(viewRefRelCellId);
    graph.getModel().beginUpdate();
    try {
      graph.removeCells([viewRefRelCell]);
    } finally {
      graph.getModel().endUpdate();
    }

    // 删除源数据
    for (var i = 0, j = vb._view.joins, k = j.length; i < k; ++i) {
      if (j[i].viewRelId == viewRefRel.viewRelId) {
        delete j[i];
        for (i = i; i < k - 1; ++i) {
          j[i] = j[i + 1];
        }
        --j.length;
        break;
      }
    }

    this.closeViewRefRelationEditor();
  },

  confirmEdit: function () {
    // var leftExpr = $.trim($('#viewRefRelLeftExpr').textbox('getValue')),
    //   rightExpr = $.trim($('#viewRefRelRightExpr').textbox('getValue')),
    //   oper = $('#viewRefRelOper').combobox('getValue'),
    //   allSrcRows = !!$('#viewRefRelAllSrcRows').attr('checked'),
    //   allDestRows = !!$('#viewRefRelAllDestRows').attr('checked');

    // TODO 验证

    var viewRefRel = this._viewRefRel,
      srcViewRef = vb.findViewRef(viewRefRel.srcViewRefId),
      destViewRef = vb.findViewRef(viewRefRel.destViewRefId);
    // viewRefRel.allSrcRows = allSrcRows;
    // viewRefRel.allDestRows = allDestRows;
    // viewRefRel.exprConditional.oper = oper;
    // viewRefRel.exprConditional.leftExpr = srcViewRef.viewAlias + '.' + leftExpr;
    // viewRefRel.exprConditional.rightExpr = destViewRef.viewAlias + '.' + rightExpr;

    var columns = [], error = 0,
      list = $('#viewRefRelEditor').find('.list>li');
    if(list.length){
      list.each(function (i, el) {
        var left = $(el).find('[name=left]'),
          leftType = left.find('option:selected').data('type'),
          leftName = left.val();
        var right = $(el).find('[name=right]'),
          rightType = right.find('option:selected').data('type'),
          rightName = right.val();
        var op = $(el).find('[name=op]').val();
        if (leftName && rightName) {
          // FIXME:字段验证，注释需要保留
          // if (leftType == rightType) {
          columns.push({
            left: leftName,
            right: rightName,
            op: op
          });
          // } else {
          //   error++;
          //   $(el).addClass('error');
          // }
        }
      });        
    }else{
      $('#viewRefRelEditor').find('.delete').trigger('click');
    }
    
    if (!error) {
      viewRefRel.columns = columns;
    } else {
      error = 0;
      return;
    }
    // FIXME:字段验证，以上注释需要保留
    console.info('modifiedViewRefRelation :');
    console.info(viewRefRel);

    // 更新edge
    // var diagram = vb.diagram,
    //   graph = diagram.getGraph(),
    //   viewRefRelCellId = diagram.getViewRefRelationCellId(viewRefRel.viewRelId),
    //   viewRefRelCell = graph.getModel().getCell(viewRefRelCellId),
    //   edgeStyles = vb.diagram.getRelationEdgeStyles(viewRefRel);
    // graph.getModel().beginUpdate();
    // try {
    //   viewRefRelCell.style = edgeStyles.edgeStyle;
    //   graph.refresh(viewRefRelCell);
    // } finally {
    //   graph.getModel().endUpdate();
    // }

    this.closeViewRefRelationEditor();
  },
  cancelEdit: function () {
    this.closeViewRefRelationEditor();
  },
  closeViewRefRelationEditor: function () {
    $('#viewRefRelEditor').hide();
  }
};

/**
 * 编辑子视图引用
 */
vb.viewRefEditor = {
  _viewRef: null,
  /**
	 * 编辑视图别名，选择输出列和别名
	 * @param viewRef
	 */
  edit: function (viewRef) {

    vb._filters=vb._view.filters.concat();
    vb._orders=vb._view.orders.concat();
    this.resetEditState();

    console.info('editViewRef :');
    console.info(viewRef);
    // 复制viewRef的数据，避免错误更新
    this._viewRef = JSON.parse(JSON.stringify(viewRef));

    $('#viewRefViewAlias').val(viewRef.alias);
    $('#viewRefViewAlias').attr('data-name',viewRef.name);
    // 提取columns渲染
    var data = {
      list: this._viewRef.columns
    };
    renderTmp('#t-viewRef', 'viewRefTpl', data);
    $('#t-viewRef input').trigger('change');
    // 刚进来初始化右侧
    if(data.list.length){
      for(var i=0;i<data.list.length;i++){
        if(data.list[i]['alias']){
          $('#viewRefEditor').find('.right').attr('data-idx',i).show();
          $('#viewRefEditor').find('.right .checkUse').prop('checked',true);
          $('#viewRefEditor').find('.right .text').val(data.list[i]['text']);
          $('#viewRefEditor').find('#t-viewRef li').eq(i).trigger('click');
          break;
        }else{
          $('#viewRefEditor').find('.right').attr('data-idx',i).hide();
          $('#viewRefEditor').find('.right .checkUse').prop('checked',false);
          $('#viewRefEditor').find('.right .text').val('');
        }
      }
    }
    $('#viewRefEditor').show().find('.title').text('编辑视图  - ' + this._viewRef.name + '(' + this._viewRef.alias + ')');
  




  },
  remove: function () {
    var viewRef = this._viewRef;

    // 删除edge
    var diagram = vb.diagram,
      graph = diagram.getGraph(),
      viewRefCellId = diagram.getViewRefCellId(viewRef.alias),
      viewRefCell = graph.getModel().getCell(viewRefCellId);
    graph.getModel().beginUpdate();
    try {
      graph.removeCells([viewRefCell]);
    } finally {
      graph.getModel().endUpdate();
    }

    // 删除源数据
    for (var i = 0, j = vb._view.joins, k = j.length; i < k; ++i) {
      if (j[i].left == viewRef.alias || j[i].right == viewRef.alias) {
        delete j[i];
        for (var a = i; a < k - 1; ++a) {
          j[a] = j[a + 1];
        }
        j.length = k = j.length - 1;
        continue;
      }
    }
    for (var i = 0, j = vb._view.tables, k = j.length; i < k; ++i) {
      if (j[i].alias == viewRef.alias) {
        delete j[i];
        for (var a = i; a < k - 1; ++a) {
          j[a] = j[a + 1];
        }
        --j.length;
        break;
      }
    }

    this.closeViewRefEditor();
  },
  closeViewRefEditor: function () {
    $('#viewRefEditor').hide();
  },
  cancelEdit: function () {
    this.closeViewRefEditor();
  },
  confirmEdit: function () {
    var viewRef = vb.viewRefEditor._viewRef;
    // 验证
    // 验证别名
    var viewAlias = $.trim($('#viewRefViewAlias').val()),
      // isSubQuery = !!$('#viewRefIsSubQuery').attr('checked'),
      oldViewAlias = viewRef.viewAlias;
    if (!viewAlias)
      return console.errer('未能生成视图别名');
    // var dupViewRef = vb._view.tables.first(function () {
    //   return viewRef.viewRefId != this.viewRefId && viewAlias.toUpperCase() == $.trim(this.viewAlias.toUpperCase());
    // });
    // if (dupViewRef) {
    //   qutils.focusOnInput($('#viewRefViewAlias'));
    //   return alert('视图别名不能与其他视图重复');
    // }

    // 验证列,生成别名
    var grid = $('#t-viewRef');
    // gridHelper.applyEdit(grid);
    // var cols = grid.datagrid('getData'),
    //   colNameMap = {};
    // for (var i = 0; i < cols.total; ++i) {
    //   if (!grid.datagrid('validateRow', i)) {
    //     return alert('结果列的别名和显示名必须填写');
    //   }
    //   var col = cols.rows[i];
    //   if (colNameMap[col._parentColName]) {
    //     return alert('列的别名\'' + col._parentColName + '\'存在重复');
    //   }
    //   colNameMap[col._parentColName] = col;
    // }

    // 更新数据
    // viewRef.viewAlias = viewAlias;
    // viewRef.isSubQuery = isSubQuery;
    var cols = [];
    grid.find('li').each(function (i, el) {
      var data = $(el).data(),
        checked = $(el).find('input[type=checkbox]').prop('checked'),
        text=data.list.text;
      if (checked) {
        if(!text){
          alert('请填写'+data.name+'的备注名称');
          return false;
        }else{
          viewRef.columns[i]['text']=text;
        }
        if (!viewRef.columns[i].alias) {
          viewRef.columns[i].alias = viewRef.name + '_' + viewRef.columns[i].name;
        }
      } else {
        delete viewRef.columns[i].alias;
        delete viewRef.columns[i].text;
      }
    });

    // 复制筛选和排序

    vb._view['filters']=vb._filters;
    vb._view['orders']=vb._orders;


    // // 更新columnMaps和columns，如果有重名的话提示修改
    // // 将可用的columnMap和column加入vb._view
    // var viewColIdsToExclude = {}, // 临时用于过滤掉当前子视图的输出列
    //   otherViewColumnMapByName = {}, // 记录其他视图的列映射，用于检查列别名是否重复
    //   // 临时保存结果列映射，将当前子视图的输出列附加到结尾
    //   viewColMaps = [].concat(vb._view.columnMaps).filter(function (item) {
    //     if (item.subViewRefId != viewRef.viewRefId) {
    //       var otherViewRef = vb.findViewRef(item.subViewRefId);
    //       otherViewColumnMapByName[item.parentCol.colName.toUpperCase()] = { viewRef: otherViewRef, columnMap: item };
    //       return true;
    //     } else {
    //       viewColIdsToExclude[item.parentColId] = 1;
    //       return false;
    //     }
    //   }),
    //   // 临时保存结果列，将当前子视图的输出列附加到结尾
    //   viewCols = [].concat(vb._view.columns).filter(function (item) {
    //     return !viewColIdsToExclude[item.colId];
    //   });
    // var dupColumnMaps = [];
    // $.each(cols.rows, function () {
    //   if (this._output) {
    //     viewCols.push(this.parentCol);
    //     viewColMaps.push(this);
    //     var otherViewColMap = otherViewColumnMapByName[this.parentCol.colName.toUpperCase()];
    //     if (otherViewColMap) {
    //       var dupViewRef = vb.findViewRef(this.subViewRefId);
    //       dupColumnMaps.push(this.parentCol.dispName + '(' + this.parentCol.colName + ') 与视图'
    //         + otherViewColMap.viewRef.view.dispName + '(' + otherViewColMap.viewRef.viewAlias + ')的列'
    //         + otherViewColMap.columnMap.parentCol.dispName + '(' + otherViewColMap.columnMap.parentCol.colName + ')重名');
    //     }
    //   }
    // });
    // if (dupColumnMaps.length) {
    //   return alert('以下列的别名与其他视图重复：\n' + dupColumnMaps.join('\n'));
    // }
    // 合并columnMaps和columns
    // viewColMaps = viewColMaps.concat(cols.rows.filter(function () { return this._output; }));
    // viewCols = viewCols.concat(cols.rows.filter(function () { return this._output; }).collect(function () { return this.parentCol; }));
    // vb._view.columnMaps = viewColMaps;
    // vb._view.columns = viewCols;

    // 更新所有引用该视图的viewRefRelation的表达式的表别名
    // var updateExprAlias = function (expr, exprPropName, oldAlias, newAlias) {
    //   var ex = expr[exprPropName];
    //   if (ex && ex.substring(0, oldAlias.length + 1).toUpperCase() == (oldAlias + '.').toUpperCase()) {
    //     ex = newAlias + '.' + ex.substring(oldAlias.length + 1);
    //   } else {
    //     throw new Error('表达式错误，视图别名未找到，表达式：' + ex + '，正确的别名：' + oldAlias);
    //   }
    //   expr[exprPropName] = ex;
    // };
    // $.each(vb._view.viewRefRelations, function () {
    //   if (this.srcViewRefId == viewRef.viewRefId) {
    //     updateExprAlias(this.exprConditional, 'leftExpr', oldViewAlias, viewRef.viewAlias);
    //   } else if (this.destViewRefId == viewRef.viewRefId) {
    //     updateExprAlias(this.exprConditional, 'rightExpr', oldViewAlias, viewRef.viewAlias);
    //   }
    // });

    // 将复制的viewRef的数据附加到原对象上
    for (var i = 0, j = vb._view.tables; i < j.length; ++i) {
      if (j[i].alias == viewRef.alias) {
        j[i] = viewRef;
        break;
      }
    }
    // 刷新diagram
    vb.diagram.updateViewRef(viewRef);
    this.closeViewRefEditor();
  },

  // 编辑
  // 当前编辑行index
  editIndex: -1,
  resetEditState: function () {
    this.editIndex = -1;
    $('#t-viewRef').empty();
  },
  endEditing: function () {
    var editor = vb.viewRefEditor,
      editIndex = editor.editIndex,
      dg = $(this);
    if (editIndex == -1) {
      return true;
    }
    if (!dg.datagrid('validateRow', editIndex))
      return false;
    dg.datagrid('endEdit', editIndex);
    editor.editIndex = -1;
    return true;
  },
  onClickCell: function (index, field, value) {
    var editor = vb.viewRefEditor,
      editIndex = editor.editIndex,
      dg = $(this);
    if (editor.endEditing.call(this)) {
      dg.datagrid('selectRow', index).datagrid('beginEdit', index);
      editor.editIndex = index;
    } else {
      dg.datagrid('selectRow', editIndex);
    }
  }
};

/**
 * 关系图
 */
vb.diagram = {
  /**
   * 在目标容器内显示视图
   */
  show: function (view, container) {
    var g = window.g = this.getGraph(container),
      root = g.getDefaultParent(),
      model = g.getModel();

    model.beginUpdate();
    try {
      // 添加表
      $.each(view.tables || [], function () {
        var viewRef = this,
          viewRefCell = vb.diagram.getViewRefCell(viewRef);
        g.addCell(viewRefCell);

        // 视图编辑按钮
        // FIXME mxCellOverlay.tooltip无效
        var overlay = new mxCellOverlay(new mxImage('images/iconPencilSmall.png', 24, 24), '编辑视图', 'right', 'top', new mxPoint(-235, 16), 'default');
        overlay.addListener(mxEvent.CLICK, function (sender, evt) {
          // 从cell中获取最新的值
          vb.viewRefEditor.edit(viewRefCell.getValue().viewRef);
        });
        g.addCellOverlay(viewRefCell, overlay);
      });
      // 添加关联关系
      $.each(view.joins || [], function () {
        var srcViewRef = vb.findViewRef(this['left']),
          destViewRef = vb.findViewRef(this['right']),
          edgeStyles = vb.diagram.getRelationEdgeStyles(this);
        var srcViewCellId = vb.diagram.getViewRefCellId(srcViewRef.alias),
          destViewCellId = vb.diagram.getViewRefCellId(destViewRef.alias);
        var srcVertex = model.getCell(srcViewCellId),
          destVertex = model.getCell(destViewCellId);
        var edge = g.insertEdge(root, null, new ViewRefRelation(this), srcVertex, destVertex, edgeStyles.edgeStyle);

      });
    } finally {
      model.endUpdate();
    }

    this.doAutoLayout(false);
  },
  /**
   * 获取refRelation的连接类型和edge样式
   */
  getRelationEdgeStyles: function (refRel) {
    var joinType, startArrow = 'none', endArrow = 'none', multiArrowStyle = mxConstants.ARROW_DIAMOND_THIN;
    // if (refRel['allSrcRows'] && refRel['allDestRows']) {
    //   startArrow = endArrow = multiArrowStyle;
    // } else if (refRel['allSrcRows']) {
    //   startArrow = multiArrowStyle;
    // } else if (refRel['allDestRows']) {
    //   endArrow = multiArrowStyle;
    // } else {
    // }
    // // 如果viewRef是子查询，则标记端点为圆点
    // var srcViewRef = vb.findViewRef(refRel.srcViewRefId),
    //   destViewRef = vb.findViewRef(refRel.destViewRefId);
    // if (srcViewRef && srcViewRef.isSubQuery)
    //   startArrow = mxConstants.ARROW_OVAL;
    // if (destViewRef && destViewRef.isSubQuery)
    //   endArrow = mxConstants.ARROW_OVAL;
    if (refRel.type == 'INNER') {
      startArrow = mxConstants.ARROW_OVAL;
      endArrow = mxConstants.ARROW_OVAL;
    }
    var edgeStyle = 'startArrow=' + startArrow + ';endArrow=' + endArrow;
    var oper = '(双击编辑)';
    joinType = oper; // 使用操作符替代join标识

    return { joinType: joinType, edgeStyle: edgeStyle };
  },

  /**
   * 添加视图
   */
  addView: function (view) {
    console.info('diagram.addView :');
    console.info(view);

    // 生成viewRef
    // vb.registerView(view);

    // 添加TYPE标记，将数据加入到rootView
    var viewRef = this.newViewRef(view.metadata);
    if (vb.registerViewRef(viewRef)) {
      // TODO: 生成列映射关系


      // $.each(view.columns, function () {
      //   this.TYPE = 'COLUMN';
      //   vb._view.subViewColumns.push(this);
      // });

      var viewRefCell = this.getViewRefCell(viewRef);
      var g = this.getGraph(),
        model = g.getModel();
      model.beginUpdate();
      try {
        g.addCell(viewRefCell);
      } finally {
        model.endUpdate();
      }
    }


  },
  newViewRef: function (view) {
    // 生成关系数据
    var viewRefId = vb.newId('viewRefId'),
      reservedAliases = vb._view.tables.collect(function () { return this.viewAlias; }),
      viewAlias = view.name;
    var viewRef = {
      TYPE: 'REFERENCE',
      name: view.name,
      columns: view.columns,
      alias: viewAlias

    };
    vb._view.tables.push(viewRef);
    return viewRef;
  },
  /**
   * 生成别名，避开保留名称
   */
  getAliasFromName: function (name, reservedNames) {
    var abbr = null;
    var reservedMap = (reservedNames || []).toMap(function () { return 1; });

    // 尝试将名称分段，提取首字母做缩写
    if (name.indexOf('_') != -1) {
      var n = [];
      for (var i = 0, j = name.split('_'), k; i < j.length; ++i) {
        k = $.trim(j[i]);
        if (k)
          n.push(k.charAt(0).toUpperCase());
      }
      if (n.length > 1)
        abbr = n.join('').toUpperCase();
    }
    // 如果名称大小写混合，则提取所有可能的单词首字母，不考虑Locale造成的区别
    if (!abbr && name.toUpperCase() != name.toLowerCase()) {
      var n = name.replace(/[^A-Z0-9]/g, '');
      if (name.charAt(0) >= 'a' && name.charAt(0) <= 'Z') {
        n = name.charAt(0).toUpperCase() + n;
      }
      if (n.length > 1)
        abbr = n;
    }
    // 截取名称前4个字符
    if (!abbr) {
      abbr = name.substring(0, 4).toUpperCase();
    }
    // 如果名称在保留名称范围内，则添加序号
    if (reservedMap[abbr]) {
      var i = 0, _abbr = abbr;
      while (reservedMap[abbr = _abbr + (++i)]);
    }
    if (abbr.length > 30) {
      alert('没有可用的别名');
      throw new Error('没有可用的别名');
    }
    return abbr;
  },

  getViewRefCell: function (viewRef) {
    // 列映射
    var colMappings = viewRef['columns'],
      w = 250,
      h = 35 + colMappings.length * 30;

    // 视图
    var viewRefObj = new ViewRef(viewRef),
      viewRefCell = new mxCell(viewRefObj, new mxGeometry(0, 0, w, h), 'VIEW_STYLE');
    viewRefCell.setVertex(true);

    // 添加列映射cell
    $.each(colMappings, function (index) {
      var y = index * 30 + 35,
        columnMappingObj = new ColumnMapping(this),
        columnMappingCell = new mxCell(columnMappingObj, new mxGeometry(0, y, w, 30), 'COLUMN_STYLE');
      columnMappingCell.setVertex(true);
      columnMappingCell.setConnectable(true);
      viewRefCell.insert(columnMappingCell);
    });

    return viewRefCell;
  },

  /**
   * 更新viewRefCell
   */
  updateViewRef: function (viewRef) {
    var graph = this.getGraph(),
      viewRefCellId = this.getViewRefCellId(viewRef.alias),
      viewRefCell = graph.getModel().getCell(viewRefCellId);

    console.info('updateViewRef :');
    console.info(viewRef);
    console.info('viewRefCell :');
    console.info(viewRefCell);

    graph.getModel().beginUpdate();
    try {
      viewRefCell.value.viewRef = viewRef;
      for (var i = 0, j = viewRef.columns; i < j.length; ++i) {
        var colCell = viewRefCell.children[i],
          colMapping = j[i];
        colCell.value.columnMapping = colMapping;
        graph.refresh(colCell);
      }
      graph.refresh(viewRefCell);
    } finally {
      graph.getModel().endUpdate();
    }
  },

  _graph: null, // mxGraph instance
  getGraph: function (container) {
    if (!this._graph) {
      // Checks if the browser is supported
      if (!mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is not supported.
        mxUtils.error('Browser is not supported!', 200, false);
      } else {
        // Disables the built-in context menu
        mxEvent.disableContextMenu(container);

        // TEST
        // mxMarker.addMarker('dash', function (canvas, shape, type, pe, unitX, unitY, size, source, sw, filled) {
        //   var nx = unitX * (size + sw);
        //   var ny = unitY * (size + sw);

        //   return function () {
        //     canvas.begin();
        //     canvas.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
        //     canvas.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2);
        //     canvas.stroke();
        //   };
        // });

        // Creates the graph inside the given container
        var g = new mxGraph(container);
        g.setHtmlLabels(false);
        g.getLabel = vb.diagram._getLabel;
        g.isHtmlLabel = vb.diagram._isHtmlLabel;
        g.isCellMovable = vb.diagram._isCellMovable;
        g.isCellEditable = vb.diagram._isCellEditable;
        g.isCellResizable = vb.diagram._isCellResizable;
        // g.isCellLocked = vb.diagram._isCellLocked;

        // cell连接控制
        g.setConnectable(true);
        mxConnectionHandler.prototype.connectImage = new mxImage('images/iconConnector.png', 24, 24);
        mxConnectionHandler.prototype.connectIconOffset = new mxPoint(0, mxConstants.TOOLTIP_VERTICAL_OFFSET);
        mxConnectionHandler.prototype.isConnectableCell = function (cell) {
          // 只能在表之间连接
          return cell && cell.value && cell.value.type == 'VIEWREF';
        };
        mxConnectionHandler.prototype.getIconPosition = function (imageShape, cellStatus) {
          // 连接图标右居顶
          var px = cellStatus.shape.style[mxConstants.STYLE_SPACING_RIGHT] || 0;
          var w = imageShape.bounds.width, h = imageShape.bounds.height;
          var x = cellStatus.origin.x + cellStatus.cellBounds.width - w - px,
            y = 0;
          y = cellStatus.origin.y + 5;
          return new mxPoint(x, y);
        };

        mxConnectionHandler.prototype._connect = mxConnectionHandler.prototype.connect;
        mxConnectionHandler.prototype.connect = function (source, target, c, d) {
          if (!target) // 如果没有拖动到cell上则取消
            return;
          // 检查目标cell和源cell之间是否已经有连接，如果有则取消
          if (source.edges && target.edges) {
            var dupEdge = (function () {
              var obj = null;
              for (var i = 0; i < source.edges.length; i++) {
                for (var j = 0; j < target.edges.length; j++) {
                  if (source.edges[i].id == target.edges[j].id) {
                    obj = target.edges[j];
                  }
                }
              }
              return obj;
            })();
            if (dupEdge) {
              console.info('已经建立连接，edgeId = ' + dupEdge.id);
              return;
            }

          }
          return this._connect.apply(this, arguments);
        };
        mxConnectionHandler.prototype._insertEdge = mxConnectionHandler.prototype.insertEdge;
        mxConnectionHandler.prototype.insertEdge = function (a, b, c, source, target, f) {
          // 默认添加内连接，编辑时可选连接方式或删除
          // 新建连接根据连接类型调整样式
          // 添加refRelation数据
          var srcViewRef = source.value.viewRef,
            destViewRef = target.value.viewRef;
          // var refRel = {
          //   TYPE: 'RELATION',
          //   viewRelId: vb.newId('viewRelId'),
          //   parentViewId: vb._view.viewId, //TODO:hotjp viewId不存在的
          //   srcViewRefId: srcViewRef.name,
          //   destViewRefId: destViewRef.name,
          //   allSrcRows: false,
          //   allDestRows: false,
          //   exprId: null,
          //   exprConditional: {
          //     exprId: null,
          //     exprConj: 'AND',
          //     oper: '=',
          //     parentExprId: null,
          //     leftExpr: srcViewRef.name,
          //     rightExpr: destViewRef.name,
          //     exprConditionals: []
          //   }
          // };
          // 新数据
          // var refRel = {
          //   left: 't_1',
          //   right: 't_2',
          //   type: 'INNER',
          //   columns: [
          //     {
          //       left: 'job_id',
          //       right: 'job_id',
          //       op: '='
          //     }
          //   ]
          // };          
          var refRel = {
            viewRelId: vb.newId('viewRelId'),
            left: srcViewRef.alias,
            right: destViewRef.alias,
            type: 'INNER',
            columns: [
            ]
          };
          vb._view.joins.push(refRel);
          vb._viewRefRelationMap[refRel.viewRelId] = refRel;

          var edge = this._insertEdge.apply(this, arguments),
            edgeStyles = vb.diagram.getRelationEdgeStyles(refRel);
          edge.value = new ViewRefRelation(refRel);
          edge.style = edgeStyles.edgeStyle;
          // 重新setId以触发cell登记
          edge.setId(edge.getId());
          // 打开编辑
          vb.viewRefRelationEditor.edit(refRel, '确定,删除', false);
          return edge;
        };

        g.addListener(mxEvent.REMOVE_CELLS, function (sender, evt) {
          var cells = evt.getProperty('cell') || [];
          if (cells.length) {
            $.each(cells, function () {
              vb.diagram.unregisterCell(this);
            });
          }
        });

        g.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
          var cell = evt.getProperty('cell');
          if (cell) {
            if (cell.isEdge() && cell.value && cell.value.type == 'RELATION') {
              // 编辑关系
              vb.viewRefRelationEditor.edit(cell.value.viewRefRelation);
            } else if (cell.isVertex() && cell.value && cell.value.type == 'VIEWREF') {
              // 编辑view
              vb.viewRefEditor.edit(cell.value.viewRef);
            }
            evt.consume();
          }
        });

        mxConstants.RECTANGLE_ROUNDING_FACTOR = 0.05;

        // Changes the default vertex style in-place
        var style = g.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_PERIMETER_SPACING] = 0;
        style[mxConstants.STYLE_STROKECOLOR] = '#bbb';
        style[mxConstants.STYLE_ROUNDED] = false;
        style[mxConstants.STYLE_FOLDABLE] = false;

        var edgeStyle = g.stylesheet.getDefaultEdgeStyle();
        edgeStyle[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'transparent';
        edgeStyle[mxConstants.STYLE_STROKEWIDTH] = 2;
        edgeStyle[mxConstants.STYLE_ROUNDED] = true;
        edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;

        var colStyle = {};
        colStyle[mxConstants.STYLE_STROKEWIDTH] = 0;
        colStyle[mxConstants.STYLE_FONTCOLOR] = '#8e8eaf';
        colStyle[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
        colStyle[mxConstants.STYLE_ALIGN] = 'left';
        colStyle[mxConstants.STYLE_SPACING_LEFT] = 2;
        colStyle[mxConstants.STYLE_SPACING_RIGHT] = 2;
        g.getStylesheet().putCellStyle('COLUMN_STYLE', colStyle);

        var viewStyle = {};
        viewStyle[mxConstants.STYLE_STROKEWIDTH] = 0;
        viewStyle[mxConstants.STYLE_FONTCOLOR] = '#000000';
        viewStyle[mxConstants.STYLE_FILLCOLOR] = '#f0f2f5';
        viewStyle[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
        viewStyle[mxConstants.STYLE_SPACING_TOP] = 8;
        g.getStylesheet().putCellStyle('VIEW_STYLE', viewStyle);

        style = g.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_ROUNDED] = true;

        // 连接点，尽量从相近的边界连接单元格
        // var getConnectionConstraint = g.getConnectionConstraint;
        // g.getConnectionConstraint = function (edgeState, vertexState, c) {
        //   var cc = getConnectionConstraint.apply(this, arguments);
        //   if (!cc.point) {
        //     var sourceViewGeo = edgeState.cell.source.parent.getGeometry(),
        //       targetViewGeo = edgeState.cell.target.parent.getGeometry();
        //     var sourceX = 0, targetX = 0;
        //     if (sourceViewGeo.x + sourceViewGeo.width / 2 <= targetViewGeo.x) {
        //       sourceX = 1;
        //     } else if (targetViewGeo.x + targetViewGeo.width / 2 <= sourceViewGeo.x) {
        //       targetX = 1;
        //     }
        //     if (edgeState.cell.source == vertexState.cell) {
        //       cc.point = new mxPoint(sourceX, 0.5);
        //     } else if (edgeState.cell.target == vertexState.cell) {
        //       cc.point = new mxPoint(targetX, 0.5);
        //     }
        //   }
        //   return cc;
        // };

        // Enables rubberband selection
        new mxRubberband(g);
        this._graph = g;
      }
    }
    return this._graph;
  },

  /**
	 * 自动布局
	 */
  doAutoLayout: function (animated) {
    var g = this.getGraph();
    g.getModel().beginUpdate();
    try {
      var layout = new mxStackLayout(g, true, 70, 20, 20);
      layout.execute(g.getDefaultParent());
    } finally {
      if (animated) {
        var morph = new mxMorphing(g);
        morph.addListener(mxEvent.DONE, function () {
          g.getModel().endUpdate();
        });
        morph.startAnimation();
      } else {
        g.getModel().endUpdate();
      }
    }
  },

  // 记录cellId
  _viewRefCellIdMap: {},
  _viewColumnMapCellIdMap: {},
  _viewRefRelationCellIdMap: {},
  /**
   * 显示cell的同时注册cellId，便于查找
   * @param {mxCell} cell 要注册的cell，此时cell必须已经生成id
   * @param {Boolean} removeReg 取消注册
   */
  registerCell: function (cell, removeReg) {
    var id = removeReg ? null : cell.getId();
    if (removeReg && (typeof id == 'undefined' || id === null))
      throw new Error('cell无id');
    if (cell.value) {
      if (cell.value.type == 'VIEWREF') {
        this._viewRefCellIdMap[cell.value.viewRef.alias] = id;
      } else if (cell.value.type == 'COLUMN_MAPPING') {
        this._viewColumnMapCellIdMap[cell.value.columnMapping.name] = id;
      } else if (cell.value.type == 'RELATION') {
        this._viewRefRelationCellIdMap[cell.value.viewRefRelation.viewRelId] = id;
      }
    }
  },
  /**
   * 取消cell注册
   */
  unregisterCell: function (cell) {
    this.registerCell(cell, true);
  },
  getViewRefCellId: function (viewRefId) {
    return this._viewRefCellIdMap[viewRefId];
  },
  getViewColumnMapCellId: function (columnMapId) {
    return this._viewColumnMapCellIdMap[columnMapId];
  },
  getViewRefRelationCellId: function (viewRelId) {
    return this._viewRefRelationCellIdMap[viewRelId];
  },


  /* graph功能函数 */
  _isCellLocked: function (cell) {
    if (cell.value && cell.value.type == 'COLUMN_MAPPING')
      return true;
    return false;
  },
  _isCellEditable: function (cell) {
    return false;
  },
  _isCellResizable: function (cell) {
    return false;
  },
  _isCellMovable: function (cell) {
    if (cell.value && cell.value.isFixed)
      return false;
    else if (cell.isEdge())
      return false;
    return true;
  },
  _isHtmlLabel: function (cell) {
    return true;
    //    return cell.value && cell.value["TYPE"] == "COLUMN_MAPPING";
  },
  _getLabel: function (cell) {

    var label;
    if (typeof cell.value != 'string' && cell.value) {
      switch (cell.value.type) {
      case 'VIEWREF':
        label = vb.diagram._getViewRefLabel(cell.value.viewRef);
        break;
      case 'COLUMN_MAPPING':
        label = vb.diagram._getColumnMappingLabel(cell.value.columnMapping);
        break;
      case 'RELATION':
        label = vb.diagram._getViewRefRelationLabel(cell.value.viewRefRelation);
        break;
      default:
        label = cell.value.name || cell.value;
        break;
      }
    } else {
      label = cell.value;
    }
    return label;
  },

  _getViewRefRelationLabel: function (viewRefRel) {
    return '<img src=\'images/link.png\' style=\'width:24px;height:24px;\'/>';
  },
  _getViewRefLabel: function (viewRef) {
    // return viewRef.name + ' -> ' + (viewRef.alias ? viewRef.alias : '');
    return viewRef.name;
  },
  _getColumnMappingLabel: function (columnMapping) {
    var label = [];
    if (columnMapping['alias']) {
      label.push('<img src=\'images/iconCheckSmall.png\' style=\'width:16px;height:16px;vertical-align: middle;\'/> ');
    } else {
      label.push('<img src=\'images/transparent.gif\' style=\'width:16px;height:16px;vertical-align: middle;\'/> ');
    }
    if(columnMapping['javaType']=='Number'){
      label.push('<img src=\'images/num_icon.png\' style=\'width:14px;height:16px;vertical-align: middle;\'/>  ');
    }else if(columnMapping['javaType']=='String'){
      label.push('<img src=\'images/text_icon.png\' style=\'width:14px;height:16px;vertical-align: middle;\'/>  ');
    }else if(columnMapping['javaType']=='Date'){
      label.push('<img src=\'images/data_icon.png\' style=\'width:14px;height:16px;vertical-align: middle;\'/>  ');
    }
    if(columnMapping['text']){
      label.push(columnMapping['text']);
    }
    // label.push('<i style="color:#333">' + columnMapping['javaType'] + '</i>  ');
    label.push('('+columnMapping.name+')');
    // label.push('<span class=\'small-note\'> (');
    // label.push(columnMapping.alias);
    // label.push(')</span>');

    return label.join('');
  }
};

function getUrl(url,option) {
  var paraStr, paras;
  if (url) {
    paraStr = (function(url){
      if(url.indexOf('#') > 0){
        url = url.split('#')[0];
      }
      return url.split('?')[1];
    })(url);
    if (paraStr) {
      paras = {};
      paraStr = paraStr.split('&');
      for (var n = 0; n < paraStr.length; n++) {
        var name = paraStr[n].split('=')[0];
        var value = paraStr[n].split('=')[1];
        paras[name] = value;
      }
    } else {
      return {};
    }
    if (!option) {
      return paras;
    } else {
      return paras[option] ? paras[option] : '';
    }
  }
}


function ViewRef(viewRef) {
  this.type = 'VIEWREF';
  this.viewRef = viewRef;
}

function ColumnMapping(colMapping) {
  this.type = 'COLUMN_MAPPING';
  this.columnMapping = colMapping;
  this.isFixed = true;
}

function ViewRefRelation(viewRefRel) {
  this.type = 'RELATION';
  this.viewRefRelation = viewRefRel;
}



// 修改mxCell，在setId时登记到vb.diagram，便于根据数据查找cellId
mxCell.prototype._setId = mxCell.prototype.setId;
mxCell.prototype.setId = function (id) {
  this._setId(id);
  // 映射对象到id
  vb.diagram.registerCell(this);
};




