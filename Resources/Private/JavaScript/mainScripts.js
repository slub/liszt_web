// Import only needed Bootstrap components
// import { Dropdown, Collapse } from 'bootstrap';
import Dropdown from "bootstrap/js/dist/dropdown.js";
import Collapse from "bootstrap/js/dist/collapse.js";
import Offcanvas from "bootstrap/js/dist/offcanvas.js";

import PhotoSwipeLightbox from 'photoswipe/lightbox';

let lightboxImages = document.querySelectorAll('.lightbox');
Array.prototype.forEach.call(lightboxImages, function (el, i) {
  var zoomIcon = '<span class="zoom-icon" aria-hidden="true"></span>';
  el.insertAdjacentHTML('beforeend', zoomIcon);
});

const options = {
  gallery: 'main',
  children: '.lightbox',
  pswpModule: () => import('photoswipe'),
  // Optional padding for images,
  paddingFn: (viewportSize) => {
    return {
      top: 10, bottom: 80, left: 10, right: 10
    }
  },
};

const lightbox = new PhotoSwipeLightbox(options);
lightbox.on('uiRegister', function () {
  lightbox.pswp.ui.registerElement({
    name: 'custom-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: 'Caption text',
    onInit: (el, pswp) => {
      lightbox.pswp.on('change', () => {
        const currSlideElement = lightbox.pswp.currSlide.data.element;
        let captionHTML = '';
        if (currSlideElement) {
          const hiddenCaption = currSlideElement.querySelector('.figure-caption');
          if (hiddenCaption) {
            // get caption from element with class hidden-caption-content
            captionHTML = hiddenCaption.innerHTML;
          } else {
            // get caption from alt attribute
            captionHTML = currSlideElement.querySelector('img').getAttribute('alt');
          }
        }
        el.innerHTML = captionHTML || '';
      });
    }
  });
});
lightbox.on('uiRegister', function () {
  lightbox.pswp.ui.registerElement({
    name: 'zoom-level-indicator',
    order: 9,
    onInit: (el, pswp) => {
      pswp.on('zoomPanUpdate', (e) => {
        if (e.slide === pswp.currSlide) {
          el.innerText = 'Zoom level: ' + Math.round(pswp.currSlide.currZoomLevel * 100) + '%';
        }
      });
    }
  });
});
lightbox.init();


// Intersection Observer for highlighting active items in Sticky Menu

const targetLinks = document.querySelectorAll(('[data-target-id]'));

// start only if targetLinks exists
if (targetLinks.length > 0) {

  const options = {
    rootMargin: `0px 0px -85% 0px`,
    threshold: 0.1
  }

  const targetIds = Array.from(targetLinks).map(element => element.getAttribute('data-target-id'));
  const targets = targetIds.map(id => document.getElementById(id));
// console.log(targetIds);

  const onIntersect = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        //   console.log(entry.target.id, 'is intersecting')
        targetLinks.forEach(link => {
          if (link.getAttribute('data-target-id') === entry.target.id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      } else {
        //  console.log("not intersecting", entry);
      }
    })
  }

  const observer = new IntersectionObserver(onIntersect, options);
  targets.forEach(target => observer.observe(target));

}


/**
 * Retrieves the translation from the TYPO3.lang object.
 * @param {string} key - The key of the translation (e.g., "liszt_web.show-more").
 * @param {string} fallback - The default value if the key does not exist.
 * @returns {string} - The translated text or the fallback.
 */
function getTranslation(key, fallback = '') {
  if (TYPO3 && TYPO3.lang && typeof TYPO3.lang[key] !== 'undefined') {
    return TYPO3.lang[key];
  }
  return fallback; // Return value in case the key is missing
}


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


// Speculation Rules for preload Links with class .prefetch-link (for faster view transitions on news pages)
// this is the fallback for firefox, safari. Chrome and Edge support <script type="speculationrules"> from 1.page.typoscript
// Feature-Detection für Speculation Rules
const supportsSpeculationRules =
  HTMLScriptElement.supports?.('speculationrules') ?? false;

if (!supportsSpeculationRules) {
  // Fallback: Traditionelles Prefetching
  const links = document.querySelectorAll('.prefetch-link');

  // Feature-Detection für rel=prefetch [3][7]
  const supportsPrefetch = (() => {
    try {
      const link = document.createElement('link');
      return link.relList?.supports('prefetch');
    } catch {
      return false;
    }
  })();

  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      if (supportsPrefetch) {
        // Prefetch via <link> [4][7]
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      } else {
        // Letzter Fallback: XHR-Prefetch
        fetch(link.href, {mode: 'no-cors'});
      }
    }, {once: true});
  });
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




