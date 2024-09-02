Sitepackage for the project "Liszt-Portal"
==============================================================

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
