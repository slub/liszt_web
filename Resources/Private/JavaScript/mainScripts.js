// Import only needed Bootstrap components ToDo:  spilt later to separate files an call from used pages?

import { Dropdown, Collapse } from 'bootstrap';
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

