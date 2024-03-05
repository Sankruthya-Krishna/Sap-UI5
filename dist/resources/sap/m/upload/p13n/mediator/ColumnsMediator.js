/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/upload/p13n/mediator/BaseMediator","sap/m/p13n/SelectionPanel","sap/m/upload/p13n/modules/CustomDataConfig","sap/ui/core/Configuration","sap/base/util/deepEqual"],function(e,t,n,o,i){"use strict";const r=e.extend("sap.m.upload.p13n.mediator.ColumnsMediator",{constructor:function(t){e.call(this,t)}});r.prototype.createPanel=function(){return Promise.resolve(this.createUi(this.getPanelData()))};r.prototype.createUi=function(e){this._oPanel=new t({enableCount:true,showHeader:true});this._oPanel.setP13nData(e);return this._oPanel};r.prototype.getPanelData=function(){const e=this.arrayToMap(this.getCurrentState(),true);const t=[],n=this.getControl()._getP13nMetadata();n[this.getP13nMetadataTarget()].forEach(n=>{t.push({key:n.key,label:n.label||n.key,tooltip:n.tooltip,index:e[n.key]?e[n.key].index:undefined,visible:!!e[n.key]})});const i=o.getLocale().toString(),r=window.Intl.Collator(i,{});t.sort((e,t)=>{if(e.visible&&t.visible){return(e.index||0)-(t.index||0)}if(e.visible){return-1}if(t.visible){return 1}return r.compare(e.label,t.label)});t.forEach(e=>delete e.index);return t};r.prototype.getCurrentState=function(){const e=[],t=this.getControl().getAggregation(this.getTargetAggregation())||[],o=this.getView();t.forEach((t,n)=>{const i=o?o.getLocalId(t.getId()):t.getId();e[i]={key:i,index:n,visible:t.getVisible()}});const i=n.read(this.getControl())||{};const r=i.hasOwnProperty("aggregations")?i.aggregations[this.getTargetAggregation()]:{};for(const t in r){const{index:n,visible:o=true}=r[t];if(!e[t]){continue}if(n!==undefined){e[t].index=n}e[t].visible=o}const a=Object.values(e).filter(e=>e.visible).sort((e,t)=>e.index-t.index);return a.map(e=>({key:e.key}))};r.prototype._getP13nData=function(){return this._oPanel?this._oPanel.getP13nData():{}};r.prototype.getChanges=function(){const e=[],t=this.getCurrentState(),n=this._getP13nData(),o=n.filter(e=>!!e.visible).map(e=>({key:e.key}));if(i(t,o)){return e}const r=this._getDeletes(t,o),a=this._getInserts(t,o),s=this._getMove(t,o,r,a);e.push(this.createChange("uploadSetTableColumnsStateChange",{deleted:r,moved:s,inserted:a}));return e};r.prototype._getDeletes=function(e,t){const n=[],o=this.arrayToMap(t);e.forEach((e,t)=>{if(!o[e.key]){n.push({key:e.key,prevIndex:t})}});return n};r.prototype._getInserts=function(e,t){const n=[],o=this.arrayToMap(e);t.forEach((e,t)=>{if(!o[e.key]){n.push({key:e.key,index:t})}});return n};r.prototype._getMove=function(e,t){const n=[],o=this.arrayToMap(t,true);e.forEach((e,t)=>{if(o[e.key]&&o[e.key].index!==t){n.push({key:e.key,index:o[e.key].index,prevIndex:t})}});return n};r.prototype.applyStateToTable=function(){const e=this.getCurrentState(),t=this.getView();this.getControl().getColumns().forEach(e=>{e.setVisible(false)});const n=this.getControl().getColumns().reduce((e,n)=>{const o=t?t.getLocalId(n.getId()):n.getId();e[o]=n;return e},{});e.forEach((e,t)=>{if(n[e.key]){n[e.key].setVisible(true);n[e.key].setOrder(t)}})};return r});
//# sourceMappingURL=ColumnsMediator.js.map