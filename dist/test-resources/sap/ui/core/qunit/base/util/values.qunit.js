/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
sap.ui.define([
	'sap/base/util/values'
], function (
	values
) {
	"use strict";

	QUnit.module("sap.base.util.values", function () {
		QUnit.test("basic functionality", function (assert) {
			assert.deepEqual(values({a: 'b', c: 'd'}), ['b', 'd']);
			assert.deepEqual(values({a: 'b', c: 'd'}).sort(), ['d', 'b'].sort());
			assert.deepEqual(values({}), []);
			assert.deepEqual(values(NaN), [], "NaN should return an empty array");
			assert.deepEqual(values(undefined), []);
			assert.deepEqual(values(null), []);
			assert.deepEqual(values(''), [], "empty string should return an empty array");
			assert.deepEqual(values('abc'), ['a', 'b', 'c'], "string abc should return an array with a, b and c");
			assert.deepEqual(values(function () {}), []);
			assert.deepEqual(values(), []);
			assert.deepEqual(values(0), [], "number should return an empty array");
			assert.deepEqual(values(3), [], "number should return an empty array");
			assert.deepEqual(values(Infinity), [], "number should return an empty array");
			var oObj = {a: 5};
			oObj = Object.create(oObj);
			oObj.b = 19;
			assert.deepEqual(values(oObj), [19]);
		});
		QUnit.test("getting values from a custom object", function (assert) {
			function Foo() {
				this.a = 1;
				this.b = 2;
			}
			Foo.prototype.c = 3;
			assert.deepEqual(values(new Foo()).sort(), [1, 2].sort());
		});
	});
});
