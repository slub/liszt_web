import htmx from 'htmx.org';
window.htmx = htmx;

/**
 * Initialize filter search functionality for HTMX-loaded content
 */
function initializeFilterSearch() {
  const searchInputs = document.querySelectorAll('.filter-search-input');

  searchInputs.forEach(searchInput => {
    // Skip if already initialized
    if (searchInput.hasAttribute('data-search-initialized')) return;

    searchInput.setAttribute('data-search-initialized', 'true');
    setupSearchFunctionality(searchInput);
  });
}

/**
 * Sets up search functionality for a search input
 * @param {HTMLInputElement} searchInput - The search input field
 */
function setupSearchFunctionality(searchInput) {
  const container = searchInput.closest('div').parentElement;
  const list = container.querySelector('ul[data-filter-key]');
  const searchInfo = searchInput.nextElementSibling;
  const items = Array.from(list.querySelectorAll('li'));
  let searchTimeout;

  // Store original display states
  items.forEach(item => {
    item.setAttribute('data-original-display', getComputedStyle(item).display);
  });

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();

    // Clear previous timeout
    clearTimeout(searchTimeout);

    // Debounce search for performance
    searchTimeout = setTimeout(() => {
      filterItems(items, searchTerm, searchInfo);
    }, 200);
  });

  // Handle keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstVisibleItem = list.querySelector('li:not([style*="display: none"]) a, li:not([style*="display: none"]) button');
      if (firstVisibleItem) {
        firstVisibleItem.focus();
      }
    }
  });
}
/**
 * Filters list items based on search term
 * @param {Array} items - Array of list items
 * @param {string} searchTerm - The search term
 * @param {HTMLElement} searchInfo - Element for accessibility announcements
 */
function filterItems(items, searchTerm, searchInfo) {
  let visibleCount = 0;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const isVisible = searchTerm === '' || text.includes(searchTerm);

    if (isVisible) {
      item.style.display = item.getAttribute('data-original-display') || '';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  // Get translations or use fallbacks
  const totalCount = items.length;
  let message = '';

  if (searchTerm === '') {
    // Use TYPO3 translation if available
    message = getTranslation('liszt_common.filter_search_showing_all', `Showing all ${totalCount} filter options`)
      .replace('{0}', totalCount);
  } else {
    message = getTranslation('liszt_common.filter_search_showing_filtered', `Showing ${visibleCount} of ${totalCount} filter options for "${searchTerm}"`)
      .replace('{0}', visibleCount)
      .replace('{1}', totalCount)
      .replace('{2}', searchTerm);
  }

  searchInfo.textContent = message;

  // If no results, announce it
  if (visibleCount === 0 && searchTerm !== '') {
    message = getTranslation('liszt_common.filter_search_no_results', `No filter options found for "${searchTerm}"`)
      .replace('{0}', searchTerm);
    searchInfo.textContent = message;
  }
}

/**
 * Get translation from TYPO3.lang or return fallback
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text
 * @returns {string} Translated text
 */
function getTranslation(key, fallback = '') {
  if (typeof TYPO3 !== 'undefined' && TYPO3.lang && typeof TYPO3.lang[key] !== 'undefined') {
    return TYPO3.lang[key];
  }
  return fallback;
}


// Initialize search when HTMX content is loaded
document.addEventListener('htmx:afterSettle', function(event) {
  initializeFilterSearch();
});

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeFilterSearch();
});
