/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject) {
	"use strict";

    /**
     * @class
     * The <code>MetadataHelper</code> entity offers utility functionality for providing service metadata during the <code>Engine#register</code> process.
     *
	 * @author SAP SE
	 * @public
	 * @alias sap.m.p13n.MetadataHelper
     */
    var MetadataHelper = BaseObject.extend("sap.m.p13n.MetadataHelper", {
        constructor: function(aProperties) {
			BaseObject.apply(this, arguments);
			this._aProperties = aProperties;
		}
    });

    MetadataHelper.prototype.getProperties = function() {
        return this._aProperties;
    };

    MetadataHelper.prototype.getProperty = function(sKey) {
        return this._aProperties.find(function(oProp){
            return oProp.key === sKey;
        });
    };

    MetadataHelper.prototype.getPath = function(sKey) {
        return this.getProperty(sKey).path;
    };

	return MetadataHelper;

});