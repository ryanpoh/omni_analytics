var months = ['Feb', 'March', 'April', 'May'],
  averagePerformance = [80, 75, 89, 99];

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

var ctx = document.getElementById('progressChart').getContext('2d');
//new Chart(ctx).Line(machineData);

let progressChart = new Chart(ctx,
  machineData
);
