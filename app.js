document.addEventListener("DOMContentLoaded", () => {
    const stockButtons = document.querySelectorAll(".stock-btn");
    const stockName = document.getElementById("stock-name");
    const stockPrice = document.getElementById("stock-price");
    const stockChange = document.getElementById("stock-change");
    const stockChartContainer = document.getElementById("stock-chart");
  
    const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';  // Replace with your API key
    const API_URL = 'https://www.alphavantage.co/query';
  
    // Fetch stock data when a button is clicked
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
  
        if (data["Time Series (5min)"]) {
          const latestTime = Object.keys(data["Time Series (5min)"])[0];
          const stockData = data["Time Series (5min)"][latestTime];
  
          // Display stock data
          stockName.innerText = symbol;
          stockPrice.innerText = `Price: $${stockData["4. close"]}`;
          
          // Calculate price change
          const previousPrice = Object.values(data["Time Series (5min)"])[1]["4. close"];
          const change = (parseFloat(stockData["4. close"]) - parseFloat(previousPrice)).toFixed(2);
          const percentageChange = (((parseFloat(stockData["4. close"]) - parseFloat(previousPrice)) / parseFloat(previousPrice)) * 100).toFixed(2);
          
          stockChange.innerText = `Change: ${change} USD (${percentageChange}%)`;
  
          // Optional: Display chart data or historical data
          displayChart(data["Time Series (5min)"]);
        } else {
          alert("Error fetching stock data. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        stockName.innerText = "Error";
        stockPrice.innerText = "Unable to fetch data.";
        stockChange.innerText = "";
      }
    }
  
    // Function to display a chart (using Chart.js or another charting library)
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