const LISZT_SITEPK_DEFAULT_ITEM_CLASS = 'timeline-item';
const LISZT_SITEPK_DEFAULT_SHOW_COUNT = 5;
const LISZT_SITEPK_DEFAULT_TRIGGER_POSITION = 200;
const LISZT_SITEPK_DEFAULT_NONE_FILTER_KEYWORD = 'all';

class CategorizedTimeline {

    constructor (setup) {
        this.nav = $(`#${setup.nav}`);
        if (this.nav.length == 0) throw `error: nav element with id ${setup.nav} not found`;

        this.timeline = $(`#${setup.timeline} .timeline`);
        if (this.timeline.length == 0) throw `error: content element with id ${setup.timeline} not found`;

        this.itemClass = setup.itemClass ?? LISZT_SITEPK_DEFAULT_ITEM_CLASS;
        this.showCount = setup.showCount ?? LISZT_SITEPK_DEFAULT_SHOW_COUNT;
        this.triggerPosition = setup.triggerPosition ?? LISZT_SITEPK_DEFAULT_TRIGGER_POSITION;
        this.noneFilterKeyword = setup.noneFilterKeyword ?? LISZT_SITEPK_DEFAULT_NONE_FILTER_KEYWORD;

        this.init();
    }

    init() {
        this.allItems = this.timeline
            .find(`.${this.itemClass}`);
        this.categorizedItems = this.allItems
            .map(this.getCategory);

        this.createHashtagLinks();
        this.navLinks = this.nav.find('.nav-link');
        this.navTags = this.timeline.find('.nav-tag');

        this.hideTimelineItems();
        this.showOnScroll();
        this.filter();
    }

    createHashtagLinks() {
        this.allItems.find('p')
            .filter((i, e) => e.innerHTML.includes('#'))
            .each(this.createHashtagLink);
    }

    createHashtagLink(_, paragraph) {
        const wrappedParagraph = $(paragraph);
        const id = wrappedParagraph.html().replace('#', '');
        wrappedParagraph.html('');
        wrappedParagraph.append(`<button id="${id}" class="nav-tag btn btn-outline-primary pull-right">#${id}</button>`);
    }

    hideTimelineItems() {
        this.hiddenItems = $(this.timeline).find(`.${this.itemClass}:gt(${this.showCount - 1})`);
        this.hiddenItems.hide();
    }

    showOnScroll() {
        $(window).scroll(_ => {
            const bottomPosition = $(document).scrollTop() + $(window).height()
            if (bottomPosition > $(document).height() - this.triggerPosition) {
                $(this.hiddenItems.get(0)).fadeIn();
                this.hiddenItems = this.timeline.find(`.${this.itemClass}:hidden`);
            }
        });
    }

    clickFilter = (event) => {
        // control navbar
        window.scrollTo(0, $('.timeline').position().top);
        this.navLinks.removeClass('active');
        const category = event.target.getAttribute('id');
        $(`#${category}.nav-link`).addClass('active');

        // calc filtered and filtered out items
        if (category == this.noneFilterKeyword) {
            this.filteredItems = this.allItems;
            this.outfilteredItems = $();
            this.navTags.removeClass('disabled');
        } else {
            this.filteredItems = this.categorizedItems
                .filter((i, e) => e.category == category)
                .map((i, e) => e.item);
            this.outfilteredItems = this.categorizedItems
                .filter((i, e) => e.category != category)
                .map((i, e) => e.item);
            this.navTags.addClass('disabled');
        }
        this.navTags.click(this.clickFilter);

        // control items
        this.timeline.fadeOut('fast', _ => {
            this.outfilteredItems.remove();
            this.filteredItems.appendTo(this.timeline);
            this.filteredItems.show();
            this.timeline.fadeIn('fast');
        });
    }

    filter() {
        this.navLinks.click(this.clickFilter);
        this.navTags.click(this.clickFilter);
    }

    getCategory(_, timelineItem) {
        return {
            item: timelineItem,
            category: $(timelineItem)
                .find('p')
                .map( (i, e) => e.innerHTML )
                .filter( (i, e) => e.includes('#') )
                .get(0)
                .replace('#', '')
        };
    }

}
