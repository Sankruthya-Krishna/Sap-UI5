/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a sandbox model for this component
sap.ui.define([
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/test/TestUtils",
	"sap/ui/thirdparty/sinon"
], function (ODataModel, TestUtils, sinon) {
	"use strict";

	// DO NOT extend the OData V4 model in your productive code - only used to mock requests
	return ODataModel.extend("sap.ui.core.sample.odata.types.v4.TimeOfDay.SandboxModel", {
		constructor : function (mParameters) {
			var oModel,
				oSandbox = sinon.sandbox.create();

			TestUtils.setupODataV4Server(oSandbox, {
					"EdmTypesCollection('1')?$select=ID,TimeOfDay": {
						source: "EdmTypesV4.json"
					}
				},
				"sap/ui/core/sample/odata/types/v4/TimeOfDay/data",
				"/sap/demo/zui5_edm_types_v4/",
				/*aRegExpFixture*/[{
					regExp: /GET .*\/\$metadata/,
					response: {
						source: "metadataV4.xml"
					}
				}]);

			oModel = new ODataModel(mParameters);
			oModel.destroy = function () {
				if (oSandbox) { // may be called twice
					oSandbox.restore();
					oSandbox = undefined;
				}

				return ODataModel.prototype.destroy.apply(this);
			};

			return oModel;
		}
	});
});
