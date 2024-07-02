<?php

defined('TYPO3') or die();

$GLOBALS['TCA']['tt_content']['columns']['slub_pageteaser_pageteaseruid']['config']['size'] = 1;
$GLOBALS['TCA']['tt_content']['columns']['slub_pageteaser_pageteaseruid']['config']['elementBrowserEntryPoint'] = [
    '_default_' => '###CURRENT_PID###'
];
$GLOBALS['TCA']['tt_content']['columns']['slub_pageteaser_pageteaseruid']['config']['fieldControl'] = [
    'editPopup' => ['disabled' => true],
    'addRecord' => ['disabled' => true],
    'listModule' => ['disabled' => true]
];
