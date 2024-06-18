<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

final class ChunkViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function initializeArguments(): void
    {
        $this->registerArgument('array', 'array', 'The array which should be chunked in subarrays', true);
        $this->registerArgument('length', 'integer', 'The length of the subarrays which the array should be chunked into', true);
    }

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): array {

        return array_chunk($arguments['array'], $arguments['length']);
    }
}
