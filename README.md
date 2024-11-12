The Liszt Portal sitepackage
============================

[![TYPO3 11](https://img.shields.io/badge/TYPO3-11-orange.svg)](https://get.typo3.org/version/11)
[![CC-BY](https://img.shields.io/github/license/slub/liszt_web)](https://github.com/slub/liszt_web/blob/main/LICENSE)

The Liszt Portal is the central musicological source for information on the 19th century pianist and composer Franz Liszt.
It is available under [liszt-portal.de](https://liszt-portal.de).
The Liszt Portal is developed by the Digital Franz Liszt Catalogue Raisonné project, funded by the German Research Foundation DFG.

# Scope of the sitepackage

The sitepackage depends on the portal's application modules.
These include:

- [the catalogue raisonné module](https://github.com/slub/liszt_catalograisonne) (not yet implemented)
- [the bibliography module](https://github.com/slub/liszt_bibliography) (not yet implemented)

The sitepackage defines the markup and stylings for the portal.

# Installation and Deployment

Composer require the package in a TYPO3 installation. The ddev container can be
found [here](https://github.com/dikastes/ddev-liszt-portal-v12). It contains JS
files needed for deployment. Copy them if you deploy the portal outside a
dockerized environment. The needed files are:

- package.json
- vite-production.config.js
- vite.config.js (for development)
- package-lock.json (if you want to be safe)

# Features

## Staff record type

Staff records contain basic information on staff members and may be used in the
[Team](#team-content-element) or [Publications](#publications-content-element) 
content elements.  We would advise to store the records in a designated folder.

## Team content element

Displays a page of team members which are grouped.  You can add and name any
number of groups.  Here you can insert staff records.  There are two fixed groups 
(board and assistants) which contain simple string records.

## Publications content element

Displays a page of publications and presentations.  Staff records are used to
store the information on the authors.  Every author must have a staff record.

## Other features

The sitepackage contains a number of other content elements which are self
explaining:

- a page teaser
- an icon based page teaser
- a news listing
- image and image/text elements
- a milestones element (not yet operable)

# Content Blocks help

After changing the content blocks, and after running make commands, you need to
flush the cache and setup the extension again:

```
ddev typo3 cache:flush -g system
ddev typo3 extension:setup --extension=liszt_web
```

List content blocks:

```
ddev typo3 content-blocks:list
```

# Maintainers

If you have any questions or encounter any problems, please do not hesitate to contact us.
- [Matthias Richter](https://github.com/dikastes)
- [Thomas Schefter](https://github.com/thomas-sc)
