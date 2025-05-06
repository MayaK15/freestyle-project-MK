const apiKey = '24OOJH4HROXTC50E';

// HTML elements
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('stock-price');
const stockChange = document.getElementById('stock-change');
const stockChart = document.getElementById('stock-chart');

// Stock buttons
const stockButtons = document.querySelectorAll('.stock-btn');

// Chart setup
const chart = new Chart(stockChart, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Stock Price',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price (USD)' } }
    }
  }
});

// Fetch stock data from Alpha Vantage
async function fetchStockData(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if the data is valid
    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).reverse();
      const prices = dates.map(date => timeSeries[date]['4. close']);
      const latestPrice = prices[0];
      const priceChange = (latestPrice - prices[1]).toFixed(2); // Price change from the previous day

      // Update the stock info
      stockName.textContent = `Stock: ${symbol}`;
      stockPrice.textContent = `Current Price: $${latestPrice}`;
      stockChange.textContent = `Change: $${priceChange}`;

      // Update the chart
      chart.data.labels = dates;
      chart.data.datasets[0].data = prices;
      chart.update();
    } else {
      stockName.textContent = 'Error fetching data.';
      stockPrice.textContent = '';
      stockChange.textContent = '';
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    stockName.textContent = 'Error fetching data.';
    stockPrice.textContent = '';
    stockChange.textContent = '';
  }
}

// Event listener for each stock button
stockButtons.forEach(button => {
  button.addEventListener('click', () => {
    const symbol = button.getAttribute('data-symbol');
    fetchStockData(symbol);
  });
});