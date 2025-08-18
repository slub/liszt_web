
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



// Enhanced detail view with paging via POST request (from search result list)
window.detailViewNavigation = function(linkElement, event, action = null) {
  event.preventDefault();

  let searchContext = null;
  let dataAttributeName = 'data-search-context';

  // Try to get search context from data-search-context attribute first (used by DetailPageNavigation)
  let contextJson = linkElement.getAttribute('data-search-context');

  // If not found, try data-navigation-context (used by SearchResultItem-bibliography)
  if (!contextJson || contextJson.trim() === '') {
    contextJson = linkElement.getAttribute('data-navigation-context');
    dataAttributeName = 'data-navigation-context';
  }

  // Parse context if available
  if (contextJson && contextJson.trim() !== '') {
    try {
      // Check if it contains Fluid syntax that wasn't rendered
      const fluidSyntaxPatterns = ['{f:format.json', 'searchContext.', 'navigationBase.'];
      const hasUnrenderedFluid = fluidSyntaxPatterns.some(pattern => contextJson.includes(pattern));

      if (hasUnrenderedFluid) {
        console.error(`Context contains unrendered Fluid syntax in ${dataAttributeName}:`, contextJson);
        searchContext = null;
      } else {
        const parsedContext = JSON.parse(contextJson);

        // Handle different context structures
        if (dataAttributeName === 'data-navigation-context') {
          // combine with window search params
          const searchParams = window.searchParamsData || {};
          searchContext = {
            ...searchParams,
            navigation: {
              currentPosition: parsedContext.currentPosition,
              totalResults: parsedContext.totalResults,
              currentPage: parsedContext.currentPage,
              itemsPerPage: parsedContext.itemsPerPage,
              currentScore: parsedContext.currentScore,
              currentSortValues: parsedContext.currentSortValues || []
            }
          };
        } else {
          // For DetailPageNavigation: use context as-is
          searchContext = parsedContext;
        }
      }
    } catch (e) {
      console.error('Failed to parse context:', e);
      console.error('Raw content:', contextJson);
    }
  }

  // Fallback: Get search parameters from window variable if context parsing failed
  if (!searchContext && window.searchParamsData) {
    searchContext = window.searchParamsData;
    console.log('Using fallback search params from window variable:', searchContext);
  }

  // If no search context available, use normal link
  if (!searchContext || Object.keys(searchContext).length === 0) {
    console.warn('No search context available, using normal link navigation');
    window.location.href = linkElement.href;
    return false;
  }

  // Add navigation action to context if provided (for prev/next navigation)
  if (action && searchContext.navigation) {
    searchContext.navigation.action = action;
  }

  // Create POST form with complete search context
  createPostForm(linkElement.href, searchContext);
  return false;
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
