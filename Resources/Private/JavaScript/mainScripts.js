// Import only needed Bootstrap components ToDo:  spilt later to separate files an call from used pages?

// import { Dropdown, Collapse } from 'bootstrap';
import Dropdown from "bootstrap/js/dist/dropdown.js";
import Collapse from "bootstrap/js/dist/collapse.js";
import Offcanvas from "bootstrap/js/dist/offcanvas.js";
import Parvus from 'parvus'
import de from 'parvus/src/l10n/de'

/*
// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  })
*/

const prvs = new Parvus({
  l10n: de,
//  captionsSelector: '.figure-caption',
 lightboxIndicatorIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none"  stroke-width="1.5" stroke="currentColor" focusable="false"> <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>',
})


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

