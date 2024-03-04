sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], (Controller, JSONModel,formatter) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		formatter: formatter,
		onInit() {
			const oViewModel = new JSONModel({
				currency: "IND"
			});
			this.getView().setModel(oViewModel, "view");
		}
	});
});