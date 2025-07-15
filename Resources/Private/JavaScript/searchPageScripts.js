
// Toggle Facet Filters
const filterToggler = document.querySelectorAll('.filter-block-toggler');

filterToggler.forEach((button) => {
  // event listener for each button
  button.addEventListener('click', () => {

    // view transition animation
    // Fallback for browsers that don't support this API:
    //  if (!document.startViewTransition) {
    toggleFilterBlock(button);
    //     return;
    //  }

    // With a View Transition:
    /*    document.startViewTransition(() => {
          console.log("startViewTransition wird ausgeführt");
          toggleFilterBlock(button);
        });*/

  });

  // initial ARIA-Setup: set aria-expanded to "false", if not already done
  if (!button.hasAttribute('aria-expanded')) {
    button.setAttribute('aria-expanded', 'false');
  }

});

function toggleFilterBlock(button) {
  // Find ul element and potential "show all" button
  const ulElement = button.previousElementSibling;
  const showAllButton = button.nextElementSibling;

  // Expand to show items up to maxSize
  ulElement.classList.add('showMore');

  // Hide the "show more" button
  button.style.display = 'none';

  // Show the "show all" button ONLY if it exists and hasMoreThanMaxSize is true
  if (showAllButton && showAllButton.classList.contains('show-all-btn')) {
    showAllButton.style.display = 'inline-block';
  }

  // Set focus for accessibility
  const firstNewItem = ulElement.querySelector('.hidden');
  if (firstNewItem) {
    firstNewItem.setAttribute('tabindex', '-1');
    firstNewItem.focus();
  }
}


// Button script to clear input in SearchBar
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchbar-input');
  const clearButton = document.getElementById('searchbar-clearButton');
  // skip if these elements are not available
  if (!searchInput || !clearButton) {
    return;
  }

  // show clearButton if input is not empty on pageload
  if (searchInput.value.length > 0) {
    clearButton.classList.add('show');
  }

  searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      clearButton.classList.add('show');
    } else {
      clearButton.classList.remove('show');
    }
  });

  // reset input
  clearButton.addEventListener('click', function() {
    searchInput.value = '';
    clearButton.classList.remove('show');
    searchInput.focus();
  });
});



// Enhanced detail view with paging via POST request
window.detailViewWithPaging = function(linkElement, event) {
  event.preventDefault();

  // Get navigation context from data attribute
  const navigationContextJson = linkElement.getAttribute('data-navigation-context');
  console.log('Raw navigation context JSON:', navigationContextJson);

  let navigationContext = null;

  if (navigationContextJson && navigationContextJson.trim() !== '') {
    try {
      // Check if it contains Fluid syntax that wasn't rendered
      if (navigationContextJson.includes('{f:format.json') || navigationContextJson.includes('navigationBase.')) {
        console.error('Navigation context contains unrendered Fluid syntax:', navigationContextJson);
        navigationContext = null;
      } else {
        navigationContext = JSON.parse(navigationContextJson);
        console.log('Parsed Navigation Context:', navigationContext);
      }
    } catch (e) {
      console.error('Failed to parse navigation context:', e);
      console.error('Raw content:', navigationContextJson);
    }
  }

  // Get search parameters from window variable
  let searchParams = {};

  if (window.searchParamsData) {
    searchParams = window.searchParamsData;
    console.log('Search Params from window variable:', searchParams);
  } else {
    console.warn('No window.searchParamsData available');
  }

  // Create final search context
  const finalSearchContext = navigationContext ? {
    ...searchParams,
    navigation: {
      currentPosition: navigationContext.currentPosition,
      totalResults: navigationContext.totalResults,
      currentPage: navigationContext.currentPage,
      itemsPerPage: navigationContext.itemsPerPage,
      currentScore: navigationContext.currentScore,
      currentSortValues: navigationContext.currentSortValues || []
    }
  } : searchParams;

  console.log('Final Search Context:', finalSearchContext);

  // If no search context available, use normal link
  if (Object.keys(finalSearchContext).length === 0) {
    window.location.href = linkElement.href;
    return false;
  }

  // Create POST form with search context
  console.log('Creating POST form with URL:', linkElement.href);
  createPostForm(linkElement.href, finalSearchContext);
  return false;
};




window.detailNavigationWithContext = function(linkElement, event, navigationContext) {
  return window.detailViewWithPaging(linkElement, event, navigationContext);
};


function createPostForm(url, searchParams) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.style.display = 'none';

  // Add search parameters as hidden fields
  addParamsToForm(form, searchParams, 'searchContext');

  document.body.appendChild(form);
  form.submit();
}

function addParamsToForm(form, params, prefix = '') {
  for (const [key, value] of Object.entries(params)) {
    const fieldName = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      addParamsToForm(form, value, fieldName);
    } else {
      const field = document.createElement('input');
      field.type = 'hidden';
      field.name = fieldName;
      field.value = Array.isArray(value) ? JSON.stringify(value) : value;
      form.appendChild(field);
    }
  }
}
