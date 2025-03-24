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

  function createAndRenderChart(chartContainer, facetData, minValue, maxValue) {
    try {
      const chartData = {
        labels: [],
        series: [[]]
      };

      // Generate the complete range from minValue to maxValue
      // regardless of whether data exists
      const allYears = [];
      for (let year = minValue; year <= maxValue; year++) {
        allYears.push(year.toString());
      }

      // Fill chart data for all years in range
      allYears.forEach(year => {
        chartData.labels.push(year);
        chartData.series[0].push(facetData[year] || 0);
      });

      // Calculate number of datapoints in chart for labels
      const dataPointCount = allYears.length;

      // Count datapoints with values greater than 0
/*      let dataPointsWithValues = 0;
      allYears.forEach(year => {
        if (facetData[year] && facetData[year] > 0) {
          dataPointsWithValues++;
        }
      });*/

      const chartOptions = {
        height: 100,
        fullWidth: true,
        chartPadding: {
          right:-10,
          left: 0,
          top: 0,
          bottom: -10
        },
        low: 0,
        showPoint: false,
        showArea: true,
        lineSmooth: true,
        axisX: {
          // if the total range has fewer than 7 years
          showLabel: dataPointCount < 7,
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

      // Choose chart type based on number of dataPoints
      if (dataPointCount < 20) {
        new BarChart(chartContainer, chartData, chartOptions);
      } else {
        new LineChart(chartContainer, chartData, chartOptions);
      }
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }
});
