<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use Illuminate\Support\Collection;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlockData;


final class SortByViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function initializeArguments(): void
    {
        $this->registerArgument('data', 'array', 'Array to be sorted', true);
        $this->registerArgument('field', 'string', 'Field to be sorted', true);
        $this->registerArgument('order', 'string', 'The sort Order asc or desc', false);
    }

    public static function renderStatic(
        array                     $arguments,
        \Closure                  $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): array
    {

        return self::sort($arguments['data'], $arguments['field'], $arguments['order'] );

    }

    private static function sort(array $data, string $field, string $order): array
    {
         if ($order === 'desc') {
             return Collection::wrap($data)
                 ->sortByDesc($field)
                 ->toArray();
         }

        return Collection::wrap($data)
            ->sortBy($field)
            ->toArray();
    }

}
