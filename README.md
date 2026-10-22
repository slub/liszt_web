# The Liszt Portal sitepackage

[![TYPO3 12](https://img.shields.io/badge/TYPO3-12-orange.svg)](https://get.typo3.org/version/12)
[![License](https://img.shields.io/github/license/slub/liszt_web)](LICENSE)

The Liszt Portal is the central musicological source for information on the
19th-century pianist and composer Franz Liszt. It is available at
[liszt-portal.de](https://liszt-portal.de). The portal is developed by the
Digital Franz Liszt Catalogue Raisonné project, funded by the German Research
Foundation (DFG).

This repository is a TYPO3 sitepackage extension (`liszt_web`). It provides
the site's markup, styling, and Content Blocks-based content elements. It
depends on the portal's application modules and does not run standalone.

## Scope

The sitepackage depends on the portal's application modules:

- [the catalogue raisonné module](https://github.com/slub/liszt_catalograisonne)
- [the bibliography module](https://github.com/slub/liszt_bibliography)

## Tech stack

- TYPO3 CMS ^12.0
- PHP, PSR-4 autoloaded under `Slub\LisztWeb\` (`Classes/`)
- [Content Blocks](https://github.com/TYPO3-Initiatives/content-blocks) (`friendsoftypo3/content-blocks` ^0.7.19) for content elements and page types
- Fluid templates (`Resources/Private/`)
- SCSS (`Resources/Private/Scss/`) and JavaScript (`Resources/Private/JavaScript/`), built via Vite (`praetorius/vite-asset-collector` ^1.9) — Vite config itself lives outside this repo (see Installation)
- Composer dependencies: `quellenform/t3x-iconpack`, `illuminate/collections`, `b13/doktypemapper`

## Installation

Require the package in a TYPO3 installation via Composer:

```bash
composer require slub/liszt-web
```

A ready-to-use DDEV development container is maintained separately:
[ddev-liszt-portal-v13](https://github.com/dikastes/ddev-liszt-portal-v13).
It provides the JS/Vite tooling
needed to build frontend assets. If deploying this sitepackage outside that
container, copy these files from it first:

- `package.json`
- `vite.config.js`
- `package-lock.json` (recommended, for reproducible installs)

## Build

Frontend assets (SCSS, JS) are built with Vite, using the config files copied
in from the DDEV container above. No build tooling ships in this repository
itself; the actual npm scripts, taken from that container's `package.json`,
are:

```bash
npm install
npm run watch             # vite build --watch --mode development
npm run build:development # vite build --mode development
npm run build:production  # vite build --mode production
```

Note: this repo's `composer.json` pins `typo3/cms-core: ^12.0`, but the dev
container is `ddev-liszt-portal-v13` (TYPO3 ^13.0) — version mismatch not
resolved here, flagged for whoever owns the upgrade.

## Content Blocks

After changing Content Blocks definitions or running Composer/make commands,
flush the cache and re-run extension setup:

```bash
ddev typo3 cache:flush -g system
ddev typo3 extension:setup --extension=liszt_web
```

List defined content blocks:

```bash
ddev typo3 content-blocks:list
```

## Testing

No test suite, CI workflow, or test command is present in this repository.

## Features

### Staff record type

Staff records hold basic information on staff members. They can be used in
the [Team](#team-content-element) or [Publications](#publications-content-element)
content elements. Store staff records in a dedicated folder.

### Team content element

Displays a page of team members, grouped. You can add and name any number of
groups. Two fixed groups (board and assistants) hold simple string records.
Other groups link staff records.

### Publications content element

Displays a page of publications and presentations. Every author must have a
staff record. Implemented as the `output` Content Block
(`ContentBlocks/ContentElements/output/`, type name `slub_output`).

### Other content elements

- a page teaser
- an icon-based page teaser
- a news listing
- image and image/text elements
- a milestones element

## Configuration

- `ContentBlocks/ContentElements/` — Content Blocks content elements (team, output, newslist, milestones, pageteaser, teasericons, imagetext, headline, image)
- `ContentBlocks/PageTypes/` — Content Blocks page types (`LisztSidebarPage`, `LisztHomePage`, `LisztNewsPage`)
- `ContentBlocks/RecordTypes/` — Content Blocks record types (`staff`)
- `Configuration/TypoScript/` — TypoScript setup, constants, and per-area setup files
- `Configuration/TCA/Overrides/` — TCA overrides for `sys_template` and `tt_content`
- `Configuration/RTE/` — RTE presets and processing
- `Configuration/Iconpack/` and `Configuration/Icons.php` — icon pack registration
- `ext_localconf.php` / `ext_emconf.php` — extension registration and metadata

## License

GNU General Public License v3.0. See [LICENSE](LICENSE).

Note: `composer.json` declares `GPL-2.0-or-later` while the `LICENSE` file
in this repository is the full GPLv3 text — this discrepancy is pre-existing
and not resolved by this README update.

## Maintainers

If you have any questions or encounter any problems, please do not hesitate
to contact us.

- [Matthias Richter](https://github.com/dikastes)

