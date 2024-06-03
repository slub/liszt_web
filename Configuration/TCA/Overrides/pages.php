<?php

defined('TYPO3') or die();

$GLOBALS['TCA']['pages']['columns']['image'] = [
    'label' => 'LLL:EXT:liszt_web/Resources/Private/Language/locallang.xlf:liszt_web.image',
    'config' => [
        'allowed' => 'common-image-types',
        'maxitems' => 1,
        'type' => 'file'
    ]
];

$GLOBALS['TCA']['pages']['types']['image'] = [
    'previewRenderer' => 'TYPO3\CMS\Frontend\Preview\ImagePreviewRenderer',
    'showitem' => '--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general, --palette--;;general, --palette--;;headers, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.images, image, --palette--;;mediaAdjustments, --palette--;;gallerySettings, --palette--;;imagelinks, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance, --palette--;;frames, --palette--;;appearanceLinks, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language, --palette--;;language, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access, --palette--;;hidden, --palette--;;access, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories, categories, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes, rowDescription, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended'
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addFieldsToPalette('pages', 'standard', '--linebreak--, image', 'after:type');
