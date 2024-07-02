<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use Illuminate\Support\Collection;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlockData;
use TYPO3\CMS\Core\Pagination\SlidingWindowPagination;
use TYPO3\CMS\Core\Pagination\ArrayPaginator;

final class NewsPaginationViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;
    const MAXIMUM_LINKS = 3;

    public function initializeArguments(): void
    {
        $this->registerArgument('paginator', ArrayPaginator::class, 'The paginator that the pagination is to be calculated for', true);
    }

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): SlidingWindowPagination {
        return new SlidingWindowPagination(
            $arguments['paginator'],
            self::MAXIMUM_LINKS
        );
    }
}
