/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/m/GenericTile","sap/ui/core/Icon","./SlideTileRenderer","sap/ui/events/KeyCodes","sap/ui/events/PseudoEvents","sap/ui/thirdparty/jquery","sap/ui/core/Configuration","sap/ui/core/InvisibleText","sap/ui/core/Lib"],function(e,t,i,s,n,a,o,jQuery,r,l,h){"use strict";var p=e.GenericTileScope;var u=e.TileSizeBehavior;var c=t.extend("sap.m.SlideTile",{metadata:{library:"sap.m",properties:{displayTime:{type:"int",group:"Appearance",defaultValue:5e3},transitionTime:{type:"int",group:"Appearance",defaultValue:500},scope:{type:"sap.m.GenericTileScope",group:"Misc",defaultValue:"Display"},sizeBehavior:{type:"sap.m.TileSizeBehavior",defaultValue:u.Responsive},width:{type:"sap.ui.core.CSSSize",group:"Appearance"},height:{type:"sap.ui.core.CSSSize",group:"Appearance"}},defaultAggregation:"tiles",aggregations:{tiles:{type:"sap.m.GenericTile",multiple:true,singularName:"tile",bindable:"bindable"},_pausePlayIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_invisibleText:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}},events:{press:{parameters:{scope:{type:"sap.m.GenericTileScope"},action:{type:"string"},domRef:{type:"any"}}}}},renderer:n});c.prototype.init=function(){this._oRb=h.getResourceBundleFor("sap.m");this.setAggregation("_pausePlayIcon",new s({id:this.getId()+"-pause-play-icon",src:"sap-icon://media-pause",color:"#ffffff",size:"1rem",noTabStop:true}),true);this._oInvisibleText=new l(this.getId()+"-ariaText");this.setAggregation("_invisibleText",this._oInvisibleText,true)};c.prototype.onBeforeRendering=function(){i.prototype._initScopeContent.call(this,"sapMST");var e=this.getScope()===p.Actions;for(var t=0;t<this.getTiles().length;t++){this.getTiles()[t].showActionsView(e)}if(this._iCurrentTile>=0){this._iLastTile=this._iCurrentTile}this._bNeedInvalidate=false;this._stopAnimation();this._sWidth=this._sHeight=undefined;this._iCurrentTile=this._iPreviousTile=undefined;if(this.getParent()&&this.getParent().isA("sap.f.GridContainer")){this._applyNewDim()}};c.prototype.onAfterRendering=function(){this._setupResizeClassHandler();var e=this.getTiles().length,t=this.getScope();this._iCurrAnimationTime=0;this._bAnimationPause=false;if(this._iLastTile>=0&&e>1){this._scrollToTile(this._iLastTile)}else{this._scrollToNextTile()}if(e>1&&t===p.Display){this._startAnimation()}if(t===p.Actions&&this._iCurrentTile>=0&&this._hasNewsContent(this._iCurrentTile)){this.addStyleClass("sapMSTDarkBackground")}var i;for(var s=0;s<this.getTiles().length;s++){var n=this.getTiles()[this._iCurrentTile];if(n&&n._isNavigateActionEnabled()){n._oNavigateAction._bExcludeFromTabChain=false;n._oNavigateAction.invalidate()}i=document.querySelector('span[id$="tileIndicator-'+s+'"]');if(i){i.addEventListener("click",function(e){var t=e.currentTarget.id,i=parseInt(t.substring(t.lastIndexOf("-")+1)),s=this._iCurrentTile>i;if(this._iCurrentTile!==i){this._scrollToNextTile(this._bAnimationPause,s,i)}}.bind(this))}}this._attachFocusEvents();this._removeChildAria();if(this.getDomRef()){this.getDomRef().setAttribute("aria-describedby",this.getAggregation("_invisibleText").getId())}};c.prototype.exit=function(){this._stopAnimation();if(this._oMoreIcon){this._oMoreIcon.destroy()}if(this._oRemoveButton){this._oRemoveButton.destroy()}};c.prototype.ontap=function(e){var t=this.getScope();this.$().trigger("focus");if(t===p.Actions){var i=this._getEventParams(e);this.firePress(i);e.preventDefault()}};c.prototype.ontouchstart=function(e){if(this.getScope()===p.Display){if(jQuery(e.target).hasClass("sapMSTIconClickTapArea")){this.addStyleClass("sapMSTIconPressed")}else{this.addStyleClass("sapMSTHvr")}}};c.prototype.ontouchend=function(e){this.removeStyleClass("sapMSTHvr")};c.prototype.ontouchcancel=function(e){if(this.hasStyleClass("sapMSTIconPressed")){this.removeStyleClass("sapMSTIconPressed")}else{this.removeStyleClass("sapMSTHvr")}};c.prototype.onkeydown=function(e){if(this.getScope()===p.Display){if(o.events.sapenter.fnCheck(e)){var t=this.getTiles()[this._iCurrentTile];t.onkeydown(e)}}};c.prototype.onkeyup=function(e){var t;if(this.getScope()===p.Display){if(o.events.sapenter.fnCheck(e)){var s=this.getTiles()[this._iCurrentTile];s.onkeyup(e);return}if(o.events.sapspace.fnCheck(e)){this._toggleAnimation();this.bIsPrevStateNormal=!this._bAnimationPause}if(e.which===a.B&&this._bAnimationPause){this._scrollToNextTile(true,true)}if(e.which===a.F&&this._bAnimationPause){this._scrollToNextTile(true,false)}}else if(this.getScope()===p.Actions){if(o.events.sapselect.fnCheck(e)){this.firePress(this._getEventParams(e));e.preventDefault()}else if(o.events.sapdelete.fnCheck(e)||o.events.sapbackspace.fnCheck(e)){t={scope:this.getScope(),action:i._Action.Remove,domRef:this._oRemoveButton.getPopupAnchorDomRef()};this.firePress(t);e.preventDefault()}}};c.prototype.onsapspace=function(e){e.preventDefault()};c.prototype.onmouseup=function(e){if(this.getScope()===p.Display){if(this.hasStyleClass("sapMSTIconPressed")){this._toggleAnimation();this.removeStyleClass("sapMSTIconPressed")}}};c.prototype.onmousedown=function(e){if(jQuery(e.target).hasClass("sapMSTIconClickTapArea")){this.addStyleClass("sapMSTIconPressed")}this.mouseDown=true};c.prototype.setScope=function(e){if(this.getScope()!==e){if(e===p.Actions){this.setProperty("scope",e,true);this._bNeedInvalidate=true;this._stopAnimation(this._bNeedInvalidate)}else{this.setProperty("scope",e)}this._setTilePressState()}return this};c.prototype._setupResizeClassHandler=function(){var e=function(){var e=this.getParent();if(e&&e.isA("sap.f.GridContainer")){this._applyNewDim()}if(this.getSizeBehavior()===u.Small||window.matchMedia("(max-width: 374px)").matches||this._hasStretchTiles()){this.$().addClass("sapMTileSmallPhone")}else{this.$().removeClass("sapMTileSmallPhone")}}.bind(this);jQuery(window).on("resize",e);e()};c.prototype._attachFocusEvents=function(){var e=this.getDomRef();if(e){e.addEventListener("focusin",function(){if(!this.mouseDown){this.bIsPrevStateNormal=this.getDomRef().classList.contains("sapMSTPauseIcon");this._stopAnimation();this._updatePausePlayIcon()}}.bind(this));e.addEventListener("focusout",function(){if(!this.mouseDown){if(this.bIsPrevStateNormal){this._startAnimation(true)}this._updatePausePlayIcon()}this.mouseDown=false}.bind(this))}};c.prototype._removeChildAria=function(){this.getTiles().forEach(function(e){e.getDomRef().removeAttribute("role");e.getDomRef().removeAttribute("aria-roledescription")})};c.prototype._hasStretchTiles=function(){return this.getTiles().some(function(e){return e._isSmallStretchTile()})};c.prototype._isFocusInsideST=function(){return this.$()[0]===document.activeElement||this.$().find(document.activeElement).length};c.prototype._toggleAnimation=function(){if(this.getTiles().length>1){if(this._bAnimationPause){this._startAnimation()}else{this._stopAnimation()}}this._updatePausePlayIcon()};c.prototype._stopAnimation=function(e){this._iCurrAnimationTime+=Date.now()-this._iStartTime;clearTimeout(this._sTimerId);if(this._iCurrentTile!=undefined){var t=this.$("wrapper-"+this._iCurrentTile);t.stop()}if(this._iPreviousTile!=undefined){var i=this.$("wrapper-"+this._iPreviousTile);i.stop()}this._bAnimationPause=true;if(this._iCurrAnimationTime>this.getDisplayTime()){this._scrollToNextTile(true)}else{if(this.getTiles()[this._iCurrentTile]){this._setAriaDescriptor()}if(e){this.invalidate()}}};c.prototype._startAnimation=function(e){var t=this.getDisplayTime()-this._iCurrAnimationTime;clearTimeout(this._sTimerId);this._sTimerId=setTimeout(function(){this._scrollToNextTile()}.bind(this),t);this._iStartTime=Date.now();this._bAnimationPause=false;if(this.getTiles()[this._iCurrentTile]&&!e){this._setAriaDescriptor()}};c.prototype._scrollToTile=function(e){if(e>=0){var t=this.$("wrapper-"+e);var i=r.getRTL()?"right":"left";this._changeSizeTo(e);t.css(i,"0rem");this._iCurrentTile=e;if(this.getTiles()[e]){this._setAriaDescriptor()}this._updateTilesIndicator()}};c.prototype._scrollToNextTile=function(e,t,i){var s=this._iCurrAnimationTime-this.getDisplayTime(),n,a,o,l,h,p,u,c,T,_;s=this.getTransitionTime()-(s>0?s:0);n=s===this.getTransitionTime();if(n){if(t){a=this._getPreviousTileIndex(this._iCurrentTile)}else{a=this._getNextTileIndex(this._iCurrentTile)}this._iPreviousTile=this._iCurrentTile;this._iCurrentTile=a}if(i>=0){this._iCurrentTile=i}l=this.$("wrapper-"+this._iCurrentTile);T=r.getRTL()?"right":"left";var f=this.getTiles()[this._iCurrentTile];if(f&&f._isNavigateActionEnabled()){f._oNavigateAction._bExcludeFromTabChain=false;f._oNavigateAction.invalidate()}if(this._iPreviousTile!=undefined){var g=this.getTiles()[this._iPreviousTile];if(g&&g._isNavigateActionEnabled()){g._oNavigateAction._bExcludeFromTabChain=true;g._oNavigateAction.invalidate()}o=this.$("wrapper-"+this._iPreviousTile);h=o.css("width");p=parseFloat(l.css("width"));u=parseFloat(h);c=u<p;if(c){this._changeSizeTo(this._iCurrentTile)}if(n){l.css(T,h)}_={};if(t){_[T]=h}else{_[T]="-"+h}o.animate(_,{duration:s,done:function(){if(!c){this._changeSizeTo(this._iCurrentTile)}o.css(T,"")}.bind(this)});if(t){_[T]="-"+h;l.animate(_,0)}_[T]="0rem";l.animate(_,{duration:s,done:function(){this._iCurrAnimationTime=0;if(this._bNeedInvalidate){this.invalidate()}if(!e){this._startAnimation()}}.bind(this)})}else{this._changeSizeTo(this._iCurrentTile);l.css(T,"0rem")}if(this.getTiles()[this._iCurrentTile]){this._setAriaDescriptor()}this._updateTilesIndicator()};c.prototype._setAriaDescriptor=function(){var e="",t,i,s,n,a,o;t=this.getScope();i=this.getTiles();n=i.length;o=this._bAnimationPause?"SLIDETILE_INSTANCE_FOCUS_PAUSE":"SLIDETILE_INSTANCE_FOCUS_SCROLL";a=this._oRb.getText(o,[this._iCurrentTile+1,n]);e+=a;s=i[this._iCurrentTile];e+=s._getAriaText(true).replace(/\s/g," ");if(t===p.Actions){e=this._oRb.getText("GENERICTILE_ACTIONS_ARIA_TEXT")+"\n"+e}else if(i.length>1&&t===p.Display){e+="\n"+this._oRb.getText("SLIDETILE_MULTIPLE_CONTENT")+"\n"+this._oRb.getText("SLIDETILE_TOGGLE_SLIDING");if(this._bAnimationPause){e+="\n"+this._oRb.getText("SLIDETILE_SCROLL_BACK")+"\n"+this._oRb.getText("SLIDETILE_SCROLL_FORWARD")}}e+="\n"+this._oRb.getText("SLIDETILE_ACTIVATE");this.getAggregation("_invisibleText").setText(e)};c.prototype._changeSizeTo=function(e){var t=this.getTiles()[e];if(!t){return}if(this._sFrameType){this.$().removeClass(this._sFrameType)}this.$().addClass(t.getFrameType());this._sFrameType=t.getFrameType()};c.prototype._getPreviousTileIndex=function(e){if(e>0){return e-1}else{return this.getTiles().length-1}};c.prototype._getNextTileIndex=function(e){if(e+1<this.getTiles().length){return e+1}else{return 0}};c.prototype._updateTilesIndicator=function(){var e;for(var t=0;t<this.getTiles().length;t++){e=this.$("tileIndicator-"+t);if(t===this._iCurrentTile){e.addClass("sapMSTActive")}else{e.removeClass("sapMSTActive")}}};c.prototype._updatePausePlayIcon=function(){if(this.getAggregation("_pausePlayIcon")){if(this._bAnimationPause){this.getAggregation("_pausePlayIcon").setSrc("sap-icon://media-play");this.$().removeClass("sapMSTPauseIcon")}else{this.getAggregation("_pausePlayIcon").setSrc("sap-icon://media-pause");this.$().addClass("sapMSTPauseIcon")}}};c.prototype._setTilePressState=function(){var e=this.getTiles(),t=this.getScope()===p.Display;for(var i=0;i<e.length;i++){e[i].setPressEnabled(t)}};c.prototype._hasNewsContent=function(e){var t=this.getTiles()[e].getTileContent();for(var i=0;i<t.length;i++){if(t[i]._getContentType()==="News"){return true}}return false};c.prototype._applyNewDim=function(){var e=this.getParent();var t=e.getActiveLayoutSettings().getGap();var i=t==="16px"||t==="1rem";if(i){this.addStyleClass("sapMSTGridContainerOneRemGap")}else if(!i&&this.hasStyleClass("sapMSTGridContainerOneRemGap")){this.removeStyleClass("sapMSTGridContainerOneRemGap")}this.getTiles().forEach(function(t){t._applyNewDim(e)})};c.prototype._getEventParams=i.prototype._getEventParams;return c});
//# sourceMappingURL=SlideTile.js.map