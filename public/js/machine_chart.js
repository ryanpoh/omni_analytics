// window.onload = function() {

// };

// const form = document.getElementById('volt-form');

// form.addEventListener('submit', e => {
//   //const voltSync = document.querySelector('input[name=optradio]:checked').value;
//   var voltSync = document.getElementById('1').value;
//   const data = { volt: voltSync };

//   fetch('http://localhost:3000/machines', {
//     method: 'post',
//     body: JSON.stringify(data),
//     headers: new Headers({
//       'Content-Type': 'application/json'
//     })
//   })
//     .then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

//   e.preventDefault();
// });

// MachineData.find().then(machineDbData => res.json({success: true,
// machineDbData: machineDbData }))

// fetch('http://localhost:3000/machines')
//   .then(res => res.json())
//   .then(data => {
//     const machineDbData = data.machineDbData


//   });
var machineDbData = JSON.parse(document.getElementsByName('dataFromServer')[0].machineDbData)
console.log(machineDbData)

var months = ['Feb', 'March', 'April', 'May'];
var averagePerformance = [80, 75, 89, 99];

machineData = {
  type: 'line',
  data: {
    labels: months,
    datasets: [
      {
        label: 'Employee Performance',
        backgroundColor: 'rgba(121, 61, 244, 0.5)',
        data: averagePerformance
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Machine 1 Monthly Average Performance',
      fontSize: 15
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
};

// METHODS
function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach(dataset => {
    dataset.data.pop();
  });
  chart.update();
}

// Draw initial graph
var ctx = document.getElementById('progressChart').getContext('2d');
let progressChart = new Chart(ctx, machineData);
addData(progressChart, 'June', machineDbData.volt);
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

// Dynamic update
var pusher = new Pusher('5ed5a1f25586a0760edb', {
  cluster: 'ap1',
  forceTLS: true
});
// Dynamic Update
var channel = pusher.subscribe('machine-1-channel');
channel.bind('machine-1-sync', function(data) {
  addData(progressChart, 'June', data.volt);
  alert(JSON.stringify(data));
});