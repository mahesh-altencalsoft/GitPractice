sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ibm/fin/ar/model/models"
], function(Controller, models) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.App
		 */
		onInit: function() {
			
			// var oView1 = new sap.ui.view("idView1",{
			// 	viewName: "ibm.fin.ar.view.View1",
			// 	type: sap.ui.core.mvc.ViewType.XML
			// });
			// var oView2 = new sap.ui.view("idView2",{
			// 	viewName: "ibm.fin.ar.view.View2",
			// 	type: sap.ui.core.mvc.ViewType.XML
			// });
			// var oEmpty = new sap.ui.view("idEmpty",{
			// 	viewName: "ibm.fin.ar.view.Empty",
			// 	type: sap.ui.core.mvc.ViewType.XML
			// });
			// var oAppContainer = this.getView().byId("myApp");
			
			// oAppContainer.addMasterPage(oView1);
			// oAppContainer.addDetailPage(oEmpty).addDetailPage(oView2);
			
			//Create model object
			//var oModel = models.createFruitModel();
			//we will be setting model at grand parent level which is 
			//for us the whole app
			//this.getView().setModel(oModel);
			
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ibm.fin.ar.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ibm.fin.ar.view.App
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ibm.fin.ar.view.App
		 */
		//	onExit: function() {
		//
		//	}

	});

});