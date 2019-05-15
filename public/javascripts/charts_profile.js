var asia = [282,350,411,502,635,809,947,1402,3700,5267];
var africa = [86,114,106,106,107,111,133,221,783,2478];
var years = [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050];

window.onload = function(){

// var ctx = document.getElementById("myChart");
// var myChart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: years,
//     datasets: [
//       { 
//       	label: 'Growth',
//       	backgroundColor: 'rgba(121, 61, 244, 0.5)',      	
//         data: asia
//       }
//     ]
//   }
// });

var ctx2 = document.getElementById("myChart2");
var myChart2 = new Chart(ctx2, {
  type: 'line',
  data: {
    labels: years,
    datasets: [
      { 
      	label: 'Effciency',
      	backgroundColor: 'rgba(0, 255, 0, 0.5)',
        data: africa
      },
      { 
      	label: 'Asia Effciency',
      	backgroundColor: 'rgba(0, 0, 255, 0.5)',
        data: asia
      }      
    ]
  },
});


// var ctx3 = document.getElementById("myChart3");
// var myChart3 = new Chart(ctx3, {
//   type: 'line',
//   data: {
//     labels: years,
//     datasets: [
//       { 
//       	label: 'Growth',
//       	backgroundColor: 'rgba(121, 61, 244, 0.5)',      	
//         data: asia
//       }
//     ]
//   }
// });

var ctx3 = document.getElementById("myChart3");
var strengthChart = new Chart(ctx3, {
  type: 'radar',
  data: {
    labels: ['Skill', 'Effciency', 'Leadership', 'blah', 'blah'],
    // labels: years,
     datasets: [
      {
      	label: 'Points',
      	backgroundColor: 'rgba(0, 50, 70, 0.5)',      	
        data: [10,15,20,50,10]
        // data: asia
      }
    ]
  }
});

};