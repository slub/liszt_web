<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use Illuminate\Support\Collection;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlockData;

final class TeaserViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function initializeArguments(): void
    {
        $this->registerArgument('newsPages', 'array', 'The news pages which should be displayed', true);
        $this->registerArgument('rowLength', 'integer', 'The count of the news pages which should be displayed per row', true);
        $this->registerArgument('caller', 'array', 'The page which calls the view helper');
    }

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): array {

        return Collection::wrap($arguments['newsPages'])->
            pluck('data')->
            filter(function($page) use ($arguments) { return self::excludeCaller($page, $arguments['caller']); })->
            filter(function($page) use ($arguments) { return self::filterCategories($page, $arguments['caller']); })->
            chunk($arguments['rowLength'])->
            toArray();
    }

    private static function excludeCaller(ContentBlockData $page, array $caller) {
        return $page->uid != $caller['uid'];
    }

    private static function filterCategories(ContentBlockData $page, array $caller) {
        if (isset($caller['categories']) && is_array($caller['categories']) && count($caller['categories'])) {
            return Collection::wrap($page->categories)->
                filter( function($category) use ($caller) { return self::filterCategory($category, $caller); } )->
                count();
        }
        // disable filter if caller is not categorized
        return true;
    }

    private static function filterCategory(ContentBlockData $category, array $caller) {
        return in_array($category, $caller['categories']);
    }
}
