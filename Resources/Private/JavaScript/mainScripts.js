// Import only needed Bootstrap components
// import { Dropdown, Collapse } from 'bootstrap';
import Dropdown from "bootstrap/js/dist/dropdown.js";
import Collapse from "bootstrap/js/dist/collapse.js";
import Offcanvas from "bootstrap/js/dist/offcanvas.js";

import PhotoSwipeLightbox from 'photoswipe/lightbox';

let lightboxImages = document.querySelectorAll('.lightbox');
Array.prototype.forEach.call(lightboxImages, function(el, i) {
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
lightbox.on('uiRegister', function() {
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
          const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
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
lightbox.on('uiRegister', function() {
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
          if(link.getAttribute('data-target-id') === entry.target.id){
            link.classList.add('active'); }
          else {
            link.classList.remove('active');
          } });
      } else {
        //  console.log("not intersecting", entry);
      }
    })
  }

  const observer = new IntersectionObserver(onIntersect, options);
  targets.forEach(target => observer.observe(target));

}

