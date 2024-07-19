const formatStringDecimal = (number) => {
  const options = {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 12,
  };
  return number.toLocaleString('en-US', options);
};

function updateChartValues_Hedge(prices) {
  
    // Canvas setup
    const canvas = document.getElementById('priceChart');
    const ctx = canvas.getContext('2d');
  
    // Chart dimensions
    const chartWidth = 380;
    const chartHeight = 380;
    canvas.width = chartWidth;
    canvas.height = chartHeight;
  
    // Chart styling
    const lineColor = '#ffffff';
    const textColor = '#ffffff';
    const areaColor = '#222870'; // dark blue. ALT #2a3082
  
    // Calculate chart dimensions based on prices dataset
    function calculateChartDimensions() {    
        //add targetprice to array so it shows on chart even if price doesnt go there
        let maxPrice = Math.max(...prices); // Default maximum price
        let minPrice = Math.min(...prices); // Default minimum price
        //proceed
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.1; // Add 10% padding to the price range
        const adjustedMaxPrice = maxPrice + padding;
        const adjustedMinPrice = minPrice - padding;
    
        return {
          maxPrice: adjustedMaxPrice,
          minPrice: adjustedMinPrice,
          priceRange: adjustedMaxPrice - adjustedMinPrice,
        };
    }
  
    // Function to update the chart with new prices
    function updateChart(newPrices) {
      prices = newPrices;
      drawChart();
    }
  
    // Temporary: dynamically updating the chart with new prices
    document.getElementById('refreshButton').addEventListener('click', () => {
      const newPrices = [110, 100, 90, 90, 130, 150];
      updateChart(newPrices);
    });
    

    function drawChart() {
      // Calculate chart dimensions
      const chartDimensions = calculateChartDimensions();
      const step = chartWidth / (prices.length - 1);
  
      const canvas = document.getElementById('priceChart');
      const ctx = canvas.getContext('2d');
  
      // Create linear gradient for background
      const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
      gradient.addColorStop(0, "rgba(0, 199, 214, 0)");
      gradient.addColorStop(0.3, "rgba(0, 199, 214, 0.1)");
      gradient.addColorStop(1, "rgba(0, 199, 214, 0.32)");
      /* flipped gradinet 
      gradient.addColorStop(0, "rgba(0, 199, 214, 0.32)");
      gradient.addColorStop(0.3, "rgba(0, 199, 214, 0.1)");
      gradient.addColorStop(1, "rgba(0, 199, 214, 0)");
      */
  
      // Fill canvas with linear gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, chartWidth, chartHeight);
  
      // Define start, target, and current prices
      const startPrice = prices[0];
      const currentPrice = prices[1];
      const targetPrice = prices[prices.length - 1];
      const Nan = NaN;
  
      // Define data array
      let borderColor_ = '#00c7d6';
      if (targetPrice > startPrice) {
          borderColor_ = '#089353'; //green
      } else if (targetPrice < startPrice) {
          borderColor_ = '#d6188a'; //red
      }
      const data = {
          labels: ["Start Price", "Current Price", "Target Price"],
          datasets: [{
              label: "Price",
              backgroundColor: gradient,
              pointBackgroundColor: "#00c7d6",
              pointRadius: [3, 0, 0, 0],
              borderWidth: 1.5,
              borderColor: "rgb(75, 192, 192)",
              data: [startPrice, currentPrice, null, targetPrice],
              spanGaps: true,
              tension: 0.4 // Adjust the tension for smoothness (default is 0.4)
          }, {
              label: "Price",
              backgroundColor: gradient,
              pointBackgroundColor: "#00c7d6",
              pointRadius: [0, 4, 3], // Hide the point for "Current Price" only
              borderWidth: 1.5,
              borderColor: borderColor_,
              data: [null, currentPrice, targetPrice],
              borderDash: [6, 6], // Set the border dash pattern for the line
              spanGaps: true,
              tension: 0.4 // Adjust the tension for smoothness (default is 0.4)
          }]
      };
  
  
      // Chart.js options with custom scales for horizontal lines
      const options = {
          responsive: true,
          maintainAspectRatio: true,
          animation: {
              easing: "easeInOutElastic",
              duration: 1500
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "#5e6a81",
                      callback: function(value, index, values) {
                          // Format the tick labels to display numbers as strings or decimals
                          return formatStringDecimal(value);
                      }
                  },
                  gridLines: {
                      color: "rgba(200, 200, 200, 0.08)",
                      lineWidth: 1
                  },
                  // Add horizontal lines
                  scaleLabel: {
                      display: true,
                      labelString: 'Price',
                      fontColor: 'rgba(255,255,255,1)', // Transparent
                      fontSize: 0, // Hide scale label
                      lineHeight: 0 // Hide scale label
                  }
              }],
              xAxes: [{
                  ticks: {
                      fontColor: "#5e6a81"
                  }
              }]
          },
          elements: {
              line: {
                  tension: 0.4
              }
          },
          legend: {
              display: false
          },
          point: {
              backgroundColor: "#00c7d6"
          },
          tooltips: {
              titleFontFamily: "sans-serif",
              backgroundColor: "rgba(0,0,0,0.4)",
              titleFontColor: "white",
              caretSize: 5,
              cornerRadius: 2,
              xPadding: 10,
              yPadding: 10,
              callbacks: {
                  label: function(tooltipItem, data) {
                      let label = data.datasets[tooltipItem.datasetIndex].label || '';
                      if (label) {
                          label += ': ';
                      }
                      label += formatStringDecimal(tooltipItem.yLabel);
                      return label;
                  }
              }
          }
      };
  
      // Create a new Chart instance with options
      const chartInstance = new Chart(canvas, {
          type: "line",
          data: data,
          options: options
      });
  }
  
  
  
  // Draw Price Chart with data provided
  drawChart();
}

function depracated_drawChart() {
  const chartDimensions = calculateChartDimensions();
  const step = chartWidth / (prices.length - 1);

  // Clear canvas
  ctx.clearRect(0, 0, chartWidth, chartHeight);

  // Disable image smoothing for crisp text rendering
  ctx.imageSmoothingEnabled = false;

  // Draw vertical lines representing prices
  ctx.strokeStyle = 'rgba(0,0,0,0.8)'; // Black color for lines
  ctx.lineWidth = 1; // Set the line width to 0.5px
  for (let i = 0; i < prices.length; i++) {
    if(i == 0 || i == prices.length) {
      const x = i * step;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();
    }          
  }

  // Draw only start and end horizontal lines representing time
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; // Light gray color for lines
  ctx.lineWidth = 2;
  ctx.beginPath();/* top line starts here
  ctx.moveTo(0, 0);
  ctx.lineTo(chartWidth, 0); */
  ctx.moveTo(0, chartHeight - 1);/* bottom line starts here */
  ctx.lineTo(chartWidth, chartHeight - 1);
  ctx.stroke();

  // Draw the line connecting prices on the chart with light blur
  ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; // Light blue color with transparency
  ctx.shadowColor = 'rgba(0, 255, 255, 0.3)'; // Light blue shadow color with transparency
  ctx.shadowBlur = 10; // Set shadow blur radius
  ctx.lineWidth = 1.5; // Set the line width for the price line
  ctx.beginPath();
  ctx.moveTo(0, chartHeight - ((prices[0] - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight);
  for (let i = 1; i < prices.length; i++) {
      const x = i * step;
      const y = chartHeight - ((prices[i] - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
      const prevY = chartHeight - ((prices[i - 1] - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
      const xc = (x + (x - step)) / 2; // Bezier control point x-coordinate
      ctx.bezierCurveTo(xc, prevY, xc, y, x, y); // Add a smooth curve to the path
  }
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0; // Reset shadow after drawing the line
  
  // Draw start price level line (constant line)
  const startPrice = prices[0];
  const startY = chartHeight - ((startPrice - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
  ctx.strokeStyle = '#FFF'; // Red color for the target price line
  ctx.setLineDash([5, 4]); // Set the line to dashed
  ctx.lineWidth = 0.5; // Set the line width to 1px
  ctx.beginPath();
  ctx.moveTo(0, startY);
  ctx.lineTo(chartWidth, startY);
  ctx.stroke();

  // Draw target price level line (constant line)
  const targetY = chartHeight - ((targetPrice - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
  ctx.strokeStyle = '#d6188a'; // Red color for the target price line
  ctx.setLineDash([5, 4]); // Set the line to dashed
  ctx.lineWidth = 1; // Set the line width to 1px
  ctx.beginPath();
  ctx.moveTo(0, targetY);
  ctx.lineTo(chartWidth, targetY);
  ctx.stroke();

  // Draw current price level line
  const currentPrice = prices[prices.length - 1];
  const currentPriceY = chartHeight - ((currentPrice - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
  ctx.strokeStyle = '#5fff37'; // #00ff5e - Green color for the current price line
  ctx.setLineDash([2, 2]); // Set the line to dashed
  ctx.lineWidth = 1.5; // Set the line width to 1px
  ctx.beginPath();
  ctx.moveTo(0, currentPriceY);
  ctx.lineTo(chartWidth, currentPriceY);
  ctx.stroke();

  // Draw price tags
  ctx.fillStyle = textColor;
  ctx.font = '100 10px sans-serif';
  for (let i = 0; i < prices.length; i++) {
      const x = i * step;
      const y = chartHeight - ((prices[i] - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(formatStringDecimal(prices[i]), x + 5, y - 10); // Display price values at all times
  }

  // Draw labels for horizontal lines
  ctx.fillStyle = '#fff'; // White color for labels      
  ctx.fillText(`start price`, 0, startY + 11); // Adjust x-coordinate as needed
  ctx.fillText(`strike price: ${formatStringDecimal(targetPrice)}`, chartWidth / 2 - 30, targetY - 5); // Adjust x-coordinate as needed
  ctx.fillText(`current price: ${formatStringDecimal(prices[prices.length - 1])}`, chartWidth - 100, currentPriceY - 5); // Adjust x-coordinate as needed
}


/*
function drawChart() {
  const chartDimensions = calculateChartDimensions();
  const step = chartWidth / (prices.length - 1);

  // Clear canvas
  ctx.clearRect(0, 0, chartWidth, chartHeight);

  // Disable image smoothing for crisp text rendering
  ctx.imageSmoothingEnabled = false;

  // Draw area below the charted points
  ctx.fillStyle = areaColor;
  ctx.beginPath();
  ctx.moveTo(0, chartHeight);
  for (let i = 0; i < prices.length; i++) {
      const x = i * step;
      const y = chartHeight - ((prices[i] - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
      ctx.lineTo(x, y);
  }
  ctx.lineTo(chartWidth, chartHeight);
  ctx.closePath();
  ctx.fill();

  // Draw target price level line (constant line)
  const targetY = chartHeight - ((targetPrice - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
  ctx.strokeStyle = '#d6188a'; // red
  ctx.beginPath();
  ctx.moveTo(0, targetY);
  ctx.lineTo(chartWidth, targetY);
  ctx.stroke();

  // Draw start price level line
  const startPrice = prices[0];
  const startPriceY = chartHeight - ((startPrice - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
  ctx.strokeStyle = 'rgb(8, 231, 254)'; // blue
  ctx.beginPath();
  ctx.moveTo(0, startPriceY);
  ctx.lineTo(chartWidth, startPriceY);
  ctx.stroke();

  // Draw current price level line
  const currentPrice = prices[prices.length - 1];
  const currentPriceY = chartHeight - ((currentPrice - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
  ctx.strokeStyle = '#089353'; // green
  ctx.beginPath();
  ctx.moveTo(0, currentPriceY);
  ctx.lineTo(chartWidth, currentPriceY);
  ctx.stroke();

  // Draw price tags
  ctx.fillStyle = textColor;
  ctx.font = '100 10px sans-serif';
  for (let i = 0; i < prices.length; i++) {
      const x = i * step;
      const y = chartHeight - ((prices[i] - chartDimensions.minPrice) / chartDimensions.priceRange) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(prices[i].toString(), x + 5, y - 10); // Display price values at all times
  }

  // Draw labels for horizontal lines
  ctx.fillStyle = '#fff'; // White
  ctx.fillText(`start: ${formatStringDecimal(prices[0])}`, chartWidth - 60, startPriceY - 5);
  ctx.fillText(`strike: ${formatStringDecimal(targetPrice)}`, chartWidth - 60, targetY - 5);
  ctx.fillText(`current: ${formatStringDecimal(prices[prices.length - 1])}`, chartWidth - 60, currentPriceY - 5);
  
}

// Draw Price Chart with data provided
drawChart();
*/
  /*===================================================*/

  
  // TODO: the circles generated below have a redish/brownish border how do i remove it

function updateChartValues_Assets(tokenNames, tokenAmounts) {

    // Function to generate a random color
    function getRandomColor() {
        // Generate random RGB components in the range 0-127 (dark colors)
        const r = Math.floor(Math.random() * 128);
        const g = Math.floor(Math.random() * 128);
        const b = Math.floor(Math.random() * 128);
        // Convert RGB components to a hexadecimal color string
        const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        return color;
    }

    // Function to create random circles with token names and amounts
    function createRandomCircles(container) {
        // Matter.js engine and world
        const engine = Matter.Engine.create();
        const world = engine.world;
    
        // Configure gravity and bounds
        world.gravity.y = 0.8;
        const width = container.clientWidth;
        const height = container.clientHeight;
    
        // Create boundaries to keep circles within the container
        Matter.World.add(world, [
            Matter.Bodies.rectangle(width / 2, height, width, 1, { isStatic: true, render: { fillStyle: '#3399ff' } }),
            Matter.Bodies.rectangle(width / 2, 0, width, 0, { isStatic: true }),
            Matter.Bodies.rectangle(0, height / 2, 1, height, { isStatic: true, render: { fillStyle: '#3399ff' } }),
            Matter.Bodies.rectangle(width, height / 2, 1, height, { isStatic: true, render: { fillStyle: '#3399ff' } })
        ]);

        // Empty the container
        container.innerHTML = "";

        // Create the circles, use tokenlength as max counter
        for (let i = 0; i < tokenAmounts.length; i++) {
            // Random index for tokenNames and tokenAmount arrays
            const randomIndex = i;
    
            // Get the corresponding token name and amount
            const name = tokenNames[randomIndex];
            const amount = tokenAmounts[randomIndex];
            const amountFormated = formatStringDecimal(amount);
    
            // Calculate circle size based on token amount
            const amountRatio = (amount - Math.min(...tokenAmounts)) / (Math.max(...tokenAmounts) - Math.min(...tokenAmounts));
            const circleRadius = 30 + (30 * amountRatio);
    
            // Randomize the position within the container
            const x = Math.random() * (width - circleRadius * 2) + circleRadius;
            const y = Math.random() * (height - circleRadius * 2) + circleRadius;
    
            // Create the circle element
            const circle = document.createElement("div");
            circle.classList.add("assetCircle");
            circle.style.width = `${circleRadius * 2}px`;
            circle.style.height = `${circleRadius * 2}px`;
            circle.style.borderRadius = `${circleRadius}px`;
            // Assign a random color to the circle
            const uniqueColor = getRandomColor();
            circle.style.backgroundColor = uniqueColor;
            circle.style.border = `1px solid ${uniqueColor}`;
            // Add text
            circle.textContent = `${name}\n${amountFormated}`;
            // Add the circle to the container
            container.appendChild(circle);
    
            // Create a Matter.js circle
            const matterCircle = Matter.Bodies.circle(x, y, circleRadius, {
                restitution: 0.5,
                friction: 0.1
            });
    
            // Add the Matter.js circle to the world
            Matter.World.add(world, matterCircle);
    
            // Update the positions of both circles after each physics update
            Matter.Events.on(engine, "afterUpdate", () => {
            const circlePos = matterCircle.position;
            const translateX = circlePos.x - circleRadius;
            const translateY = circlePos.y - circleRadius;
    
            circle.style.transform = `translate(${translateX}px, ${translateY}px)`;
    
            // Remove opacity when the physics simulation settles down. works in collab with CSS currently it displays text by default
            if (engine.timing.timestamp >= 2000) {
                circle.style.opacity = 1;
            }
            });
        }
        // Run the Matter.js engine
        Matter.Runner.run(engine);
        Matter.Render.run(Matter.Render.create({
            element: container,
            engine: engine,
            options: {
                wireframes: false,
                background: "rgba(0, 0, 0, 0)",
                showVelocity: true,
                width: "100%", // Set the width to "100%"
                height: "100%" // Set the height to "100%"
            }
        }));
    }
  
    // Function to initialize the circles
    function initCircles() {
      const container = document.getElementById("assetBasket");
      createRandomCircles(container);
    }
  
    // Call the function to initialize the circles
    initCircles();
}

// Export the fetch functions
export { updateChartValues_Hedge, updateChartValues_Assets };
  
  