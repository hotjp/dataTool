export default {
  bar: {
    allowUse:false,
    type: 'bar',
    name: '柱状图',
    rules: [
      {
        columns: {
          rule: '<=',
          num: 2,
          text: '2个以下'
        },
        values: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        }
      }
    ]
  },
  line: {
    allowUse:false,
    type: 'line',
    name: '折线图',
    rules: [
      {
        columns: {
          rule: '==',
          num: 1,
          text: '1个'
        },
        values: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        }
      },
      {
        columns: {
          rule: '==',
          num: 2,
          text: '2个'
        },
        values: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        }
      }
    ]
  },
  area: {
    allowUse:false,
    type: 'line',
    name: '面积图',
    rules: [
      {
        columns: {
          rule: '==',
          num: 1,
          text: '1个'
        },
        values: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        }
      },
      {
        columns: {
          rule: '==',
          num: 2,
          text: '2个'
        },
        values: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        }
      }
    ]
  },
  pie: {
    allowUse:false,
    type: 'pie',
    name: '饼图',
    rules: [
      {
        columns: {
          rule: '==',
          num: 1,
          text: '1个'
        },
        values: {
          rule: '==',
          num: 1,
          text: '1个'
        }
      },
      {
        columns: {
          rule: '==',
          num: 0,
          text: '0个'
        },
        values: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        }
      }
    ]
  },
  table: {
    allowUse:false,
    type: 'table',
    name: '报表',
    rules: [
      {
        columns: {
          rule: '==',
          num: 'any',
          text: '不限'
        },
        values: {
          rule: '==',
          num: 'any',
          text: '不限'
        }
      }
    ]
  }
};