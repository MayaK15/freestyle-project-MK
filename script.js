document.addEventListener("DOMContentLoaded", () => {
  const stockButtons = document.querySelectorAll(".stock-btn");
  const stockName = document.getElementById("stock-name");
  const stockPrice = document.getElementById("stock-price");
  const stockChange = document.getElementById("stock-change");
  const stockChartCanvas = document.getElementById("stock-chart");

  const API_KEY = 'XNC1V0YJ3C84UWJS';
  const API_URL = 'https://www.alphavantage.co/query';

  let chart; // Reference to the Chart.js chart

  stockButtons.forEach(button => {
    button.addEventListener("click", () => {
      const stockSymbol = button.getAttribute("data-symbol");
      fetchStockData(stockSymbol);
    });
  });

  function fetchStockData(symbol) {
    fetch(`${API_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Log the response to inspect it

        if (data["Note"]) {
          alert("API Rate limit exceeded. Please wait a minute or try again later.");
          stockName.innerText = "Rate limit exceeded";
          stockPrice.innerText = "";
          stockChange.innerText = "Please wait a minute.";
          return;
        }

        if (data["Time Series (5min)"]) {
          const timeSeries = data["Time Series (5min)"];
          const timestamps = Object.keys(timeSeries).sort().slice(-10); // Get last 10 entries chronologically
          const prices = timestamps.map(time => parseFloat(timeSeries[time]["4. close"]));
          const latestData = timeSeries[timestamps[timestamps.length - 1]];

          const close = parseFloat(latestData["4. close"]);
          const open = parseFloat(latestData["1. open"]);

          // Update DOM
          stockName.innerText = symbol;
          stockPrice.innerText = `Price: $${close.toFixed(2)}`;
          stockChange.innerText = `Change: ${(close - open).toFixed(2)} USD`;

          displayChart(timestamps, prices, symbol);
        } else {
          alert("Error fetching stock data. Try again later.");
        }
      })
      .catch(error => {
        console.error("Error fetching stock data:", error);
        alert("There was an error fetching the data. Please try again later.");
      });
  }

  function displayChart(labels, data, symbol) {
    // Destroy previous chart if it exists
    if (chart) chart.destroy();

    chart = new Chart(stockChartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Price`,
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price ($)'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }
});