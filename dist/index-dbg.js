sap.ui.define([
	"sap/ui/core/ComponentContainer"
	//"sap/ui/core/mvc/XMLView"
], (ComponentContainer) => {
	"use strict";

	new ComponentContainer({
		name: "ui5.walkthrough",
		settings : {
			id : "walkthrough"
		},
		async: true
	}).placeAt("content");
});
