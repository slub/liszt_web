import { LineChart, BarChart } from 'chartist';

document.addEventListener('DOMContentLoaded', function() {
  const chartContainers = document.querySelectorAll('.filter-chart');
  if (chartContainers.length === 0) return;

  const chartInstances = new Map(); // Store chart instances to properly clean up on re-render
  let resizeTimeout;

  initializeAllCharts();
  setupResizeListener();

  function initializeAllCharts() {
    chartContainers.forEach(chartContainer => {
      // Find the associated slider by filter-key
      const filterKey = chartContainer.getAttribute('data-filter-key');
      const sliderContainer = document.querySelector(`.filter-slider[data-filter-key="${filterKey}"]`);

      if (!sliderContainer || !sliderContainer.facetData) return;

      try {
        // Use data from slider
        const facetData = sliderContainer.facetData;
        const valueRange = sliderContainer.valueRange;

        createAndRenderChart(chartContainer, facetData, valueRange.current.min, valueRange.current.max);

        // Event listener for slider changes
        sliderContainer.addEventListener('sliderRangeChange', function(e) {
          createAndRenderChart(chartContainer, facetData, e.detail.minValue, e.detail.maxValue);
        });

      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    });
  }

  function calculateThresholds(containerWidth) {
    if (containerWidth >= 600) {
      return {
        showLabelsThreshold: 18,
        barChartThreshold: 18
      };
    } else if (containerWidth >= 400) {
      return {
        showLabelsThreshold: 12,
        barChartThreshold: 12
      };
    } else {
      return {
        showLabelsThreshold: 7,
        barChartThreshold: 10
      };
    }
  }

  function createAndRenderChart(chartContainer, facetData, minValue, maxValue) {
    try {
      const chartData = {
        labels: [],
        series: [[]]
      };

      const allYears = [];
      for (let year = minValue; year <= maxValue; year++) {
        allYears.push(year.toString());
      }

      allYears.forEach(year => {
        chartData.labels.push(year);
        chartData.series[0].push(facetData[year] || 0);
      });

      const dataPointCount = allYears.length;
      const isVisible = chartContainer.offsetParent !== null;

      // Hidden containers (e.g., in inactive tabs) have no width, estimate based on viewport
      let containerWidth;
      if (isVisible) {
        containerWidth = chartContainer.offsetWidth || chartContainer.clientWidth;
      } else {
        containerWidth = window.innerWidth > 1200 ? 800 :
          window.innerWidth > 768 ? 600 :
            window.innerWidth - 100;
      }

      const thresholds = calculateThresholds(containerWidth);

      const chartOptions = {
        fullWidth: true,
        chartPadding: {
          right: -10,
          left: 0,
          top: 0,
          bottom: -20
        },
        low: 0,
        showPoint: false,
        showArea: true,
        lineSmooth: false, // for precise tooltip position over the chart use lineSmooth: false
        axisX: {
          showLabel: dataPointCount <= thresholds.showLabelsThreshold,
          showGrid: false
        },
        axisY: {
         //offset:20,
          showLabel: true,
          showGrid: true,
          position: 'end',
          onlyInteger: true,
          labelInterpolationFnc: function(value) {
            return Number.isInteger(value) ? value : null;
          }
        }
      };

      // Clean up previous chart instance to prevent memory leaks
      const oldChart = chartInstances.get(chartContainer);
      if (oldChart && oldChart.detach) {
        oldChart.detach();
      }

      let chart;
      if (dataPointCount <= thresholds.barChartThreshold) {
        chart = new BarChart(chartContainer, chartData, chartOptions);
        addChartTooltip(chartContainer, chartData, 'bar');
      } else {
        chart = new LineChart(chartContainer, chartData, chartOptions);
        addChartTooltip(chartContainer, chartData, 'line');
      }

      chartInstances.set(chartContainer, chart);

    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }

  function addChartTooltip(chartContainer, chartData, chartType = 'line') {
    let tooltip = chartContainer.querySelector('.filter-chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'filter-chart-tooltip';
      chartContainer.appendChild(tooltip);
    }

    let verticalLine = chartContainer.querySelector('.filter-chart-indicator');
    if (!verticalLine) {
      verticalLine = document.createElement('div');
      verticalLine.className = 'filter-chart-indicator';
      chartContainer.appendChild(verticalLine);
    }

    // Remove old event listeners to prevent duplicates when chart is re-rendered
    const oldMouseMove = chartContainer._tooltipMouseMove;
    const oldMouseLeave = chartContainer._tooltipMouseLeave;

    if (oldMouseMove) {
      chartContainer.removeEventListener('mousemove', oldMouseMove);
    }
    if (oldMouseLeave) {
      chartContainer.removeEventListener('mouseleave', oldMouseLeave);
    }

    const handleMouseMove = function(event) {
      const rect = chartContainer.getBoundingClientRect();
      const svg = chartContainer.querySelector('svg');
      const chartHeight = rect.height;
      const mouseX = event.clientX - rect.left;

      if (chartType === 'bar') {
        const bars = svg.querySelectorAll('.ct-bar');
        if (bars.length === 0) return;

        const barPositions = [];
        bars.forEach(bar => {
          const x1 = parseFloat(bar.getAttribute('x1'));
          const x2 = parseFloat(bar.getAttribute('x2'));
          if (!isNaN(x1) && !isNaN(x2)) {
            const centerX = (x1 + x2) / 2;
            barPositions.push(centerX);
          }
        });

        if (barPositions.length === 0) return;

        let closestIndex = -1;
        let minDistance = Infinity;

        barPositions.forEach((barCenter, index) => {
          const distance = Math.abs(mouseX - barCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex >= 0 && closestIndex < chartData.labels.length) {
          const year = chartData.labels[closestIndex];
          const value = chartData.series[0][closestIndex];
          const centerX = barPositions[closestIndex];

          const maxValue = Math.max(...chartData.series[0]);
          const yRatio = maxValue > 0 ? value / maxValue : 0;
          const pointY = chartHeight - (yRatio * (chartHeight - 40)) - 20;

          tooltip.textContent = `${year}: ${value}`;
          tooltip.style.display = 'block';
          tooltip.style.left = `${centerX}px`;
          tooltip.style.top = `${pointY - 45}px`;

          verticalLine.style.display = 'block';
          verticalLine.style.left = `${centerX}px`;
        }

      } else {
        const path = svg.querySelector('.ct-line');
        if (!path) return;

        const pathD = path.getAttribute('d');
        let xCoords = [];

        const commands = pathD.match(/[ML]\s*[0-9.]+,[0-9.]+/g);

        if (commands && commands.length > 0) {
          commands.forEach((cmd) => {
            const coords = cmd.match(/([0-9.]+),([0-9.]+)/);
            if (coords) {
              const x = parseFloat(coords[1]);
              if (xCoords.length === 0 || Math.abs(x - xCoords[xCoords.length - 1]) > 1) {
                xCoords.push(x);
              }
            }
          });
        }

        if (xCoords.length > chartData.labels.length) {
          xCoords.length = chartData.labels.length;
        }

        if (xCoords.length !== chartData.labels.length) {
          const allXCoords = [];
          const allMatches = pathD.match(/[MLC]\s*([0-9.]+)/g);

          if (allMatches) {
            allMatches.forEach(m => {
              const x = parseFloat(m.match(/[MLC]\s*([0-9.]+)/)[1]);
              if (!isNaN(x)) allXCoords.push(x);
            });
          }

          const minX = Math.min(...allXCoords);
          const maxX = Math.max(...allXCoords);
          const drawingWidth = maxX - minX;
          const pointSpacing = drawingWidth / (chartData.labels.length - 1);

          xCoords = [];
          for (let i = 0; i < chartData.labels.length; i++) {
            xCoords.push(minX + (i * pointSpacing));
          }
        }

        if (xCoords.length === 0) return;

        let closestIndex = -1;
        let minDistance = Infinity;

        xCoords.forEach((pointX, index) => {
          if (index < chartData.labels.length) {
            const distance = Math.abs(mouseX - pointX);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          }
        });

        if (closestIndex >= 0 && closestIndex < chartData.labels.length) {
          const year = chartData.labels[closestIndex];
          const value = chartData.series[0][closestIndex];
          const centerX = xCoords[closestIndex];

          const maxValue = Math.max(...chartData.series[0]);
          const yRatio = maxValue > 0 ? value / maxValue : 0;
          const pointY = chartHeight - (yRatio * (chartHeight - 40)) - 20;

          tooltip.textContent = `${year}: ${value}`;
          tooltip.style.display = 'block';
          tooltip.style.left = `${centerX}px`;
          tooltip.style.top = `${pointY - 45}px`;

          verticalLine.style.display = 'block';
          verticalLine.style.left = `${centerX}px`;
        }
      }
    };

    const handleMouseLeave = function() {
      tooltip.style.display = 'none';
      verticalLine.style.display = 'none';
    };

    chartContainer.addEventListener('mousemove', handleMouseMove);
    chartContainer.addEventListener('mouseleave', handleMouseLeave);

    chartContainer._tooltipMouseMove = handleMouseMove;
    chartContainer._tooltipMouseLeave = handleMouseLeave;
  }

  // Re-render charts on window resize to recalculate bar/line chart thresholds
  function setupResizeListener() {
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        chartContainers.forEach(chartContainer => {
          const filterKey = chartContainer.getAttribute('data-filter-key');
          const sliderContainer = document.querySelector(`.filter-slider[data-filter-key="${filterKey}"]`);

          if (!sliderContainer || !sliderContainer.facetData || !sliderContainer.sliderInstance) return;

          // Use current slider values instead of initial values
          createAndRenderChart(
            chartContainer,
            sliderContainer.facetData,
            sliderContainer.sliderInstance.getMinValue(),
            sliderContainer.sliderInstance.getMaxValue()
          );
        });
      }, 250);
    });
  }
});
