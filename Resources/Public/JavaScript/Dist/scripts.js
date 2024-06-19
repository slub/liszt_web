/*!
 * Liszt-Portal v1.0.0 (https://liszt-portal.de)
 * Copyright 2017-2024 Matthias Richter
 * Licensed under the GPL-2.0-or-later license
 */
const LISZT_SITEPK_DEFAULT_ITEM_CLASS="timeline-item",LISZT_SITEPK_DEFAULT_SHOW_COUNT=5,LISZT_SITEPK_DEFAULT_TRIGGER_POSITION=200,LISZT_SITEPK_DEFAULT_NONE_FILTER_KEYWORD="all";class CategorizedTimeline{constructor(t){if(this.nav=$("#"+t.nav),0==this.nav.length)throw`error: nav element with id ${t.nav} not found`;if(this.timeline=$(`#${t.timeline} .timeline`),0==this.timeline.length)throw`error: content element with id ${t.timeline} not found`;this.itemClass=t.itemClass??LISZT_SITEPK_DEFAULT_ITEM_CLASS,this.showCount=t.showCount??LISZT_SITEPK_DEFAULT_SHOW_COUNT,this.triggerPosition=t.triggerPosition??LISZT_SITEPK_DEFAULT_TRIGGER_POSITION,this.noneFilterKeyword=t.noneFilterKeyword??LISZT_SITEPK_DEFAULT_NONE_FILTER_KEYWORD,this.init()}init(){this.allItems=this.timeline.find("."+this.itemClass),this.categorizedItems=this.allItems.map(this.getCategory),this.createHashtagLinks(),this.navLinks=this.nav.find(".nav-link"),this.navTags=this.timeline.find(".nav-tag"),this.hideTimelineItems(),this.showOnScroll(),this.filter()}createHashtagLinks(){this.allItems.find("p").filter((t,i)=>i.innerHTML.includes("#")).each(this.createHashtagLink)}createHashtagLink(t,i){var i=$(i),e=i.html().replace("#","");i.html(""),i.append(`<button id="${e}" class="nav-tag btn btn-outline-primary pull-right">#${e}</button>`)}hideTimelineItems(){this.hiddenItems=$(this.timeline).find(`.${this.itemClass}:gt(${this.showCount-1})`),this.hiddenItems.hide()}showOnScroll(){$(window).scroll(t=>{$(document).scrollTop()+$(window).height()>$(document).height()-this.triggerPosition&&($(this.hiddenItems.get(0)).fadeIn(),this.hiddenItems=this.timeline.find(`.${this.itemClass}:hidden`))})}clickFilter=t=>{window.scrollTo(0,$(".timeline").position().top),this.navLinks.removeClass("active");const e=t.target.getAttribute("id");$(`#${e}.nav-link`).addClass("active"),e==this.noneFilterKeyword?(this.filteredItems=this.allItems,this.outfilteredItems=$(),this.navTags.removeClass("disabled")):(this.filteredItems=this.categorizedItems.filter((t,i)=>i.category==e).map((t,i)=>i.item),this.outfilteredItems=this.categorizedItems.filter((t,i)=>i.category!=e).map((t,i)=>i.item),this.navTags.addClass("disabled")),this.navTags.click(this.clickFilter),this.timeline.fadeOut("fast",t=>{this.outfilteredItems.remove(),this.filteredItems.appendTo(this.timeline),this.filteredItems.show(),this.timeline.fadeIn("fast")})};filter(){this.navLinks.click(this.clickFilter),this.navTags.click(this.clickFilter)}getCategory(t,i){return{item:i,category:$(i).find("p").map((t,i)=>i.innerHTML).filter((t,i)=>i.includes("#")).get(0).replace("#","")}}}