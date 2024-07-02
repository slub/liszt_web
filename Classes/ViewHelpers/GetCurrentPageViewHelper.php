<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use Illuminate\Support\Collection;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlockData;
use TYPO3\CMS\Core\Pagination\ArrayPaginator;

final class GetCurrentPageViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;
    const PAGE_ARGUMENT = 'page';

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): int {
        $params = $renderingContext->getRequest()->getQueryParams();
        return isset($params[self::PAGE_ARGUMENT]) ?
            (int) $params[self::PAGE_ARGUMENT]
            : 1;
    }
}
