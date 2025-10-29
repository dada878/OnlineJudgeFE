const pieColorMap = {
  'AC': {color: '#2e7d32'},  // 深綠色
  'WA': {color: '#c62828'},  // 深紅色
  'TLE': {color: '#f57c00'}, // 深橙色
  'MLE': {color: '#1565c0'}, // 深藍色
  'RE': {color: '#6a1b9a'},  // 深紫色
  'CE': {color: '#546e7a'},  // 深灰色
  'PAC': {color: '#00897b'}  // 深青色
}

function getItemColor (obj) {
  return pieColorMap[obj.name].color
}

const pie = {
  legend: {
    left: 'center',
    top: '10',
    orient: 'horizontal',
    data: ['AC', 'WA'],
    textStyle: {
      color: '#93c9ff',
      fontSize: 14
    }
  },
  series: [
    {
      name: 'Summary',
      type: 'pie',
      radius: '80%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: 0, name: 'WA'},
        {value: 0, name: 'AC'}
      ],
      label: {
        normal: {
          position: 'inner',
          show: true,
          formatter: '{b}: {c}\n {d}%',
          textStyle: {
            color: '#e6f0ff',
            fontSize: 14,
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }
        }
      }
    }
  ]
}

const largePie = {
  legend: {
    left: 'center',
    top: '10',
    orient: 'horizontal',
    itemGap: 20,
    data: ['AC', 'RE', 'WA', 'TLE', 'PAC', 'MLE'],
    textStyle: {
      color: '#93c9ff',
      fontSize: 14
    }
  },
  series: [
    {
      name: 'Detail',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: 0, name: 'RE'},
        {value: 0, name: 'WA'},
        {value: 0, name: 'TLE'},
        {value: 0, name: 'AC'},
        {value: 0, name: 'MLE'},
        {value: 0, name: 'PAC'}
      ],
      label: {
        normal: {
          formatter: '{b}: {c}\n {d}%',
          textStyle: {
            color: '#93c9ff',
            fontSize: 14,
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          length: 15,
          length2: 10,
          lineStyle: {
            color: '#93c9ff'
          }
        }
      }
    },
    {
      name: 'Summary',
      type: 'pie',
      radius: '30%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: '0', name: 'WA'},
        {value: 0, name: 'AC', selected: true}
      ],
      label: {
        normal: {
          position: 'inner',
          formatter: '{b}: {c}\n {d}%',
          textStyle: {
            color: '#e6f0ff',
            fontSize: 14,
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }
        }
      }
    }
  ]
}

export { pie, largePie }
