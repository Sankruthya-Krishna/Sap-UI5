/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Control","sap/ui/core/Element","sap/ui/core/Configuration","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/library","sap/m/IllustratedMessage","sap/m/IllustratedMessageType","./CarouselRenderer","sap/ui/events/KeyCodes","sap/base/Log","sap/base/util/isPlainObject","sap/m/ImageHelper","sap/ui/thirdparty/jquery","sap/ui/core/IconPool","./CarouselLayout","sap/ui/dom/jquery/Selectors"],function(e,t,i,s,a,r,o,n,h,g,l,u,d,p,f,jQuery){"use strict";var c=n.BusyIndicatorSize;var _=e.CarouselArrowsPlacement;var I=e.PlacementType;var m=e.BackgroundDesign;var v=e.BorderDesign;var P=10;var A=20;var y=t.getConfiguration().getRTL();function C(e){e=e.originalEvent||e;var t=e.touches&&e.touches[0];return{x:t?t.clientX:e.clientX,y:t?t.clientY:e.clientY}}function T(e,t){e.style["transform"]="translate3d("+t+"px, 0, 0)"}var S=i.extend("sap.m.Carousel",{metadata:{library:"sap.m",designtime:"sap/m/designtime/Carousel.designtime",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},loop:{type:"boolean",group:"Misc",defaultValue:false},showPageIndicator:{type:"boolean",group:"Appearance",defaultValue:true},pageIndicatorPlacement:{type:"sap.m.PlacementType",group:"Appearance",defaultValue:I.Bottom},showBusyIndicator:{type:"boolean",group:"Appearance",defaultValue:true,deprecated:true},arrowsPlacement:{type:"sap.m.CarouselArrowsPlacement",group:"Appearance",defaultValue:_.Content},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:m.Translucent},pageIndicatorBackgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:m.Solid},pageIndicatorBorderDesign:{type:"sap.m.BorderDesign",group:"Appearance",defaultValue:v.Solid}},defaultAggregation:"pages",aggregations:{pages:{type:"sap.ui.core.Control",multiple:true,singularName:"page"},customLayout:{type:"sap.m.CarouselLayout",multiple:false},_emptyPage:{type:"sap.m.IllustratedMessage",multiple:false,visibility:"hidden"}},associations:{activePage:{type:"sap.ui.core.Control",multiple:false}},events:{loadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},unloadPage:{deprecated:true,parameters:{pageId:{type:"string"}}},pageChanged:{parameters:{oldActivePageId:{type:"string"},newActivePageId:{type:"string"},activePages:{type:"array"}}},beforePageChanged:{parameters:{activePages:{type:"array"}}}}},renderer:l});S._INNER_SELECTOR=".sapMCrslInner";S._PAGE_INDICATOR_SELECTOR=".sapMCrslBulleted";S._PAGE_INDICATOR_ARROWS_SELECTOR=".sapMCrslIndicatorArrow";S._CONTROLS=".sapMCrslControls";S._ITEM_SELECTOR=".sapMCrslItem";S._LEFTMOST_CLASS="sapMCrslLeftmost";S._RIGHTMOST_CLASS="sapMCrslRightmost";S._MODIFIERNUMBERFORKEYBOARDHANDLING=10;S._BULLETS_TO_NUMBERS_THRESHOLD=9;S.prototype.init=function(){this._aAllActivePages=[];this._aAllActivePagesIndexes=[];this._bShouldFireEvent=true;this.data("sap-ui-fastnavgroup","true",true);this._oRb=t.getLibraryResourceBundle("sap.m")};S.prototype.exit=function(){if(this._oArrowLeft){this._oArrowLeft.destroy();delete this._oArrowLeft}if(this._oArrowRight){this._oArrowRight.destroy();delete this._oArrowRight}if(this._sResizeListenerId){o.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this.$().off("afterSlide");this._aAllActivePages=null;this._aAllActivePagesIndexes=null;if(this._bThemeChangedAttached){t.detachThemeChanged(this._handleThemeChanged,this);this._bThemeChangedAttached=false}};S.prototype.onBeforeRendering=function(){if(!this.getActivePage()&&this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true)}var e=this.getActivePage();if(e){this._updateActivePages(e)}if(this._sResizeListenerId){o.deregister(this._sResizeListenerId);this._sResizeListenerId=null}return this};S.prototype._resize=function(){var e=this.$().find("> .sapMCrslInner");if(this._iResizeTimeoutId){clearTimeout(this._iResizeTimeoutId);delete this._iResizeTimeoutId}e.addClass("sapMCrslNoTransition");e.addClass("sapMCrslHideNonActive");if(this.getPages().length>1){this._setWidthOfPages(this._getNumberOfItemsToShow())}this._updateTransformValue();this._iResizeTimeoutId=setTimeout(function(){e.removeClass("sapMCrslNoTransition");e.removeClass("sapMCrslHideNonActive")})};S.prototype._getNumberOfItemsToShow=function(){var e=this.getPages().length,t=this.getCustomLayout(),i=1;if(t&&t.isA("sap.m.CarouselLayout")){i=Math.max(t.getVisiblePagesCount(),1)}if(i>1&&e<i){return e}return i};S.prototype.onAfterRendering=function(){var e=this._getActivePageIndex();var i=this.$().find(S._INNER_SELECTOR)[0];var s=this.getPages().length;if(!s){return}this._iCurrSlideIndex=Math.min(e,s-this._getNumberOfItemsToShow());if(this.getPages().length&&this.getPages()[this._getPageIndex(this.getActivePage())].getId()!==this.getActivePage()){this.setAssociation("activePage",this.getPages()[e].getId(),true)}if(t.isThemeApplied()){this._initialize()}else if(!this._bThemeChangedAttached){this._bThemeChangedAttached=true;t.attachThemeChanged(this._handleThemeChanged,this)}this._sResizeListenerId=o.register(i,this._resize.bind(this))};S.prototype.getFocusDomRef=function(){return this.getDomRef(this.getActivePage()+"-slide")||this.getDomRef("noData")};S.prototype._handleThemeChanged=function(){this._initialize();t.detachThemeChanged(this._handleThemeChanged,this);this._bThemeChangedAttached=false};S.prototype._onBeforePageChanged=function(e,t){var i=this.getPages()[t].getId();this._updateActivePages(i);this.fireBeforePageChanged({activePages:this._aAllActivePagesIndexes})};S.prototype._onAfterPageChanged=function(e,t){var i=this.getPages().length>0;if(!i){return}var s;if(this._iNewActivePageIndex!==undefined){s=this._iNewActivePageIndex}else if(this._bPageIndicatorArrowPress||this._bSwipe){var a=e<t;var r=this._getPageIndex(this.getActivePage());if(this._isPageDisplayed(r)){s=r}else{if(a){s=r+1}else{s=r-1}if(!this._isPageDisplayed(s)){s=t}}}else{s=t}this._changeActivePage(s);delete this._bPageIndicatorArrowPress;delete this._bSwipe};S.prototype._setWidthOfPages=function(e){var t=this.$().find(".sapMCrslItem"),i;if(!t.length){return}i=this._calculatePagesWidth(e);t.each(function(e,t){t.style.width=i+"%"})};S.prototype._calculatePagesWidth=function(e){var t=this.$().width(),i=this.getDomRef().querySelector(".sapMCrslFluid .sapMCrslItem"),s=parseFloat(window.getComputedStyle(i).marginRight),a=(t-s*(e-1))/e,r=a/t*100;return r};S.prototype._moveToPage=function(e){if(!this._bIsInitialized||this.getPages().length===0){return}var t=this.$(),i=t.find("> .sapMCrslInner"),s=i.children(),a=this._iCurrSlideIndex,r=s.length,o=this._getNumberOfItemsToShow(),n=this.getLoop();if(n&&o!==1&&(e<0||e>r-1)){return}if(e<0){if(n){e=r-1}else{e=0}}else if(e>r-1){if(n){e=0}else{e=r-1}}if(e+o>r-1){e=r-o}var h=true;if(e===a){h=false}if(h){this._onBeforePageChanged(a,e)}this._iOffsetDrag=0;this._iCurrSlideIndex=e;this._updateTransformValue();this._initActivePages();if(h){this._onAfterPageChanged(a,e)}};S.prototype._changeActivePage=function(e){var t=this.getActivePage();if(this._sOldActivePageId){t=this._sOldActivePageId;delete this._sOldActivePageId}var i=this.getPages()[e].getId();this.setAssociation("activePage",i,true);if(!r.system.desktop){jQuery(document.activeElement).trigger("blur")}if(this._bShouldFireEvent){d.debug("sap.m.Carousel: firing pageChanged event: old page: "+t+", new page: "+i);this.firePageChanged({oldActivePageId:t,newActivePageId:i,activePages:this._aAllActivePagesIndexes})}if(this.getDomRef().contains(document.activeElement)&&!this.getFocusDomRef().contains(document.activeElement)||this._bPageIndicatorArrowPress){this.getFocusDomRef().focus({preventScroll:true})}this._adjustArrowsVisibility();this._updateItemsAttributes();this._updatePageIndicator()};S.prototype._updateItemsAttributes=function(){this.$().find(S._ITEM_SELECTOR).each(function(e,t){var i=t===this.getFocusDomRef();t.setAttribute("aria-selected",i);t.setAttribute("aria-hidden",!this._isPageDisplayed(e));t.setAttribute("tabindex",i?0:-1)}.bind(this))};S.prototype._updatePageIndicator=function(){this.$("slide-number").text(this._getPageIndicatorText(this._iCurrSlideIndex+1))};S.prototype._getPageIndicatorText=function(e){return this._oRb.getText("CAROUSEL_PAGE_INDICATOR_TEXT",[e,this.getPages().length-this._getNumberOfItemsToShow()+1])};S.prototype._adjustArrowsVisibility=function(){if(r.system.desktop&&!this._loops()&&this.getPages().length>1){var e=this.$("hud");var t=this.$("arrow-previous");var i=this.$("arrow-next");var s=this._aAllActivePagesIndexes[0];var a=this._aAllActivePagesIndexes[this._aAllActivePagesIndexes.length-1];if(this.getArrowsPlacement()===_.Content){e.removeClass(S._LEFTMOST_CLASS).removeClass(S._RIGHTMOST_CLASS)}else{t.removeClass(S._LEFTMOST_CLASS);i.removeClass(S._RIGHTMOST_CLASS)}if(s===0){if(this.getArrowsPlacement()===_.Content){e.addClass(S._LEFTMOST_CLASS)}else{t.addClass(S._LEFTMOST_CLASS)}}if(a===this.getPages().length-1){if(this.getArrowsPlacement()===_.Content){e.addClass(S._RIGHTMOST_CLASS)}else{i.addClass(S._RIGHTMOST_CLASS)}}}};S.prototype.setActivePage=function(e){var t=null;if(typeof e=="string"){t=e}else if(e instanceof i){t=e.getId()}if(t){if(t===this.getActivePage()){return this}var s=this._getPageIndex(t);this._sOldActivePageId=this.getActivePage();this._moveToPage(s)}this.setAssociation("activePage",t,true);return this};S.prototype._getNavigationArrow=function(e){if(!this["_oArrow"+e]){this["_oArrow"+e]=f.getImageControl(this.getId()+"-arrowScroll"+e,this["_oArrow"+e],this,{src:"sap-icon://slim-arrow-"+e.toLowerCase(),useIconTooltip:false})}return this["_oArrow"+e]};S.prototype._getEmptyPage=function(){if(!this.getAggregation("_emptyPage")){var e=new h({illustrationType:g.NoData});this.setAggregation("_emptyPage",e)}return this.getAggregation("_emptyPage")};S.prototype.previous=function(){this._moveToPage(this._iCurrSlideIndex-1);return this};S.prototype.next=function(){this._moveToPage(this._iCurrSlideIndex+1);return this};S.prototype._getPageIndex=function(e){var t,i=0;for(t=0;t<this.getPages().length;t++){if(this.getPages()[t].getId()===e){i=t;break}}return i};S.prototype._getActivePageIndex=function(){var e=0,t=this.getActivePage();if(t){e=this._getPageIndex(t)}return e};S.prototype.onswipe=function(){this._bSwipe=true};S.prototype.ontouchstart=function(e){if(!this.getPages().length||!this._bIsInitialized){return}if(this._isPageIndicatorArrow(e.target)){e.preventDefault();this._bPageIndicatorArrowPress=true;return}if(e.target.draggable){e.target.draggable=false}if(e.isMarked("delayedMouseEvent")){return}var t=s.closestTo(e.target);if(t&&(t.isA("sap.m.Slider")||t.isA("sap.m.Switch")||t.isA("sap.m.IconTabBar"))){this._bDragCanceled=true;return}this._bDragging=true;this._bDragCanceled=false;this._mCurrentXY=C(e);this._iDx=0;this._iDy=0;this._bDragThresholdMet=false;this.$().addClass("sapMCrslDragging");this._bLockLeft=this._iCurrSlideIndex===1;this._bLockRight=this._iCurrSlideIndex===this.getPages().length-1};S.prototype.ontouchmove=function(e){if(this._isPageIndicatorArrow(e.target)){return}if(!this._bDragging||this._bDragCanceled||e.isMarked("delayedMouseEvent")){return}e.setMarked();var t=this.$().width();var i=C(e);this._iDx=this._mCurrentXY.x-i.x;this._iDy=this._mCurrentXY.y-i.y;if(this._bDragThresholdMet||Math.abs(this._iDx)>Math.abs(this._iDy)&&Math.abs(this._iDx)>P){this._bDragThresholdMet=true;if(p(e.touches[0])){e.preventDefault()}if(this._bLockLeft&&this._iDx<0){this._iDx=this._iDx*-t/(this._iDx-t)}else if(this._bLockRight&&this._iDx>0){this._iDx=this._iDx*t/(this._iDx+t)}this._iOffsetDrag=-this._iDx;this._updateTransformValue()}else if(Math.abs(this._iDy)>Math.abs(this._iDx)&&Math.abs(this._iDy)>P){this._bDragCanceled=true}};S.prototype.ontouchend=function(e){if(this._isPageIndicatorArrow(e.target)){return}if(!this._bDragging||e.isMarked("delayedMouseEvent")){return}this._bDragging=false;this.$().removeClass("sapMCrslDragging");if(!this._bDragCanceled&&Math.abs(this._iDx)>A){if(this._iDx>0){y?this.previous():this.next()}else{y?this.next():this.previous()}}else{this._iOffsetDrag=0;this._updateTransformValue()}};S.prototype.onsaptabprevious=function(e){this._bDirection=false;if(this._isSlide(e.target)||e.target===this.getDomRef("noData")){this._forwardTab(false)}};S.prototype.onsaptabnext=function(e){this._bDirection=true;var t=this._getActivePageTabbables();if(!t.length||e.target===t.get(-1)){this._forwardTab(true)}};S.prototype._forwardTab=function(e){this.getDomRef(e?"after":"before").focus()};S.prototype._getActivePageTabbables=function(){return this.$(this.getActivePage()+"-slide").find(":sapTabbable")};S.prototype._focusPrevious=function(e){var t=this.getFocusDomRef();if(!t){return}var i=jQuery(t);var s=this._getActivePageTabbables();i.add(s).eq(-1).trigger("focus")};S.prototype.onfocusin=function(e){if(e.target===this.getDomRef("before")&&!this.getDomRef().contains(e.relatedTarget)){this.getFocusDomRef().focus();return}if(e.target===this.getDomRef("after")&&!this.getDomRef().contains(e.relatedTarget)){this._focusPrevious(e);return}if(this._isSlide(e.target)){this.addStyleClass("sapMCrslShowArrows")}this._handlePageElemFocus(e.target);this.saveLastFocusReference(e);this._bDirection=undefined};S.prototype.onfocusout=function(e){if(this._isSlide(e.target)){this.removeStyleClass("sapMCrslShowArrows")}};S.prototype._handlePageElemFocus=function(e){var t;if(this._isSlide(e)){t=s.closestTo(jQuery(e).find(".sapMCrsPage")[0])}else{t=this._getClosestPage(e)}if(t){var i=t.getId();if(!this._isPageDisplayed(this._getPageIndex(i))){this.getFocusDomRef().focus({preventScroll:true})}else if(i!==this.getActivePage()){this._changeActivePage(this._getPageIndex(i))}}};S.prototype.onkeydown=function(e){if(e.keyCode==u.F7){this._handleF7Key(e);return}if(!this._isSlide(e.target)){return}switch(e.keyCode){case 189:case u.NUMPAD_MINUS:this._fnSkipToIndex(e,-1,false);break;case u.PLUS:case u.NUMPAD_PLUS:this._fnSkipToIndex(e,1,false);break}};S.prototype.onsapright=function(e){this._fnSkipToIndex(e,1,false)};S.prototype.onsapup=function(e){this._fnSkipToIndex(e,1,false)};S.prototype.onsapleft=function(e){this._fnSkipToIndex(e,-1,false)};S.prototype.onsapdown=function(e){this._fnSkipToIndex(e,-1,false)};S.prototype.onsaphome=function(e){this._fnSkipToIndex(e,-this._getActivePageIndex(),true)};S.prototype.onsapend=function(e){this._fnSkipToIndex(e,this.getPages().length-this._getActivePageIndex()-1,true)};S.prototype.onsaprightmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,S._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};S.prototype.onsapupmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,S._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};S.prototype.onsappageup=function(e){this._fnSkipToIndex(e,S._MODIFIERNUMBERFORKEYBOARDHANDLING,true)};S.prototype.onsapleftmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-S._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};S.prototype.onsapdownmodifiers=function(e){if(e.ctrlKey){this._fnSkipToIndex(e,-S._MODIFIERNUMBERFORKEYBOARDHANDLING,true)}};S.prototype.onsappagedown=function(e){this._fnSkipToIndex(e,-S._MODIFIERNUMBERFORKEYBOARDHANDLING,true)};S.prototype.saveLastFocusReference=function(e){var t=this._getClosestPage(e.target),i;if(this._bDirection===undefined){return}if(this._lastFocusablePageElement===undefined){this._lastFocusablePageElement={}}if(t){i=t.getId();this._lastFocusablePageElement[i]=e.target}};S.prototype._getActivePageLastFocusedElement=function(){if(this._lastFocusablePageElement){return this._lastFocusablePageElement[this.getActivePage()]}};S.prototype._updateActivePages=function(e){var t=this._getPageIndex(e),i=this._getNumberOfItemsToShow(),s=this.getPages(),a;if(!s.length){return}if(t>s.length-i){t=s.length-i}a=t+i;this._aAllActivePages=[];this._aAllActivePagesIndexes=[];for(var r=t;r<a;r++){this._aAllActivePages.push(s[r].getId());this._aAllActivePagesIndexes.push(r)}};S.prototype._fnSkipToIndex=function(e,t,i){if(!this._isSlide(e.target)){return}e.preventDefault();var s=this._makeInRange(this._getPageIndex(this.getActivePage())+t,i);var a=this.getActivePage();var r=this._iCurrSlideIndex+t;if(i){r=Math.max(0,Math.min(r,this.getPages().length-this._getNumberOfItemsToShow()))}if(this._isPageDisplayed(s)){this._changeActivePage(s)}else{this._bShouldFireEvent=false;this._moveToPage(r);this._bShouldFireEvent=true;this._sOldActivePageId=a;this._changeActivePage(s)}};S.prototype._isPageDisplayed=function(e){return this._aAllActivePagesIndexes.includes(e)};S.prototype._handleF7Key=function(e){var t=this._getActivePageLastFocusedElement();if(this._isSlide(e.target)&&t){t.focus()}else{this.getFocusDomRef().focus()}};S.prototype._isSlide=function(e){return e.id.endsWith("slide")&&e.parentElement===this.getDomRef().querySelector(S._INNER_SELECTOR)};S.prototype._isPageIndicatorArrow=function(e){return e.classList.contains("sapMCrslArrow")};S.prototype._loops=function(){return this.getLoop()&&this._getNumberOfItemsToShow()===1};S.prototype._makeInRange=function(e,t){var i=this.getPages().length;var s=e;var a=this._loops();if(e>=i){if(a&&!t){s=0}else{s=i-1}}else if(e<0){if(a&&!t){s=i-1}else{s=0}}return s};S.prototype._getClosestPage=function(e){return s.closestTo(jQuery(e).closest(".sapMCrsPage")[0])};S.prototype.setShowBusyIndicator=function(){d.warning("sap.m.Carousel: Deprecated function 'setShowBusyIndicator' called. Does nothing.");return this};S.prototype.getShowBusyIndicator=function(){d.warning("sap.m.Carousel: Deprecated function 'getShowBusyIndicator' called. Does nothing.");return false};S.prototype.setBusyIndicatorSize=function(e){if(!(e in c)){e=c.Medium}return i.prototype.setBusyIndicatorSize.call(this,e)};S.prototype.onclick=function(e){var t=e.target;switch(t.id){case this.getId()+"-arrow-next":this.next();break;case this.getId()+"-arrow-previous":this.previous();break}};S.prototype._initialize=function(){var e=this.$().find("> .sapMCrslInner"),t=this._getNumberOfItemsToShow();this._bIsInitialized=false;if(this._iTimeoutId){clearTimeout(this._iTimeoutId);delete this._iTimeoutId}e.addClass("sapMCrslNoTransition");this._iOffsetDrag=0;this._initActivePages();this._bIsInitialized=true;if(t>1){this._setWidthOfPages(t)}this._adjustArrowsVisibility();this._updateItemsAttributes();this._updatePageIndicator();this._updateTransformValue();this._iTimeoutId=setTimeout(function(){e.removeClass("sapMCrslNoTransition")},50)};S.prototype._updateTransformValue=function(){if(this.getPages().length===0){return}var e=this.$(),t=e.find("> .sapMCrslInner"),i=t.children(),s=i.eq(0),a=i.eq(this._iCurrSlideIndex),r,o,n,h;if(!t.length){return}r=a.prop("offsetLeft")+a.prop("clientWidth");o=s.prop("offsetLeft")+s.prop("clientWidth");n=o-r;h=Math.round(n+this._iOffsetDrag);T(t[0],h)};S.prototype._initActivePages=function(){var e="sapMCrslActive",t=this.$(),i=t.find("> .sapMCrslInner"),s=i.children(),a=this.getDomRef().id,r=a.replace(/(:|\.)/g,"\\$1")+"-pageIndicator",o=this._iCurrSlideIndex,n;for(n=0;n<s.length;n++){if(n<o||n>o+this._getNumberOfItemsToShow()-1){s.eq(n).removeClass(e)}else{s.eq(n).addClass(e)}}t.find("span[data-slide]").removeClass(e);t.find("#"+r+" > [data-slide='"+(o+1)+"']").addClass(e)};return S});
//# sourceMappingURL=Carousel.js.map