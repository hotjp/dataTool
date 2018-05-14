export default {
  bar3D: {
    type: 'bar3D',
    name: '3D柱状图',
    rules: [
      {
        columns: {
          rule: '==',
          num: 2,
          text: '2个'
        },
        values: {
          rule: '==',
          num: 1,
          text: '1个'
        }
      }
    ]
  }
};