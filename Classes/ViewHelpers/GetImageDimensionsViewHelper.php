<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Type\File\ImageInfo;



final class GetImageDimensionsViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    public function initializeArguments(): void
    {
        $this->registerArgument('imgPath', 'string', 'The path to the image like /fileadmin/user_upload/Biografie_Bilder/Liszt-Kind-01.jpg ', true);
    }

    public static function renderStatic(
        array                     $arguments,
        \Closure                  $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): array
    {

        // remove first slash from image path because working directory getcwd() is with last slash and decode url with urldecode for the real filename in path
        $arguments['imgPath'] = urldecode(ltrim($arguments['imgPath'], '/'));

        $imageInfoObject = GeneralUtility::makeInstance(ImageInfo::class,  $arguments['imgPath'] );

        $returnArray = [
            'width' => $imageInfoObject->getWidth(),
            'height' => $imageInfoObject->getHeight(),
        ];

        return $returnArray;

    }
}
