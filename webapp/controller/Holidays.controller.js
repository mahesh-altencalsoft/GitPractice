sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
		"sap/m/MessageBox"
], function (Controller,History, MessageBox) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.Holidays", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.Holidays
		 */
		 
		 ///Global Declartion
		 holidayid : 0,
		 holidayName:'',
		 holidayYear:'',
		 HolidayTotalrec:0,
		 HolidayTotalPage:0,
		 
		onInit: function () {
var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("BranchtoHoliday").attachPatternMatched(this._onObjectMatched, this);
		},
		
_onObjectMatched:function(oEvent){
			this.holidayid = oEvent.getParameter("arguments").Holidaylistid;
			this.readHolidayList();
			this.HolidayBinding();
},

HolidayBinding: function(){
	var that = this;
		
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday-list/holidays?id="+this.holidayid+"&page=1&page_size=10";
		
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
						var myData = Results.data;
			that.HolidayTotalrec = Results.metaData["totalRecords"];

			that.HolidayTotalPage = Math.ceil(that.HolidaytTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"HolidayData": myData
			});

			// that.getView().byId("idHolidysection").setTitle("Holiday List(" + that.HolidayListTotalrec + ")");

			//step 3: Set the model to the list level as default model
			that.getView().setModel(oModel, "oModelHoliday");
			//	oList.setModel(oModel);
				 that.onHolidayPagination(that.HolidayTotalrec);
		
				},
				error: function () {

				}
			});
},



readHolidayList: function(){
		var that = this;
		var oModel = new sap.ui.model.json.JSONModel() ;
		this.getView().setModel(oModel, "oModelHolidayList");
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday-list?id=" + this.holidayid;
			$.ajax({
				type: "GET",
				url: sURL,

				contentType: "application/json",
				headers: {
					"accept": " */*",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Credentials": true,
					"Access-Control-Allow-Methods": "*"
				},

				//
				dataType: 'json', //Expected data format from server
				processdata: true, //True or False
				success: function (results) {

					if (results.status === "SUCCESS") {

					oModel.setData({
						"HolidyList": results.data
					});

						// sap.m.MessageToast("Company Saved Successfully");
					}
				},
				error: function (oError) {}

			});
			
			
},

////Pagination code for Holidays Table

	onHolidayPagination: function (ORec) {

			this.getView().byId("idb1").setText("1").setType("Emphasized");
			this.getView().byId("idb2").setText("2").setType("Default");
			this.getView().byId("idb3").setText("3").setType("Default");
			this.getView().byId("idb4").setText("4").setType("Default");

			if (ORec <= 10) {
				//  this.getView().byId("idb1")._bActive = true;
				this.getView().byId("idToolbarList").setVisible(false);
			

			} else if (ORec <= 20) {
				this.getView().byId("idToolbarList").setVisible(true);
				this.getView().byId("idPrev").setEnabled(true);
				this.getView().byId("idNext").setEnabled(true);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(false);
				this.getView().byId("idb4").setVisible(false).setText("2");

			} else if (ORec <= 30) {

				this.getView().byId("idPrev").setEnabled(true);
				this.getView().byId("idNext").setEnabled(true);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(false).setText("3");

				//	  this.getView().byId("idb1")._bActive = true;
			} else if (ORec <= 40) {

				this.getView().byId("idToolbarList").setVisible(true);
				this.getView().byId("idPrev").setEnabled(true);
				this.getView().byId("idNext").setEnabled(true);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(true);

				//  this.getView().byId("idb1")._bActive = true;
			} else {

				this.getView().byId("idToolbarList").setVisible(true);
				this.getView().byId("idPrev").setEnabled(true);
				this.getView().byId("idNext").setEnabled(true);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(true);

				//	  this.getView().byId("idb1")._bActive = true;
			}

		},

		onPrev: function (oEvent) {

			//  this.getView().byId("idb1")._bActive = true;	
			var oPrev = this.getView().byId("idb1").getText();

			if (oPrev === "1") {
				// this.getView().byId("idPrev").setEnabled(false);

				if (this.getView().byId("idb1").getType() === "Emphasized") {
					sap.m.MessageToast.show("You are at First Page");
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Emphasized");
					this.getView().byId("idb2").setType("Default");
					this.onFirst();
				} else if (this.getView().byId("idb3").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Emphasized");
					this.getView().byId("idb3").setType("Default");
					this.onSecond();
				} else {
					this.getView().byId("idb3").setType("Emphasized");
					this.getView().byId("idb4").setType("Default");
					this.onThird();
				}

			} else {
				this.getView().byId("idb1").setText(parseInt(oPrev) - 1);
				this.getView().byId("idb2").setText(parseInt(oPrev));
				this.getView().byId("idb3").setText(parseInt(oPrev) + 1);
				this.getView().byId("idb4").setText(parseInt(oPrev) + 2);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.onFirst();
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.onSecond();
				} else if (this.getView().byId("idb3").getType() === "Emphasized") {
					this.onThird();
				} else {
					this.onFourth();
				}
				//
			}

		},

		onNext: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb4").getText());
			if (oNext >= this.HolidayTotalPage) {
				//do nothing
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Default");
					this.getView().byId("idb2").setType("Emphasized");
					this.onSecond();
				} else if (this.getView().byId("idb2").getType() === "Emphasized" && this.getView().byId("idb2").getText() == this.HolidayTotalPage) {
					this.getView().byId("idb2").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Default");
					this.getView().byId("idb3").setType("Emphasized");
					this.onThird();
				} else if (this.getView().byId("idb3").getType() === "Emphasized" && this.getView().byId("idb3").getText() == this.HolidayTotalPage) {
					this.getView().byId("idb3").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb3").getType() === "Emphasized") {
					this.getView().byId("idb3").setType("Default");
					this.getView().byId("idb4").setType("Emphasized");
					this.onFourth();
				} else {
					//do nothing
					//this.onFourth();
					sap.m.MessageToast.show("No More Pages");

				}
			} else {
				this.getView().byId("idb1").setText(parseInt(oNext) - 2);
				this.getView().byId("idb2").setText(parseInt(oNext) - 1);
				this.getView().byId("idb3").setText(parseInt(oNext));
				this.getView().byId("idb4").setText(parseInt(oNext) + 1);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.onFirst();
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.onSecond();
				} else if (this.getView().byId("idb3").getType() === "Emphasized") {
					this.onThird();
				} else {
					this.onFourth();
				}
				//
				//		this.getView().byId("idPrev").setEnabled(true);

				// if (parseInt(oNext) + 1 >= this.TotalPage) {
				// 	this.getView().byId("idNext").setEnabled(false);
				// }

				// this.onListBind();
			}

		},

		onFirst: function () {

			this.getView().byId("idb1").setType("Emphasized");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb1").getText();

			var oModel2 = this.getView().getModel("oModelHoliday");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = 
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday-list/holidays?id="+this.holidayid+ "&page=" + oPage +
				"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"HolidayData": Results.data
					});
				},
				error: [this.errorREST, this]
			});

		},
		onSecond: function () {
			//sap.ui.core.BusyIndicator.show(20);
			//  a.show();	

			// var olist = this.getView().byId("idList").setBusy(true);
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Emphasized");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Default");

			var oPage = parseInt(this.getView().byId("idb2").getText());

			var oModel2 = this.getView().getModel("oModelHoliday");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL =	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday-list/holidays?id="+this.holidayid+ "&page=" + oPage +
				"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"HolidayData": Results.data
					});
					//sap.ui.core.BusyIndicator.hide();
					// olist.setBusy(false);
				},
				error: [this.errorREST, this]
			});
		},
		onThird: function () {
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Emphasized");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb3").getText();

			var oModel2 = this.getView().getModel("oModelHoliday");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL =	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday-list/holidays?id="+this.holidayid+ "&page=" + oPage +
				"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"HolidayData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},
		onFourth: function () {
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Emphasized");

			var oPage = this.getView().byId("idb4").getText();

			var oModel2 = this.getView().getModel("oModelHoliday");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday-list/holidays?id="+this.holidayid+ "&page=" + oPage +
				"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"HolidayData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},

onNewHoliday: function(oEvent){
	
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Add New Holiday ',
			
				type: 'Standard',
				//	state: 'Information',
				content: new sap.m.VBox({
					items: [new sap.m.Input({
							value: "",
							placeholder: "Name of the Holiday"
						}),

						new sap.m.DatePicker({
							value: "",
							placeholder: "Enter Date",
						 valueFormat:"yyyy-MM-dd"
							
						})

					]
				}).addStyleClass("sapUiResponsiveMargin"),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Create',
					//	icon:"sap-icon://accept",
					width: "auto",

					press: function (OEvent) {

						that.onCreateHoliday(OEvent);

						// oDialog.close();
					}
				}),

				endButton: new sap.m.Button({
						type: "Emphasized",
						//	icon:"sap-icon://decline",
						text: 'Cancel',
					
						width: "auto",
						press: function () {
							oDialog.close();
						}
					})
					// afterClose: function () {
					// 	oDialog.destroy();
					// }
			});

			oDialog.open();
	
},


	onCreateHoliday: function (OEvent) {
			var flag;
			var ODialog = OEvent.getSource().getParent();
	
		
			var that = this;

			var oInput1 = OEvent.getSource().getParent().getContent()[0].getItems()[0];
			var oInput2 = OEvent.getSource().getParent().getContent()[0].getItems()[1];
			if (oInput1.getValue() === "") {
				oInput1.setValueState("Error").setValueStateText("Holiday  Name cannot be blank");
flag = 1;
			} else {
				oInput1.setValueState("None");
				var Name = oInput1.getValue();
			
			}
			if (oInput2.getValue() === "") {
				oInput2.setValueState("Error").setValueStateText("Date cannot be blank");
				flag=1;
			} else {
				oInput2.setValueState("None");
				var date = oInput2.getValue();
			
			}
if (flag !== 1){
	var oData = JSON.stringify({
			"date": date,
  "floating": true,
  "name": Name
			});
			
	
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday?list=" + this.holidayid;		

		$.ajax({
				type: "POST",
				url: sURL,
				data: oData,
				contentType: "application/json",

				dataType: 'json', //Expected data format from server
				processdata: true, //True or False
				success: function (Results) {
                      ODialog.close();
	ODialog.setBusy(false);
							that.getView().setBusy(false);
							var Mes = "Holiday  has been applied to Holday List Successfuly";
								that.HolidayTotalrec = parseInt(that.HolidayTotalrec + 1);
					
						that.HolidayTotalPage = Math.ceil(that.HolidayTotalrec / 10);
						that.onFirst();
							// that.getView().byId("idHolidysection").setTitle("Holiday List(" + that.HolidayTotalrec + ")");
							that.onHolidayPagination(that.HolidayTotalrec);
							MessageBox.success(
								Mes, {
									icon: MessageBox.Icon.Success,
									title: "Success",
									actions: sap.m.MessageBox.Action.Close, // default
									emphasizedAction: null,
									initialFocus: null
								}
							);
				
				},
				error: function (oError) {
						that.getView().setBusy(false);
					 	sap.m.MessageToast.show(oError.responseJSON.message);
	ODialog.setBusy(false);
					// 	var mes = "";

						if (oError.responseJSON.errors) {
								if ( oError.responseJSON.errors["holiday"].name) {
								
						oInput2.setValueState("Error").setValueStateText( oError.responseJSON.errors["holiday"].name);
							
							} else {
							oInput2.setValueState("None");
							}

							if ( oError.responseJSON.errors["holiday"].year) {
								
						oInput2.setValueState("Error").setValueStateText( oError.responseJSON.errors["holiday"].year);
							
							} else {
							oInput2.setValueState("None");
							}
						
							// for (var i = 0; i < oErr.length; i++) {
							// 	mes = mes + oErr[i]  + '\xa0';
							// }
					// 			ODialog.getContent()[0].setValueState("Error");
					// ODialog.getContent()[0].setValueStateText(mes);
						}

					// MessageBox.error(
					// 	mes, {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					// );
					// 	}
					// });
				}

			});
	
}
			

		
		},
		
	onEditHolidayDailog: function(oEvent){
		
		var that = this;
		var currentItem = oEvent.getSource().getParent().getParent();
			this.idholiday  = currentItem.getCells()[0].mProperties["text"];
			var name = currentItem.getCells()[1].mProperties["text"];
			var date = currentItem.getCells()[2].mProperties["text"];
		
	
		var oDialog = new sap.m.Dialog({
				title: 'Edit Holiday ',
			
				type: 'Standard',
				//	state: 'Information',
				content: new sap.m.VBox({
					items: [new sap.m.Input({
							value: name,
							placeholder: "Name of the Holiday"
						}),

						new sap.m.DatePicker({
							value: date,
							placeholder: "Enter Date",
						 valueFormat:"yyyy-MM-dd"
							
						})

					]
				}).addStyleClass("sapUiResponsiveMargin"),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Update',
					//	icon:"sap-icon://accept",
					width: "auto",

					press: function (OEvent) {

						that.onEditHoliday(OEvent);

						// oDialog.close();
					}
				}),

				endButton: new sap.m.Button({
						type: "Emphasized",
						//	icon:"sap-icon://decline",
						text: 'Cancel',
					
						width: "auto",
						press: function () {
							oDialog.close();
						}
					})
					// afterClose: function () {
					// 	oDialog.destroy();
					// }
			});

			oDialog.open();
	
	},
	
	
	onEditHoliday: function(OEvent){
			var flag;
			var ODialog = OEvent.getSource().getParent();
	ODialog.setBusy(true);
		
			var that = this;

			var oInput1 = OEvent.getSource().getParent().getContent()[0].getItems()[0];
			var oInput2 = OEvent.getSource().getParent().getContent()[0].getItems()[1];
			
			
					if (oInput1.getValue() === "") {
				oInput1.setValueState("Error").setValueStateText("Holiday  Name cannot be blank");
flag = 1;
			} else {
				oInput1.setValueState("None");
				var Name = oInput1.getValue();
			
			}
			if (oInput2.getValue() === "") {
				oInput2.setValueState("Error").setValueStateText("Date cannot be blank");
				flag=1;
			} else {
				oInput2.setValueState("None");
				var date = oInput2.getValue();
			
			}
		if (flag !== 1){
	var oData = JSON.stringify({
			"date": date,
  "floating": true,
  "name": Name
			});
			
	
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/holiday?id=" + this.idholiday;		

		$.ajax({
				type: "PUT",
				url: sURL,
				data: oData,
				contentType: "application/json",

				dataType: 'json', //Expected data format from server
				processdata: true, //True or False
				success: function (Results) {
                    
	ODialog.setBusy(false);
	  ODialog.close();
							that.getView().setBusy(false);
							var Mes = "Holiday Edited Successfuly";
							
						that.onHolidayPagination(that.HolidayTotalrec);
					
						that.onFirst();
							// that.getView().byId("idHolidysection").setTitle("Holiday List(" + that.HolidayTotalrec + ")");
						
							MessageBox.success(
								Mes, {
									icon: MessageBox.Icon.Success,
									title: "Success",
									actions: sap.m.MessageBox.Action.Close, // default
									emphasizedAction: null,
									initialFocus: null
								}
							);
				
				},
				error: function (oError) {
						that.getView().setBusy(false);
					 	sap.m.MessageToast.show(oError.responseJSON.message);
	ODialog.setBusy(false);
					// 	var mes = "";

						if (oError.responseJSON.errors) {
								if ( oError.responseJSON.errors["holiday"].name) {
								
						oInput2.setValueState("Error").setValueStateText( oError.responseJSON.errors["holiday"].name);
							
							} else {
							oInput2.setValueState("None");
							}

							if ( oError.responseJSON.errors["holiday"].year) {
								
						oInput2.setValueState("Error").setValueStateText( oError.responseJSON.errors["holiday"].year);
							
							} else {
							oInput2.setValueState("None");
							}
						
							// for (var i = 0; i < oErr.length; i++) {
							// 	mes = mes + oErr[i]  + '\xa0';
							// }
					// 			ODialog.getContent()[0].setValueState("Error");
					// ODialog.getContent()[0].setValueStateText(mes);
						}

					// MessageBox.error(
					// 	mes, {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					// );
					// 	}
					// });
				}

			});
	
}	
	},
	
	
	
	
	
	
	
	
	
	
			onNavBack: function () {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
				// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// 	oRouter.navTo("fullScreenRoute1", {

				// 		Branchname: this.TeamId,
				// Companyid: this.Companyid,
				// Branchid: this.Branchid

				// 	});
				}
			}
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ibm.fin.ar.view.Holidays
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ibm.fin.ar.view.Holidays
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ibm.fin.ar.view.Holidays
		 */
		//	onExit: function() {
		//
		//	}

	});

});