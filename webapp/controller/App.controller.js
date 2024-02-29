sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], (Controller,MessageToast) => {
    "use strict";
 
    return Controller.extend("ui5.walkthrough.controller.App", {
       onShowHello() {
          // show a native JavaScript alert
          MessageToast.show("Hello World");
       }
    });
 });