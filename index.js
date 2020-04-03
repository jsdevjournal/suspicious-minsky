
let annualData = [];
let quarterData = [];

let selectedDisplayValue;

const spanFscoreA = document.getElementById('fscore-a');
const spanFscoreQ = document.getElementById('fscore-q');
const inputQ = document.getElementById('input-q');
const inputY = document.getElementById('input-y');
const selectDisplay = document.getElementById('display');

window.clickLink = function clickLink(href) {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    href: href + query,
  }).click();
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function transform(data, column, divide) {
  return data.slice(2).map(data => {
    return {
      label: `${data['Quarter'] !== 9 ? `Q${data['Quarter']}` : ''} ${data['Fiscal']}`,
      y: parseFloat(data[column]) / divide
    }
  })
}

function calculateFscore(data) {
  let score = 0
  const lastItem = data.slice(-1)[0]
  const beforeLastItem = data.slice(-2)[0]

  if (!lastItem || !beforeLastItem) return 'N/A'
  
  if (Number(lastItem['ROA']) > 0) {
    score += 1
  }
  if (Number(lastItem['ROA']) > Number(beforeLastItem['ROA'])) {
    score += 1
  }
  if (Number(lastItem['OperatingActivities']) > 0) {
    score += 1
  }
  if (Number(lastItem['OperatingActivities']) > Number(lastItem['NetProfit'])) {
    score += 1
  }
  if (Number(lastItem['DebtToEquity']) < Number(beforeLastItem['DebtToEquity'])) {
    score += 1
  }
  if (Number(lastItem['PaidUpCapital']) <= Number(beforeLastItem['PaidUpCapital'])) {
    score += 1
  }
  if (Number(lastItem['GPM']) >= Number(beforeLastItem['GPM'])) {
    score += 1
  }
  const assetTurnOver = Number(lastItem['Revenue']) / Number(lastItem['Asset'])
  const assetTurnOver2 = Number(beforeLastItem['Revenue']) / Number(beforeLastItem['Asset'])
  if (assetTurnOver >= assetTurnOver2) {
    score += 1
  }

  return score
}

function drawChart(isRerender) {

  let data = selectedDisplayValue === 'q' ? quarterData : annualData;

  if (!isRerender) { // Create first time
    const chartCount = 7;
    for (let i = 1; i <= chartCount; i++) {
      let div = document.createElement('div');
      div.setAttribute('id', `chartContainer${i}`);
      div.setAttribute('style', 'height: 400px; width: 100%; margin: 0px auto;');
      document.body.append(div);
    }
  }

  const chart1 = new CanvasJS.Chart('chartContainer1', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: query.toUpperCase()
    },
    axisY: {
      title: 'Million THB',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart1.render();
      }
    },
    data: ['Revenue', 'GrossProfit', 'SGA', 'DA', 'NetProfit'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: "##.00",
        dataPoints: transform(data, column, 1000)
      }
    })
  });
  const chart2 = new CanvasJS.Chart('chartContainer2', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: ' '
    },
    axisY: {
      title: 'Million THB',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart2.render();
      }
    },
    data: ['Asset', 'TotalDebt', 'Equity', 'Cash'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: '##.00',
        dataPoints: transform(data, column, 1000)
      }
    })
  });
  const chart3 = new CanvasJS.Chart('chartContainer3', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: ' '
    },
    axisY: {
      title: 'Million THB',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart3.render();
      }
    },
    data: ['OperatingActivities', 'FinancingActivities', 'InvestingActivities'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: '##.00',
        dataPoints: transform(data, column, 1000)
      }
    })
  });
  const chart4 = new CanvasJS.Chart('chartContainer4', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: ' '
    },
    axisY: {
      title: 'Days',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart4.render();
      }
    },
    data: ['CashCycle'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: '##.00',
        dataPoints: transform(data, column, 1)
      }
    })
  });
  const chart5 = new CanvasJS.Chart('chartContainer5', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: ' '
    },
    axisY: {
      title: '(%)',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart5.render();
      }
    },
    data: ['GPM', 'SGAPerRevenue', 'NPM'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: '##.00%',
        dataPoints: transform(data, column, 100)
      }
    })
  });
  const chart6 = new CanvasJS.Chart('chartContainer6', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: ' '
    },
    axisY: {
      title: '(%)',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart6.render();
      }
    },
    data: ['ROE', 'ROA'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: '##.00%',
        dataPoints: transform(data, column, 1)
      }
    })
  });
  const chart7 = new CanvasJS.Chart('chartContainer7', {
    animationEnabled: false,
    theme: 'light2',
    title: {
      text: ' '
    },
    axisY: {
      title: 'Multiply',
      crosshair: {
        enabled: true
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'bottom',
      itemclick: (e) => {
        if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart7.render();
      }
    },
    data: ['PriceEarningRatio', 'PriceBookValue', 'EVPerEbitDA'].map(column => {
      return {
        type: 'line',
        showInLegend: true,
        name: column,
        yValueFormatString: '##.00',
        dataPoints: transform(data, column, 1)
      }
    })
  });
  // const chart8 = new CanvasJS.Chart('chartContainer8', {
  //   animationEnabled: false,
  //   theme: 'light2',
  //   title: {
  //     text: ' '
  //   },
  //   axisY: {
  //     title: 'Million THB',
  //     crosshair: {
  //       enabled: true
  //     }
  //   },
  //   toolTip: {
  //     shared: true
  //   },
  //   legend: {
  //     cursor: 'pointer',
  //     verticalAlign: 'bottom',
  //     itemclick: (e) => {
  //       if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
  //         e.dataSeries.visible = false;
  //       } else {
  //         e.dataSeries.visible = true;
  //       }
  //       chart8.render();
  //     }
  //   },
  //   data: ['MKTCap'].map(column => {
  //     return {
  //       type: 'line',
  //       showInLegend: true,
  //       name: column,
  //       yValueFormatString: '##.00',
  //       dataPoints: transform(data, column, 1000)
  //     }
  //   })
  // });
  chart1.render();
  chart2.render();
  chart3.render();
  chart4.render();
  chart5.render();
  chart6.render();
  chart6.render();
  chart7.render();
  // chart8.render();
}

function filterAnnually(item) {
  return item['Quarter'] === 9;
}

function filterQuarterly(item) {
  return item['Quarter'] !== 9;
}

selectedDisplayValue = selectDisplay.value || 'q';

selectDisplay.addEventListener('change', (e) => {
  selectedDisplayValue = e.srcElement.value;
  drawChart(true);
});

const query = getParameterByName('q') || 'cpall';
const year = getParameterByName('y') || '2007';

inputQ.value = query;
inputY.value = year;

axios({
  method: 'get',
  url: `https://asia-east2-suspicious-minsky-49b420.cloudfunctions.net/financial?q=${query}&y=${year}`,
}).then((response) => {
    const data = response.data
    if (data) {
      annualData = data.filter(filterAnnually);
      quarterData = data.filter(filterQuarterly);
      spanFscoreA.textContent = calculateFscore(annualData);
      spanFscoreQ.textContent = calculateFscore(quarterData);
      drawChart();
    }
  }).catch(console.error);