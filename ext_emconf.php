<?php

/**
 * Extension Manager/Repository config file for ext "liszt_portal".
 */
$EM_CONF[$_EXTKEY] = [
    'title' => 'liszt-web',
    'description' => 'Sitepackage for liszt-portal.de',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'vite-asset-collector' => '1.9.0-1.9.9',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'Slub\\LisztWeb\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Matthias Richter',
    'author_email' => 'matthias.richter@slub-dresden.de',
    'author_company' => 'Slub',
    'version' => '1.0.0',
];
