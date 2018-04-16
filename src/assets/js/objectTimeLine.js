/**
 * 自动保存对象历史的工具类
 * 0.0.2
 */
import merge from 'lodash/merge';
import debounce from 'lodash/debounce';

export default class TimeLine {
  initBackup() {
    var that = this;
    this.backupTimer = setTimeout(function () {
      that.setBackup();
    }, this.options.backupOpt.backupInterval);
  }
  setBackup(isInit) {
    const opt = this.options;
    let key = opt.backupOpt.name ? opt.backupOpt.name : 'backup';
    if (isInit) {
      // TODO: 让用户判断是否恢复数据

      // 删除旧数据
      localStorage.removeItem(key);
      key += 'Init';
    }
    let name = key,
      item = this.timeLine[this.timeLine.length - 1];
    if (isInit) {
      opt.backupOpt._initKey = name;
    } else {
      opt.backupOpt._backupKey = name;
    }
    if ('function' == typeof opt.backupOpt.setBackupAction) {
      opt.backupOpt.backupAction(name, item);
    } else {
      localStorage.setItem(name, JSON.stringify(item));
    }
    this.initBackup();
    opt.backupOpt.backupCallback();
  }
  getBackup(isInit) {
    const opt = this.options;
    const name = isInit ? opt.backupOpt._initKey : opt.backupOpt._backupKey;
    if ('function' == typeof opt.backupOpt.getBackupAction) {
      opt.backupOpt.backupAction(name);
    } else {
      return localStorage.getItem(name);
    }
  }
  isSame(oldObj, newObj) {
    if (JSON.stringify(oldObj) === JSON.stringify(newObj)) {
      return true;
    }
    return false;
  }

  snapshootAct(obj) {
    // 去重
    if (this.options.timeLineOpt.uniq && this.isSame(this.timeLine[this.timeLine.length - 1], obj)) {
      return;
    }
    // 去空值
    if(JSON.stringify(obj) === '{}'){
      return;
    }
    
    // 长度控制
    if (this.timeLine.length == this.options.timeLineOpt.maxLength) {
      this.timeLine.shift();
    }
    // 增加
    console.warn('增加记录');
    this.timeLine.push(merge({}, obj));
    // 初始状态
    if(!this.inited){
      this.inited = !this.inited;
      this.setBackup(true);
    }
  }
  constructor(opt) {
    makeTimeLine.call(this, opt);
  }
}
function noop() { }
function makeTimeLine(opt) {
  this.options = {};
  this.timeLine = [merge({}, opt.treasures)];
  options._treasures = opt.treasures;
  this.options = merge({}, options, opt);
  this.options._initTime = +new Date();
  
  if (this.options.backupOpt.autoBackup) {
    this.clearBackup = function () {
      localStorage.removeItem(this.options.backupOpt._initKey);
      localStorage.removeItem(this.options.backupOpt._backupKey);
    };
    this.initBackup();
  }
  this.snapshoot = debounce(this.snapshootAct, this.options.timeLineOpt.debounceInterval,true);
}
const options = {
  // 是否初始化完成（保存初始化后的初值）
  inited:false,
  // 实例时间
  _initTime: 0,
  // 来源对象,请勿传参
  _treasures: null,
  // 时间线
  timeLineOpt: {
    // 历史记录最大值
    maxLength: 10,
    // 历史记录保存防抖间隔
    debounceInterval: 5*1e2,
    // 是否去重
    uniq: true
  },
  // 自动备份，默认保存在storage里，用的时候记得合并进正常数据避免丢失原型
  backupOpt: {
    // 初始值name
    _initKey: '',
    // 最新值name
    _backupKey: '',
    // 没有自定义则由’backup'命名
    name: '',
    // 是否自动备份
    autoBackup: true,
    // 自动备份间隔
    backupInterval: 5 * 60 * 1e3,
    // backupInterval: 5 * 60,
    // 备份行为有则发送深拷贝的对象,没有则丢进locastorage
    setBackupAction: null,
    getBackupAction: null,
    // 备份回调，默认不输出信息
    backupCallback: noop
  },
  // 备份对象的初值
  treasures: null
};
