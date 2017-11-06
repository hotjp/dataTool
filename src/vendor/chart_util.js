import { assign as Assign } from 'lodash';
export default {
  option: {
    color: ['#000', '#333', '#666'],
    toolbox: {},
    // 选择区域
    brush: {
      toolbox: ['rect', 'clear'],
      brushStyle: {
        borderWidth: 1,
        color: 'rgba(0,0,0,0.3)',
        borderColor: 'rgba(0,0,0,0.5)'
      },
      // 停止后再执行
      throttleType: 'debounce',
      // 是否多选
      brushMode: 'multiple',
      // 是否允许平移
      transformable: false,
      inBrush: {
        colorAlpha: 1
      },
      outOfBrush: {
        colorAlpha: 0.5
      }
    }
  },
  extendOption(data, style = {}) {
    return Assign(this.option, data, style);
  }


};