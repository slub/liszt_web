<?php

declare(strict_types=1);

defined('TYPO3') or die();

// Include vite generated manifest file (global)
$GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['vite_asset_collector']['defaultManifest'] = 'EXT:liszt_web/Resources/Public/Vite/.vite/manifest.json';

// Include custom RTE config
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:liszt_web/Configuration/RTE/RteLisztFullPreset.yaml';


if (\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::isLoaded('iconpack')) {
    \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(
        \Quellenform\Iconpack\IconpackRegistry::class
    )->registerIconpack(
        'EXT:liszt_web/Configuration/Iconpack/LisztIconpack.yaml'
    );
}
