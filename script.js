console.log("JavaScript is linked!");

document.addEventListener("DOMContentLoaded", () => {
    const stockButtons = document.querySelectorAll(".stock-btn");
    const stockName = document.getElementById("stock-name");
    const stockPrice = document.getElementById("stock-price");
    const stockChange = document.getElementById("stock-change");
    const stockChartContainer = document.getElementById("stock-chart");
    
    const API_KEY = 'FQ5NK3IRJOG6ALU1';
    const API_URL = 'https://www.alphavantage.co/query';
    
    stockButtons.forEach(button => {
      button.addEventListener("click", () => {
        const stockSymbol = button.getAttribute("data-symbol");
        fetchStockData(stockSymbol);
      });
    });

    async function fetchStockData(symbol) {
      try {
        const response = await fetch(`${API_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`);
        const data = await response.json();
        console.log(data); 
    
        if (data["Time Series (5min)"]) {
          const latestTime = Object.keys(data["Time Series (5min)"])[0];
          const stockData = data["Time Series (5min)"][latestTime];
        
          stockName.innerText = symbol;
          stockPrice.innerText = `Price: $${stockData["4. close"]}`;
          stockChange.innerText = `Change: ${(parseFloat(stockData["4. close"]) - parseFloat(stockData["1. open"])).toFixed(2)} USD`;
        
          displayChart(data["Time Series (5min)"]);
        } else {
          alert("Error fetching stock data");
        }
    
    function displayChart(timeSeries) {
      const labels = Object.keys(timeSeries).slice(0, 10); 
      const prices = labels.map(time => parseFloat(timeSeries[time]["4. close"]));
    
      const ctx = stockChartContainer.getContext("2d");
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Stock Price',
            data: prices,
            borderColor: 'rgb(218, 0, 91)',
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