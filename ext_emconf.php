<?php

/**
 * Extension Manager/Repository config file for ext "liszt_portal".
 */
$EM_CONF[$_EXTKEY] = [
    'title' => 'lisztportal-web',
    'description' => 'Sitepackage for liszt-portal.de',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'bootstrap_package' => '12.0.0-12.9.99',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'Slub\\LisztPortal\\' => 'Classes',
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
