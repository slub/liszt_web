
// ToDo: outsource to own entrypoints with new vite plugin and asset collector version
// Range Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeAllSliders();

  function initializeAllSliders() {
    const sliderContainers = document.querySelectorAll('.filter-slider');

    sliderContainers.forEach(sliderContainer => {
      const dataScript = sliderContainer.querySelector('.slider-data');
      if (!dataScript) return;

      try {
        // Parse the facet data
        const facetData = JSON.parse(dataScript.textContent);

        // Filter and sort values
        const currentTime = new Date().getFullYear(); // this is for year Values as data and should customize for other int values
        const validValues = Object.keys(facetData)
          .map(value => value.trim())
          .filter(value => value.length === 4 && !isNaN(parseInt(value)) && parseInt(value) <= currentTime)
          .sort((a, b) => parseInt(a) - parseInt(b));

        if (validValues.length === 0) return;

        // Determine min/max values from data
        const minValue = parseInt(validValues[0]);
        const maxValue = parseInt(validValues[validValues.length - 1]);

        // Check data attributes
        const rangeStartAttr = sliderContainer.getAttribute('data-range-start');
        const rangeEndAttr = sliderContainer.getAttribute('data-range-end');

        // Use attributes if they are valid
        const hasValidRangeStart = rangeStartAttr &&
          rangeStartAttr !== '0' &&
          rangeStartAttr !== 'auto' &&
          !isNaN(parseInt(rangeStartAttr));

        const hasValidRangeEnd = rangeEndAttr &&
          rangeEndAttr !== '0' &&
          rangeEndAttr !== 'auto' &&
          !isNaN(parseInt(rangeEndAttr));

        // Set current values based on attributes or data
        const currentMinValue = hasValidRangeStart ? parseInt(rangeStartAttr) : minValue;
        const currentMaxValue = hasValidRangeEnd ? parseInt(rangeEndAttr) : maxValue;

        // Select DOM elements
        const container = sliderContainer.querySelector('.filter-slider-container');
        const range = sliderContainer.querySelector('.slider-range');
        const minHandle = sliderContainer.querySelector('.handle-min');
        const maxHandle = sliderContainer.querySelector('.handle-max');
        const minInput = sliderContainer.querySelector('.min-range-input');
        const maxInput = sliderContainer.querySelector('.max-range-input');

        // Initialize the slider
        const sliderInstance = initializeRangeSlider(container, range, minHandle, maxHandle,
          minInput, maxInput, minValue, maxValue,
          currentMinValue, currentMaxValue);

        // Store slider data and instance for potential chart use
        sliderContainer.sliderInstance = sliderInstance;
        sliderContainer.facetData = facetData;
        sliderContainer.valueRange = {
          min: minValue,
          max: maxValue,
          current: {
            min: currentMinValue,
            max: currentMaxValue
          }
        };

        // Dispatch an initial event for any listeners (like charts)
        const rangeChangeEvent = new CustomEvent('sliderRangeChange', {
          detail: {
            minValue: currentMinValue,
            maxValue: currentMaxValue
          }
        });
        sliderContainer.dispatchEvent(rangeChangeEvent);

      } catch (error) {
        console.error('Error initializing slider:', error);
      }
    });
  }


  function initializeRangeSlider(container, range, minHandle, maxHandle, minInput, maxInput,
                                 minValue, maxValue, initialMinValue, initialMaxValue) {
    // Set default values
    let currentMinValue = initialMinValue;
    let currentMaxValue = initialMaxValue;

    // Initialize input fields
    minInput.value = currentMinValue;
    maxInput.value = currentMaxValue;
    minInput.min = minValue;
    minInput.max = maxValue;
    maxInput.min = minValue;
    maxInput.max = maxValue;

    // Conversion functions
    function valueToPosition(value) {
      const sliderWidth = container.offsetWidth;
      return ((value - minValue) / (maxValue - minValue)) * sliderWidth;
    }

    function positionToValue(position) {
      const sliderWidth = container.offsetWidth;
      return Math.round(((position / sliderWidth) * (maxValue - minValue)) + minValue);
    }

    // Update slider
    function updateSlider() {
      const minPos = valueToPosition(currentMinValue);
      const maxPos = valueToPosition(currentMaxValue);

      minHandle.style.left = `${minPos}px`;
      maxHandle.style.left = `${maxPos}px`;
      range.style.left = `${minPos}px`;
      range.style.width = `${maxPos - minPos}px`;

      minInput.value = currentMinValue;
      maxInput.value = currentMaxValue;

      // Prüfen, ob sich die Werte vom Ursprungszustand unterscheiden
      const valuesChanged = (currentMinValue !== initialMinValue || currentMaxValue !== initialMaxValue);

      // Submit-Button ein- oder ausblenden
      const filterSlider = container.closest('.filter-slider');
      const submitButton = filterSlider.querySelector('.filter-slider-submit');

      if (valuesChanged) {
        submitButton.classList.add('show');
      } else {
        submitButton.classList.remove('show');
      }

      // Trigger event to update the chart if present
      const rangeChangeEvent = new CustomEvent('sliderRangeChange', {
        detail: {
          minValue: currentMinValue,
          maxValue: currentMaxValue
        }
      });
      filterSlider.dispatchEvent(rangeChangeEvent);
    }


    // Drag functionality
    let activeHandle = null;

    function startDrag(e, handle) {
      activeHandle = handle;
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('touchend', stopDrag);
      e.preventDefault();
    }

    function drag(e) {
      if (!activeHandle) return;

      const containerRect = container.getBoundingClientRect();
      let position;

      // Support for touch events
      if (e.type === 'touchmove') {
        position = e.touches[0].clientX - containerRect.left;
      } else {
        position = e.clientX - containerRect.left;
      }

      position = Math.max(0, Math.min(position, container.offsetWidth));
      const value = positionToValue(position);

      if (activeHandle === minHandle) {
        if (value < currentMaxValue) {
          currentMinValue = value;
        }
      } else {
        if (value > currentMinValue) {
          currentMaxValue = value;
        }
      }

      updateSlider();
    }

    function stopDrag() {
      activeHandle = null;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', stopDrag);
    }

    // Event listeners for handles
    minHandle.addEventListener('mousedown', (e) => startDrag(e, minHandle));
    maxHandle.addEventListener('mousedown', (e) => startDrag(e, maxHandle));
    minHandle.addEventListener('touchstart', (e) => startDrag(e, minHandle));
    maxHandle.addEventListener('touchstart', (e) => startDrag(e, maxHandle));

    // Event listeners for input fields
    minInput.addEventListener('change', () => {
      const value = parseInt(minInput.value);
      if (value >= minValue && value < currentMaxValue) {
        currentMinValue = value;
        updateSlider();
      } else {
        minInput.value = currentMinValue;
      }
    });

    maxInput.addEventListener('change', () => {
      const value = parseInt(maxInput.value);
      if (value <= maxValue && value > currentMinValue) {
        currentMaxValue = value;
        updateSlider();
      } else {
        maxInput.value = currentMaxValue;
      }
    });

    // Monitor window resize
    window.addEventListener('resize', updateSlider);

    // Initial rendering
    updateSlider();

    // Return slider instance for external use
    return {
      getMinValue: () => currentMinValue,
      getMaxValue: () => currentMaxValue,
      setValues: (min, max) => {
        if (min >= minValue && min < max && max <= maxValue) {
          currentMinValue = min;
          currentMaxValue = max;
          updateSlider();
          return true;
        }
        return false;
      }
    };
  }
});
