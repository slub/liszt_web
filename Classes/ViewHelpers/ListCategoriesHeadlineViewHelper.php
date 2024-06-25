<?php

declare(strict_types=1);

namespace Slub\LisztWeb\ViewHelpers;

use Illuminate\Support\Collection;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\ContentBlocks\DataProcessing\ContentBlockData;

// Todo: use language files

final class ListCategoriesHeadlineViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    protected $escapeOutput = false;


    public function initializeArguments(): void
    {
        $this->registerArgument('list', 'mixed', 'The array with categories (array, int and not exist is possible', true);
    }

    public static function renderStatic(
        array                     $arguments,
        \Closure                  $renderChildrenClosure,
        RenderingContextInterface $renderingContext,
    ): string
    {

        if (!is_array($arguments['list'])) {
            return self::getHTMLTag("Neuigkeiten");
        }


        if (count($arguments['list']) === 1) {
            return self::getHTMLTag('Mehr aus dem Bereich ' . self::getTitle($arguments['list'][0]));
        }

        if (count($arguments['list']) > 1) {
            return self::getHTMLTag('Mehr aus den Bereichen ' . self::getTitleList($arguments['list']));
        }

        return self::getHTMLTag("Neuigkeiten");

    }


    private static function getTitleList($list): string
    {
        return Collection::wrap($list)->
        map(function ($category) {
            return self::getTitle($category);
        })->
        join(', ', ' und ');
    }

    private static function getTitle(ContentBlockData $category): string
    {
        return $category->title;
    }

    private static function getHTMLTag(string $title): string
    {
        return sprintf('<h3 class="news-teaser-title">%s</h3>', $title);
    }

}
