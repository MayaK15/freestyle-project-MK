document.addEventListener("DOMContentLoaded", () => {
    const stockButtons = document.querySelectorAll(".stock-btn");
    const stockName = document.getElementById("stock-name");
    const stockPrice = document.getElementById("stock-price");
    const stockChange = document.getElementById("stock-change");
    const stockChartContainer = document.getElementById("stock-chart");
    
    const API_KEY = 'PAH7PVTIYF87R84H';  // Your API key
    const API_URL = 'https://www.alphavantage.co/query';
    
    stockButtons.forEach(button => {
      button.addEventListener("click", () => {
        const stockSymbol = button.getAttribute("data-symbol");
        fetchStockData(stockSymbol);
      });
    });
    
    // Function to fetch stock data
    async function fetchStockData(symbol) {
      try {
        const response = await fetch(`${API_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`);
        const data = await response.json();
        console.log(data);  // Log the entire response to check it
      
        if (data["Time Series (5min)"]) {
          const latestTime = Object.keys(data["Time Series (5min)"])[0];
          const stockData = data["Time Series (5min)"][latestTime];
      
          // Display stock data
          stockName.innerText = symbol;
          stockPrice.innerText = `Price: $${stockData["4. close"]}`;
          stockChange.innerText = `Change: ${parseFloat(stockData["4. close"]) - parseFloat(stockData["1. open"])} USD`;
      
          // Display chart data or historical data
          displayChart(data["Time Series (5min)"]);
        } else {
          alert("Error fetching stock data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    
    // Function to display a chart (using Chart.js)
    function displayChart(timeSeries) {
      const labels = Object.keys(timeSeries).slice(0, 10);  // Last 10 time intervals
      const prices = labels.map(time => parseFloat(timeSeries[time]["4. close"]));
    
      // Example of chart rendering using Chart.js
      const ctx = stockChartContainer.getContext("2d");
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Stock Price',
            data: prices,
            borderColor: 'rgb(75, 192, 192)',
            fill: false
          }]
        },
        options: {
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
          }
        }
      });
    }
  });