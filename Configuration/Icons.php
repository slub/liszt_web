<?php
// ToDo: seems to not run, icons not appearing in manifest.json

return [
    'site-logo' => [
        'provider' => \Praetorius\ViteAssetCollector\IconProvider\SvgIconProvider::class,
        'source' => 'packages/liszt_web/Resources/Private/Image/Icon/typo3.svg',
    ],
    'liszt-head' => [
        'provider' => \Praetorius\ViteAssetCollector\IconProvider\SvgIconProvider::class,
        'source' => 'assets/Image/Icon/liszt-head.png',
        'manifest' => 'packages/liszt_web/Resources/Public/Vite/.vite/manifest.json', // optional, defaults to defaultManifest
    ],
];
