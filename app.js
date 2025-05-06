document.addEventListener("DOMContentLoaded", () => {
    const stockButtons = document.querySelectorAll(".stock-btn");
    const stockName = document.getElementById("stock-name");
    const stockPrice = document.getElementById("stock-price");
    const stockChange = document.getElementById("stock-change");
  
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
          stockChange.innerText = `Change: ${parseFloat(stockData["4. close"]) - parseFloat(stockData["1. open"])} USD`;
  
          // Optional: Display chart data or historical data
          displayChart(data["Time Series (5min)"]);
        } else {
          alert("Error fetching stock data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    // Optional: Add a function to display a chart using a library (like Chart.js)
    function displayChart(timeSeries) {
      const labels = Object.keys(timeSeries).slice(0, 10);  // Last 10 time intervals
      const prices = labels.map(time => parseFloat(timeSeries[time]["4. close"]));
  
      // Example of chart rendering (you can replace this with a Chart.js implementation)
      const chartContainer = document.getElementById("stock-chart");
      chartContainer.innerHTML = `
        <p>Display Chart (replace this with Chart.js or another chart library)</p>
      `;
    }
  });