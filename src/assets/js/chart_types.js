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
    ],
    sort:10,
    weight:20
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
    ],
    sort:9,
    weight:1
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
    ],
    sort:8,
    weight:2
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
    ],
    sort:7,
    weight:3
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
    ],
    sort:6,
    weight:-1
  },
  stackbar: {
    allowUse:false,
    type: 'bar',
    name: '堆叠柱状图',
    rules: [
      {
        columns: {
          rule: '==',
          num: 1,
          text: '1个'
        },
        values: {
          rule: '>=',
          num: 2,
          text: '2个以上'
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
          num: 2,
          text: '2个以上'
        }
      }
    ],
    sort:5,
    weight:0
  },
  funnel: {
    allowUse:false,
    type: 'funnel',
    name: '漏斗图',
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
          num: 2,
          text: '2个以上'
        }
      }
    ],
    sort:4,
    weight:6
  },
  rosePie: {
    allowUse:false,
    type: 'pie',
    name: '南丁格尔玫瑰图',
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
    ],
    sort:3,
    weight:7
  },
  radar: {
    allowUse:false,
    type: 'radar',
    name: '雷达图',
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
      }
    ],
    sort:2,
    weight:8
  },
  treemap: {
    allowUse:false,
    type: 'treemap',
    name: '矩形树图',
    rules: [
      {
        columns: {
          rule: '>=',
          num: 1,
          text: '1个以上'
        },
        values: {
          rule: '<=',
          num: 1,
          text: '1个以下'
        }
      }
    ],
    sort:1,
    weight:9
  },
  waterfall: {
    allowUse:false,
    type: 'bar',
    name: '瀑布图',
    rules: [
      {
        columns: {
          rule: '<=',
          num: 1,
          text: '1个以下'
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
          num: 2,
          text: '2个以上'
        }
      }
    ],
    sort:0,
    weight:10
  },
  gauge:{
    allowUse:false,
    type: 'gauge',
    name: '计量图',
    rules: [
      {
        columns: {
          rule: '==',
          num: 0,
          text: '0个'
        },
        values: {
          rule: '==',
          num: 1,
          text: '1个'
        }
      }
    ],
    sort:11,
    weight:10
  },
  wordCloud:{
    allowUse:false,
    type: 'wordCloud',
    name: '字云',
    rules: [
      {
        columns: {
          rule: '==',
          num: 1,
          text: '1个'
        },
        values: {
          rule: '==',
          num: 0,
          text: '0个'
        }
      }
    ],
    sort:12,
    weight:10
  }
};