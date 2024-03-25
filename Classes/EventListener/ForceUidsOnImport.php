<?php

declare(strict_types=1);

/*
 * This file is part of the TYPO3 project template.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read
 * the LICENSE file that was distributed with this source code.
 */

namespace Slub\LisztWeb\EventListener;

use TYPO3\CMS\Impexp\Event\BeforeImportEvent;

/**
 * Event listener used to force uids on importing the basic site data.
 * This is required to have the page ids matching the site configuration, e.g. 404 page.
 */
class ForceUidsOnImport
{
    public function __invoke(BeforeImportEvent $event): void
    {
        // @todo Explicitly check for the file being imported, once this information is available in the PSR-14 event
        $event->getImport()->setForceAllUids(true);
    }
}
