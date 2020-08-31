
//creates the drop down menu
$('select').each(function () {
  var $this = $(this),
      numberOfOptions = $(this).children('option').length;
  $this.addClass('s-hidden');
  $this.wrap('<div class="select"></div>');
  $this.after('<div class="styledSelect"></div>');
  var $styledSelect = $this.next('div.styledSelect');
  $styledSelect.text($this.children('option').eq(0).text());
  var $list = $('<ul />', {
      'class': 'options'
  }).insertAfter($styledSelect);
  for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
          text: $this.children('option').eq(i).text(),
          rel: $this.children('option').eq(i).val()
      }).appendTo($list);
  }
  var $listItems = $list.children('li');
  $styledSelect.click(function (e) {
      e.stopPropagation();
      $('div.styledSelect.active').each(function () {
          $(this).removeClass('active').next('ul.options').hide();
      });
      $(this).toggleClass('active').next('ul.options').toggle();
  });

  $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $this.val($(this).attr('rel'));
      $list.hide();
  });

  $(document).click(function () {
      $styledSelect.removeClass('active');
      $list.hide();
  });

});





 
let usageFromStorage = localStorage.getItem('session');
let allUsageData = JSON.parse(usageFromStorage)
allUsageData = allUsageData.reverse()


//reverse the data so newer is on top
allUsageData.sort((a, b) => a.category.localeCompare(b.category))


let categoryValuesObj = {};
let xyData = []

function getTimeType(){

    let timeType = $("#selectbox1 option:selected").val()

    switch (timeType) {
        case "Day":
        return"start time"
        break;
        default:
        return "date"
        break;
    }
}

$('#displayButton').on("click", function(){
  


  let categoryOrTask = $("#selectbox2 option:selected").val()

    sortForPieChart(categoryOrTask)
    sortForAreaChart()

})
$("#displayButton").click()


function sortForPieChart(categoryOrTask){

 categoryValuesObj = {}

  allUsageData.forEach(obj => {
    let cycleValue = parseInt(obj.cycle.split(" ")[0])
    let category = obj[categoryOrTask]
    let time = obj[getTimeType()];
  
   if(category in categoryValuesObj){
    categoryValuesObj[category] += cycleValue
  
   }else{
    categoryValuesObj[category] = cycleValue;
  
   }
  })

  
  let formattedValues = Object.values(categoryValuesObj).map(obj => {
    return obj + " min";
  })
  
  let keys = Object.keys(categoryValuesObj)
  let values = Object.values(categoryValuesObj)

  renderPieChart(values, keys, formattedValues)
  sortForAreaChart(null)

}

function sortForAreaChart(taskName){

  let usageData = allUsageData;

  console.log("taskname", taskName)
  
      if(taskName != null){
     
        let categoryOrTask = $("#selectbox2 option:selected").val()

        console.log("catortas", categoryOrTask)
     
        usageData = usageData.filter(obj => {
        
          return obj[categoryOrTask] === taskName;
        })
    }

    console.log(usageData)

    let totalTime = 0;

      xyData = []
      usageData.forEach(obj => {
        let cycleValue = parseInt(obj.cycle.split(" ")[0])
        totalTime += cycleValue;
        let time = obj[getTimeType()];
        xyData.push({x: [time], y: cycleValue})
      })

      let formattedTime = parseInt(totalTime/60) + "h:" + (totalTime % 60) + "m"
     $("#total_time_indicator").text("Focus Time: " + formattedTime)
     

  renderAreaChart(xyData)

}



let table = document.querySelector("table");
let data = Object.keys(allUsageData[0]);
generateTableHead(table, data);
generateTable(table, allUsageData);
  
  function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
  
  function generateTable(table, data) {
    for (let element of data) {
      let row = table.insertRow();
      for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }



function renderPieChart(valuesArray, keysArray, formattedValues){
  
var options = {
  series: valuesArray,
  chart: {
      width: '100%',
//line, area, bar, radar, histogram, pie, donut, radialBar, scatter, bubble, heatmap, candlestick

      type: 'donut',
      events: {
          dataPointSelection: function(event, chartContext, config) {

            let taskName = keysArray[config.dataPointIndex];

            sortForAreaChart(taskName)

            $("#barChartHeader").text(taskName)

            // let newData = [{x: "date 1", y: 55}, {x: "date 2", y: 21}]
            // renderAreaChart(newData)

          }
      }
  },
  
  labels: valuesArray,
  theme: {
      monochrome: {
          enabled: true
      }
  },
  plotOptions: {
      pie: {
          dataLabels: {
              offset: 50
          },
          customScale: 0.85
      }
  },
  title: {
      text: " "
  },
  dataLabels: {
    style: {
      colors: ['#000']
     
    },
    dropShadow: {
      enabled:false
    },
    
      formatter(val, opts) {
      
          const name = keysArray[opts.seriesIndex];
                    return [name, formattedValues[opts.seriesIndex]]
      }
  },
  legend: {
      show: false,
      position: 'bottom'
  }
};

$("#pieChart").html("")
  var chart = new ApexCharts(document.querySelector("#pieChart"), options);
  chart.render();
  
}



function renderAreaChart(xyData){



var areaChartOptions = {
  series: [{
  name: 'Focus Time',
  data: xyData,
}],
  chart: {
  type: 'bar',
  //line, area, bar, radar, histogram, pie, donut, radialBar, scatter, bubble, heatmap, candlestick
  height: 350,
  animations: {
    enabled: true
  },
  zoom: {
    enabled: false
  },
},

dataLabels: {
  enabled: false
  //position: 'top', // top, center, bottom
},
stroke: {
  curve: 'straight'
},
fill: {
  opacity: 0.8,
  type: 'solid',
  pattern: {
    style: ['verticalLines', 'horizontalLines'],
    width: 5,
    height: 6
  },
},
markers: {
  size: 5,
  hover: {
    size: 9
  }
},
title: {
  text: '',
},
tooltip: {
  intersect: true,
  shared: false
},
theme: {
  palette: 'palette1'
},
xaxis: {
  // type: 'datetime',
  labels: {
    rotate: -45
  },
  tickPlacement: 'on'
},
yaxis: {
  title: {
    text: 'Focus Time (in minutes)'
  }
}
};

$("#barChart").html("")
  var areaChart = new ApexCharts(document.querySelector("#barChart"), areaChartOptions);
  areaChart.render();


//$("#barChart").show()
}


  $('.reset').on('click', function(){
    localStorage.setItem("session", []);
  })