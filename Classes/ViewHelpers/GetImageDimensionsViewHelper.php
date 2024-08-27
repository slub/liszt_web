<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;


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
        RenderingContextInterface $renderingContext
    ): array
    {
        // remove first slash from image path because working directory getcwd() is with last slash
        $arguments['imgPath'] = ltrim($arguments['imgPath'], '/');
        $dim = getimagesize($arguments['imgPath']);
        $returnArray = [
            'width' => $dim[0],
            'height' => $dim[1],
            'htmlWidthHeight' => $dim[3]
        ];

        return $returnArray;

    }
}
