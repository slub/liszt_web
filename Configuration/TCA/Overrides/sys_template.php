<?php

defined('TYPO3') or die();

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
    'liszt_web',
    'Configuration/TypoScript/',
    'Liszt-Web'
);


// image crop variants,
// it's not possible to add general defaults without overwrite the existing defaults
// https://stackoverflow.com/questions/77247352/extend-cropvariants-from-sitepackage
call_user_func(function() {
    $GLOBALS['TCA']['sys_file_reference']['columns']['crop'] = [
        'config' => [
            'type' => 'imageManipulation',
            'cropVariants' => [
                'default' => [
                    'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.crop_variant.default',
                    'allowedAspectRatios' => [
                        '16:9' => [
                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.16_9',
                            'value' => 16 / 9,
                        ],
                        '3:2' => [
                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.3_2',
                            'value' => 3 / 2,
                        ],
                        '4:3' => [
                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.4_3',
                            'value' => 4 / 3,
                        ],
                        '1:1' => [
                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.1_1',
                            'value' => 1.0,
                        ],
                        'NaN' => [
                            'title' => 'LLL:EXT:core/Resources/Private/Language/locallang_wizards.xlf:imwizard.ratio.free',
                            'value' => 0.0,
                        ],
                    ],
                    'selectedRatio' => 'NaN',
                    'cropArea' => [
                        'x' => 0.0,
                        'y' => 0.0,
                        'width' => 1.0,
                        'height' => 1.0,
                    ],
                ], // default
                'square' => [
                    'title' => 'Liszt Teamfoto',
                    'allowedAspectRatios' => [
                        '100:60' => [
                            'title' => 'Liszt Teamfoto',
                            'value' => 100 / 60
                        ],
                    ],
                    'selectedRatio' => '168:100',
                    'cropArea' => [
                        'x' => 0.0,
                        'y' => 0.0,
                        'width' => 1.0,
                        'height' => 0.5952,
                    ],
                ], // square
            ], // cropVariants
        ], // config
    ];
});
