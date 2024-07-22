<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use Illuminate\Support\Collection;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlockData;
use TYPO3\CMS\Core\Pagination\ArrayPaginator;

final class NewsPaginatorViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;
    const ITEMS_PER_PAGE = 10;

    public function initializeArguments(): void
    {
        $this->registerArgument('newsPages', 'array', 'The news pages which should be displayed', true);
        $this->registerArgument('currentPage', 'integer', 'The current page', true);
    }

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): ArrayPaginator {
        return new ArrayPaginator(
            $arguments['newsPages'],
            $arguments['currentPage'],
            self::ITEMS_PER_PAGE
        );
    }
}
