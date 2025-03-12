import { LineChart, BarChart } from 'chartist';

document.addEventListener('DOMContentLoaded', function() {
  // Check if any charts exist before proceeding
  const chartContainers = document.querySelectorAll('.filter-chart');
  if (chartContainers.length === 0) return;

  initializeAllCharts();

  function initializeAllCharts() {
    chartContainers.forEach(chartContainer => {
      // Find the associated slider by filter-key
      const filterKey = chartContainer.getAttribute('data-filter-key');
      const sliderContainer = document.querySelector(`.filter-slider[data-filter-key="${filterKey}"]`);

      if (!sliderContainer || !sliderContainer.facetData) return;

      try {
        // Use data from the slider
        const facetData = sliderContainer.facetData;
        const valueRange = sliderContainer.valueRange;

        // Create chart data
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

  // Create and render chart with current data range
  function createAndRenderChart(chartContainer, facetData, minValue, maxValue) {
    try {
      const currentYear = new Date().getFullYear(); // this is for year Values as data and should customizes for other int values
      const paddingStart = 5;
      const paddingEnd = Math.min(5, currentYear - maxValue);
      const chartData = {
        labels: [],
        series: [[]]
      };
      for (let value = minValue - paddingStart; value <= maxValue + paddingEnd; value++) {
        chartData.labels.push(value.toString());
        chartData.series[0].push(facetData[value] || 0);
      }
      const chartOptions = {
        height: 100,
        fullWidth: true,
        chartPadding: {
          right: 0,
          left: 0,
          top: 0,
          bottom: -20
        },
        low: 0,
        showPoint: false,
        showArea: true,
        lineSmooth: true,
        axisX: {
          showLabel: false,
          showGrid: false
        },
        axisY: {
          offset: 0,
          showLabel: false,
          showGrid: true
        }
      };
      // Choose chart type based on value range
      const valueRange = maxValue - minValue;
      if (valueRange < 25) {
        new BarChart(chartContainer, chartData, chartOptions);
      } else {
        new LineChart(chartContainer, chartData, chartOptions);
      }
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }
});
