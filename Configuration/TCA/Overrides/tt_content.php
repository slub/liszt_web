<?php

/*
 * This file is part of the package bk2k/bootstrap-package.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

defined('TYPO3') or die('Access denied.');

// Add Content Element
if (!is_array($GLOBALS['TCA']['tt_content']['types']['categorized_timeline'] ?? false)) {
    $GLOBALS['TCA']['tt_content']['types']['categorized_timeline'] = [];
}

// Add content element PageTSConfig
/*
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerPageTSConfigFile(
    'lisztportal-web',
    'Configuration/TsConfig/Page/ContentElement/Element/CategorizedTimeline.tsconfig',
    'Liszt Portal Content Element: Categorized Timeline'
);
 */

// Add content element to selector list
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTcaSelectItem(
    'tt_content',
    'CType',
    [
        'LLL:EXT:lisztportal-web/Resources/Private/Language/Backend.xlf:content_element.categorized_timeline',
        'categorized_timeline',
        'content-bootstrappackage-timeline',
        'lisztportal-web'
    ],
    'textteaser',
    'after'
);

// Assign Icon
$GLOBALS['TCA']['tt_content']['ctrl']['typeicon_classes']['categorized_timeline'] = 'content-bootstrappackage-timeline';

// Configure element type
$GLOBALS['TCA']['tt_content']['types']['categorized_timeline'] = array_replace_recursive(
    $GLOBALS['TCA']['tt_content']['types']['timeline'],
    [
        'showitem' => '
            --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,
                --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.headers;headers,
                tx_lisztportalweb_categorizedtimeline_item,
            --div--;LLL:EXT:bootstrap_package/Resources/Private/Language/Backend.xlf:timeline.options,
                pi_flexform;LLL:EXT:bootstrap_package/Resources/Private/Language/Backend.xlf:advanced,
            --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
                --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.frames;frames,
                --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.appearanceLinks;appearanceLinks,
            --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
                --palette--;;language,
            --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                --palette--;;hidden,
                --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.access;access,
            --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
                categories,
            --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
                rowDescription,
            --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
        '
    ]
);

// Register fields
$GLOBALS['TCA']['tt_content']['columns'] = array_replace_recursive(
    $GLOBALS['TCA']['tt_content']['columns'],
    [
        'tx_lisztportalweb_categorizedtimeline_item' => [
            'label' => 'LLL:EXT:lisztportal-web/Resources/Private/Language/Backend.xlf:categorized_timeline_item',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_lisztportalweb_categorizedtimeline_item',
                'foreign_field' => 'tt_content',
                'appearance' => [
                    'useSortable' => true,
                    'showSynchronizationLink' => true,
                    'showAllLocalizationLink' => true,
                    'showPossibleLocalizationRecords' => true,
                    'expandSingle' => true,
                    'enabledControls' => [
                        'localize' => true,
                    ]
                ],
                'behaviour' => [
                    'mode' => 'select',
                ]
            ]
        ]
    ]
);
$GLOBALS['TCA']['tx_lisztportalweb_categorizedtimeline_item']['columns']['categories'] = [
    'config' => [
        'type' => 'category'
    ]
];

// Add flexForms for content element configuration
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPiFlexFormValue(
    '*',
    'FILE:EXT:bootstrap_package/Configuration/FlexForms/Timeline.xml',
    'timeline'
);
