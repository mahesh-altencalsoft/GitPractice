//dev2 changing same line as dev 1
//dev1
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/m/Dialog",
	"sap/ui/layout/form/SimpleForm"
], function(Controller, MsgBox, MsgToast,History, Dialog, SimpleForm) {
	"use strict";
	//this is by developer 1 view 2 changes
	return Controller.extend("ibm.fin.ar.controller.View2", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.View2
		 */
		onInit: function() {
			//developer 2 modifying the same file which was changed by dev1
			//and a push was made in remote repository
			this.oRouter = this.getOwnerComponent().getRouter();
			//you are telling router to hit the method every time route changes - registration
			this.oRouter.attachRoutePatternMatched(this.turakmakto, this);
		},
		//every time the route changes
		// turakmakto: function(oEvent){
		// 	var fruitIndex = oEvent.getParameter("arguments").kingjonjoo;
		// 	//var sPath = "/fruits/" + fruitIndex;
		// 	var sPath = "/" + fruitIndex;
		// 	this.getView().bindElement(sPath);
		// },
		// onBack: function(){
		// 	//var oAppCont = this.getView().getParent();
		// 	//oAppCont.to("idView1");
		// 	//var previousHash = History.getInstance().getPreviousHash();
		// 	//this.oRouter.navTo(previousHash);
		// 	window.history.go(-1);
		// },
		// onClick: function(){
		// 	MsgToast.show("standard sap button clicked")	;
		// },
		// onSelect: function(oEvent){
		// 	var oComboControl = oEvent.getSource();
		// 	var items = oComboControl.getSelectedItems();
		// 	if(items.length > 2){
		// 		oComboControl.setValueState(sap.ui.core.ValueState.Error);
		// 		oComboControl.setValueStateText("Bhaiya ise sahi karlo");
		// 	}else{
		// 		oComboControl.setValueState(sap.ui.core.ValueState.None);
		// 	}
		// },
		// onSelectedSupplier: function(oEvent){
		// 	//read the address of selected supplier - sPath
		// 	//Trigger a route with variable to next screen
		// 	//Make sure you create a new view, add the routing config to that new view
		// },
		// oPopSupplier: null,
		// oPopCities: null,
		// onSettings: function(){
		// 	//MsgBox.confirm("This page is under constuction...");
		// 	if(!this.oPopSupplier){
		// 		this.oPopSupplier = new sap.ui.xmlfragment("ibm.fin.ar.fragments.popup");
		// 		//go vulnerable
		// 		this.getView().addDependent(this.oPopSupplier);
		// 		this.oPopSupplier.bindAggregation("items",{
		// 			path: "/Supplier",
		// 			template: new sap.m.DisplayListItem({
		// 				value: "{city}",
		// 				label: "{name}"
		// 			})
		// 		});
		// 	}
		// 	this.oPopSupplier.open();
		// },
		// onConfirm: function(oEvent){
		// 	var oSelectedItem = oEvent.getParameter("selectedItem");
		// 	var cityName = oSelectedItem.getTitle();
		// 	sap.ui.getCore().byId(this.fieldId).setValue(cityName);
		// },
		// fieldId: "",
		// onF4Help: function(oEvent){
		// 	this.fieldId = oEvent.getSource().getId();
		// 	//MsgToast.show("Please check later");
		// 	if(!this.oPopCities){
		// 		this.oPopCities = new sap.ui.xmlfragment("ibm.fin.ar.fragments.popup");
		// 		this.getView().addDependent(this.oPopCities);
		// 		this.oPopCities.setMultiSelect(false);
		// 		this.oPopCities.bindAggregation("items",{
		// 			path: "/Cities"	,
		// 			template: new sap.m.StandardListItem({
		// 				icon: "sap-icon://home",
		// 				title: "{name}",
		// 				description: "{state}"
		// 			})
		// 		});
		// 		this.oPopCities.attachConfirm(this.onConfirm, this);
		// 	}
		// 	this.oPopCities.open();
		// },
		// onFunctionImport: function(){
		// 	//Step 1: get the object of odata model
		// 	var oDataModel = this.getView().getModel();
		// 	var that = this;
		// 	//Step 2: call the desired method from odata class - sap.ui.model.odata.v2.ODataModel
		// 	oDataModel.callFunction("/GetMostExpensiveProduct",{
		// 		urlParameters: {
		// 			"I_CATEGORY": "Notebooks"
		// 		},
		// 		success: function(data){
		// 			var oDialog = new Dialog();
		// 			var oModel = new sap.ui.model.json.JSONModel({
		// 				"empStr": data
		// 			});
		// 			oDialog.setModel(oModel);
		// 			oDialog.setTitle("Presenting Most Expensive for you :)");
		// 			oDialog.setBeginButton(new sap.m.Button({
		// 				text: "Happy Soul",
		// 				press: function(){
		// 					oDialog.close();
		// 				}
		// 			}));
		// 			oDialog.addContent(
		// 				new SimpleForm({
		// 					content: [
		// 						new sap.m.Text({text: "Product Id"}),
		// 						new sap.m.Input({
		// 							value: "{PRODUCT_ID}"
		// 						}),
		// 						new sap.m.Text({text: "Product Category"}),
		// 						new sap.m.Input({
		// 							value: "{CATEGORY}"
		// 						}),
		// 						new sap.m.Text({text: "Price"}),
		// 						new sap.m.Input({
		// 							value: "{PRICE} {CURRENCY_CODE}"
		// 						})
		// 					]
		// 				})
		// 			);
		// 			var oSimpleForm = oDialog.getAggregation("content")[0];
		// 			oSimpleForm.bindElement("/empStr");
		// 			oDialog.open();
		// 		},
		// 		error: function(oError){
		// 			MsgBox.error(JSON.parse(oError.responseText).error.message.value);
		// 		}
		// 	});
		// 	//Step 3: once the data comes, set it to a local model
		// 	//Step 4: create a popup and send this newly created local model to the popup
		// 	//Step 5: open my popup
		// },
		// onSave:function(){
		// 	MsgBox.confirm("do you want to save?",{
		// 		onClose: this.onClose
		// 	});
		// },
		// onClose: function(args){
		// 	if(args === "OK"){
		// 		MsgToast.show("Your object is saved successfully");
		// 	}else{
		// 		MsgBox.error("Object could not be saved");
		// 	}
		// }
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ibm.fin.ar.view.View2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ibm.fin.ar.view.View2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ibm.fin.ar.view.View2
		 */
		//	onExit: function() {
		//
		//	}

	});

});
