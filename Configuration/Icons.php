<?php
// ToDo: seems to not run, icons not appearing in manifest.json

return [
    'site-logo' => [
        'provider' => \Praetorius\ViteAssetCollector\IconProvider\SvgIconProvider::class,
        'source' => 'packages/liszt_web/Resources/Private/Image/Icon/typo3.svg',
    ],
    'liszt-portal-logo' => [
        'provider' => \Praetorius\ViteAssetCollector\IconProvider\SvgIconProvider::class,
        'source' => 'packages/liszt_web/Resources/Private/Image/Icon/LogoLisztPortal.svg',
    ],
];
