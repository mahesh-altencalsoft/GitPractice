sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.Company", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Fullscreen.view.View1
		 */

		//GLOBAL VARIABLES	 
		Totalrec: 0,
		TotalPage: 0,
	

		onInit: function () {
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=1&page_size=11";
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
				dataType: "json",
				success: this.successREST.bind(this),
				error: [this.errorREST, this]
			});
		},

		// oncompanyList: function (oPage) {

		// 	var sURL =
		// 		"https://cors-anywhere.herokuapp.com/https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=" + oPage +
		// 		"&page_size=10";
		// 	$.ajax({
		// 		type: "GET",
		// 		url: sURL,
		// 		contentType: "application/json",

		// 		headers: {
		// 			"accept": " */*",
		// 			"Access-Control-Allow-Origin": "*",
		// 			"Access-Control-Allow-Credentials": true,
		// 			"Access-Control-Allow-Methods": "*"
		// 		},
		// 		dataType: "json",
		// 		success: this.successREST.bind(this),
		// 		error: [this.errorREST, this]
		// 	});
		// },
		successREST: function (Results) {
			var myData = Results.data;
			this.Totalrec = Results.metaData["totalRecords"];

			this.TotalPage = Math.ceil(this.Totalrec / 11); // 11 because list shows only 9 item, division operation gives total no of pages = no of buttons
			// var oModel = new sap.ui.model.json.JSONModel();

			// oModel.setData(Results);
			// // var oModel = new JSONModel();
			// oModel.setData({
			// 	"newData": myData
			// });

			var oMasterPage = this.getView().byId("idMasterPage");
			var OHeadertext = "Companies (" + this.Totalrec + ") ";
			oMasterPage.setTitle(OHeadertext);
			//step 3: Set the model to the list level as default model
			// this.getView().setModel(oModel, "oModelList");
			
			this.getView().getModel("oModelCompanyList").setData({
				"newData": myData
			});
             
             var oValue = this.getView().byId("idToolbarList").getVisible();
             if (oValue !== "true")
			{
				this.onPagination(this.Totalrec);
				
			}

		},

		errorREST: function (data) {

		},
		
		
		///this function does not call pagination function
		// 	oncompanyList1: function (oPage) {

		// 	var sURL =
		// 		"https://cors-anywhere.herokuapp.com/https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=" + oPage +
		// 		"&page_size=10";
		// 	$.ajax({
		// 		type: "GET",
		// 		url: sURL,
		// 		contentType: "application/json",

		// 		headers: {
		// 			"accept": " */*",
		// 			"Access-Control-Allow-Origin": "*",
		// 			"Access-Control-Allow-Credentials": true,
		// 			"Access-Control-Allow-Methods": "*"
		// 		},
		// 		dataType: "json",
		// 		success: this.successREST1.bind(this),
		// 		error: [this.errorREST, this]
		// 	});
		// },



		onItem: function (oEvent) {
			var oCompany = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.key;
			var oComName = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.value;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var sPath = oEvent.getSource().getBindingContextPath();
		
				var sPathIndex = sPath.split("/")[sPath.split("/").length - 1];
			oRouter.navTo("BothRoute", {

				companyid: oCompany,
				companyname: oComName,
				ComIndex : sPathIndex

			});

		},
		onCompanypress: function () {

			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Create New Company',
				icon: "sap-icon://add",
				// contentWidth :"30%",
				type: 'Standard',
				//	state: 'Information',
				content: new sap.m.Input({
					value: ""
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Create',
					//	icon:"sap-icon://accept",
					width: "auto",
					class: "sapUiLargeMarginBeginEnd",
					press: function (OEvent) {

						that.onCreateCompany(OEvent);

						// oDialog.close();
					}
				}),
				endButton: new sap.m.Button({
						type: "Emphasized",
						//	icon:"sap-icon://decline",
						text: 'Cancel',
						class: "sapUiLargeMarginBeginEnd",
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

		onCreateCompany: function (OEvent) {
			var that = this;
			var ODialog = OEvent.getSource().getParent();
			this.getView().setBusy(true);
			var that = this;
			var Company = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
			ODialog.setBusy(true);
			var oData = JSON.stringify({
				"name": Company
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company?$format=json";
			$.ajax({
				type: "POST",
				url: sURL,
				data: oData,
				contentType: "application/json",

				dataType: 'json', //Expected data format from server
				processdata: true, //True or False
				success: function (results) {
						ODialog.setBusy(false);
					ODialog.close();
					that.getView().setBusy(false);
					var oSuccess = Company + ' ' + "created successfully!!!";
					that.Totalrec = 1 + this.Totalrec;
						that.TotalPage = Math.ceil(that.Totalrec / 11);
					if (results.status === "SUCCESS") {
						that.onPagination(that.Totalrec);
						that.onInit();
						// 	var Data ={
						//  "id": results.Data,
						//  "name": results.message
						//};             	var oMasterPage = this.getView().byId("idMasterPage");
						var OHeadertext = "Companies (" + that.Totalrec + ") ";
						that.getView().byId("idMasterPage").setTitle(OHeadertext);
						//                that.getView().getModel("oModelList").getProperty("/newData").push([Data]); 
						MessageBox.success(
							oSuccess, {
								icon: MessageBox.Icon.Success,
								title: "Success",
								actions: MessageBox.Action.Close,
								emphasizedAction: null,
								initialFocus: MessageBox.Action.Close

							}
						);
					}
				},
				error: function (oError) {
					that.getView().setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);
			ODialog.setBusy(false);
					var mes = "";

					if (oError.responseJSON.errors) {

						var oErr = oError.responseJSON.errors["company"].name;
						for (var i = 0; i < oErr.length; i++) {
							// mes = mes + oErr[i] + ";" +  '\xa0' ; 
							mes = mes + oErr[i] + '\xa0';
						}

						ODialog.getContent()[0].setValueState("Error");
						ODialog.getContent()[0].setValueStateText(mes);
					}

					// MessageBox.error(
					// mes  , {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					// );
				}
			});
		},

		///pagination code for company
		// onPagination: function (ORec) {
		// 	var that = this;

		// 	if (ORec <= 10) {

		// 		this.getView().byId("idToolbarList").setVisible(false);
		// 		//        this.getView().byId("idToolbarList").setVisible(true);
		// 		// this.getView().byId("idPrev").setEnabled(false);
		// 		// this.getView().byId("idNext").setEnabled(false);

		// 		// this.getView().byId("idb1").setVisible(true);
		// 		// this.getView().byId("idb2").setVisible(false);
		// 		// this.getView().byId("idb3").setVisible(false);
		// 		// this.getView().byId("idb4").setVisible(false);

		// 	} else if (ORec <= 20) {
		// 		this.getView().byId("idToolbarList").setVisible(true);
		// 		// this.getView().byId("idPrev").setEnabled(false);
		// 		// this.getView().byId("idNext").setEnabled(false);
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "1",
		// 			type: "Emphasized",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "2",
		// 			type: "Default",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));

		// 		// this.getView().byId("idb1").setVisible(true);
		// 		// this.getView().byId("idb2").setVisible(true);
		// 		// this.getView().byId("idb3").setVisible(false);
		// 		// this.getView().byId("idb4").setVisible(false);

		// 	} else if (ORec <= 30) {

		// 		// this.getView().byId("idPrev").setEnabled(false);
		// 		// this.getView().byId("idNext").setEnabled(false);

		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "1",
		// 			type: "Emphasized",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "2",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "3",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));

		// 		//	  this.getView().byId("idb1")._bActive = true;
		// 	} else if (ORec <= 40) {

		// 		this.getView().byId("idToolbarList").setVisible(true);
		// 		// this.getView().byId("idPrev").setEnabled(false);
		// 		// this.getView().byId("idNext").setEnabled(false);

		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "1",
		// 			type: "Emphasized",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "2",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "3",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "4",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));

		// 		//  this.getView().byId("idb1")._bActive = true;
		// 	} else {

		// 		this.getView().byId("idToolbarList").setVisible(true);
		// 		// this.getView().byId("idPrev").setEnabled(false);
		// 		// this.getView().byId("idNext").setEnabled(true);

		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "1",
		// 			type: "Emphasized",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "2",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "3",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));
		// 		this.getView().byId("Buttonlist").addItem(new sap.m.Button({
		// 			text: "4",
		// 			press: function (oEvent) {
		// 				that.onclick(oEvent);
		// 			}
		// 		}));

		// 		//	  this.getView().byId("idb1")._bActive = true;
		// 	}

		// },
		// onclick: function (oEvent) {
		// 	var that = this;
		// 	var oEnd;
		// 	var Obuttons = this.getView().byId("Buttonlist").getItems();
		// 	Obuttons.forEach(function (item) {
		// 		if (item === oEvent.getSource()  && oEnd !== "stop") {
		// 			item.setType("Emphasized");
		// 			var PageNumber = parseInt(item.getText());
		// 			that.oncompanyList1(PageNumber);
		// 			oEnd="stop";
		// 		} else {
		// 			item.setType("Default");
		// 		}
		// 	});
		// },
		// onNext: function (oEvent) {
		// 	var Obuttons = this.getView().byId("Buttonlist").getItems();
		// 	var Blength = Obuttons.length;
		// 	var LastpageNumber = Obuttons[Blength - 1]["mProperties"].text;

		// 	if (parseInt(LastpageNumber) !== this.TotalPage) {

		// 		Obuttons.forEach(function (item) {
		// 			var number = parseInt(item.getText()) + 1;
		// 			item.setText(number);
		// 		});

		// 		// Obuttons.foreach(function(b){
		// 		// 	var number = parseInt(b.getText());
		// 		// 	b.setText(number);
		// 		// });
		// 	} else if (Obuttons[Blength - 1].getType() === "Emphasized") {
		// 		//do nothing
		// 		sap.m.MessageToast.show("No more Pages");
		// 	} else {
		// 		var a;
		// 		Obuttons.forEach(function (item, index) {

		// 			if (item.getType() === "Emphasized") {
		// 				if (a !== "stop") {
		// 					item.setType("Default");
		// 					Obuttons[index + 1].setType("Emphasized");
		// 					a = "stop";
		// 				}
		// 			}

		// 		});
		// 	}

		// 	alert(Obuttons.length);
		// },

		// onPrev: function (oEvent) {
		// 	var Obuttons = this.getView().byId("Buttonlist").getItems();
		// 	// var	Blength = Obuttons.length;
		// 	var FirstpageNumber = Obuttons[0]["mProperties"].text;

		// 	if (parseInt(FirstpageNumber) !== 1) {

		// 		Obuttons.forEach(function (item) {
		// 			var number = parseInt(item.getText()) - 1;
		// 			item.setText(number);
		// 		});

		// 		// Obuttons.foreach(function(b){
		// 		// 	var number = parseInt(b.getText());
		// 		// 	b.setText(number);
		// 		// });
		// 	} else if (Obuttons[0].getType() === "Emphasized") {
		// 		sap.m.MessageToast.show("You are at First Page");
		// 	} else {
		// 		var a;
		// 		Obuttons.forEach(function (item, index) {

		// 			if (item.getType() === "Emphasized") {
		// 				if (a !== "stop") {
		// 					item.setType("Default");
		// 					Obuttons[index - 1].setType("Emphasized");
		// 					a = "stop";
		// 				}
		// 			}

		// 		});
		// 	}

		// 	alert(Obuttons.length);
		// },
	onPagination: function (ORec) {
			
 	this.getView().byId("idb1").setText("1");
				this.getView().byId("idb1").setText("1").setType("Emphasized");
			this.getView().byId("idb2").setText("2").setType("Default");
			this.getView().byId("idb3").setText("3").setType("Default");
			this.getView().byId("idb4").setText("4").setType("Default");
	
		if (ORec <= 11) {
				//  this.getView().byId("idb1")._bActive = true;
				this.getView().byId("idToolbarList").setVisible(false);
	   //        this.getView().byId("idToolbarList").setVisible(true);
				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(false);

				// this.getView().byId("idb1").setVisible(true);
				// this.getView().byId("idb2").setVisible(false);
				// this.getView().byId("idb3").setVisible(false);
				// this.getView().byId("idb4").setVisible(false);

			} else if (ORec <= 22) {
				this.getView().byId("idToolbarList").setVisible(true);
				this.getView().byId("idPrev").setEnabled(true);
				this.getView().byId("idNext").setEnabled(true);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(false).setText("2");

			} else if (ORec <= 33) {

				this.getView().byId("idPrev").setEnabled(true);
				this.getView().byId("idNext").setEnabled(true);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(false).setText("3");

				//	  this.getView().byId("idb1")._bActive = true;
			} else if (ORec <= 44) {
				
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

			// if (this.Totalrec === oPrev + 4) {
			// 	this.getView().byId("idNext").setEnabled(false);
			// } else {
			// 	this.getView().byId("idNext").setEnabled(true);
			// }

			// if (parseInt(oPrev) - 1 === 1) {
			// 	//	this.getView().byId("idPrev").setEnabled(false);
			// }
			// this.onListBind();
		},

		onNext: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb4").getText());
			if (oNext >= this.TotalPage) {
				//do nothing
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Default");
					this.getView().byId("idb2").setType("Emphasized");
						this.onSecond();
				} 
				else if (this.getView().byId("idb2").getType() === "Emphasized" && this.getView().byId("idb2").getText() === this.TotalPage  )
				{
						this.getView().byId("idb2").setType("Emphasized");
						sap.m.MessageToast.show("No More Pages");
				}
				
				else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Default");
					this.getView().byId("idb3").setType("Emphasized");
					this.onThird();
				}
				else if (this.getView().byId("idb3").getType() === "Emphasized" && this.getView().byId("idb3").getText()  === this.TotalPage  )
				{
						this.getView().byId("idb3").setType("Emphasized");
						sap.m.MessageToast.show("No More Pages");
				}
				
				else if (this.getView().byId("idb3").getType() === "Emphasized") {
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
var that = this;
			this.getView().byId("idb1").setType("Emphasized");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb1").getText();

			// var oModel2 = this.getView().getModel("oModelList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=" + oPage + "&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					// oModel2.setData({
					// 	"newData": Results.data
					// });
					
	that.getView().getModel("oModelCompanyList").setData({
				"newData": Results.data
			});					
				},
				error: [this.errorREST, this]
			});

		},
		onSecond: function () {
			//sap.ui.core.BusyIndicator.show(20);
			//  a.show();	
var that = this;
			// var olist = this.getView().byId("idList").setBusy(true);
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Emphasized");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Default");

			var oPage = parseInt(this.getView().byId("idb2").getText());

			// var oModel2 = this.getView().getModel("oModelList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=" + oPage + "&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					// oModel2.setData({
					// 	"newData": Results.data
					// });
		that.getView().getModel("oModelCompanyList").setData({
				"newData": Results.data
			});					//sap.ui.core.BusyIndicator.hide();
					// olist.setBusy(false);
				},
				error: [this.errorREST, this]
			});
		},
		onThird: function () {
			
			var that = this;
			
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Emphasized");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb3").getText();

			var oModel2 = this.getView().getModel("oModelList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=" + oPage + "&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					
				that.getView().getModel("oModelCompanyList").setData({
				"newData": Results.data
			});	
				},
				error: [this.errorREST, this]
			});
		},
		onFourth: function () {
			
			var that = this;
			
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Emphasized");

			var oPage = this.getView().byId("idb4").getText();

			var oModel2 = this.getView().getModel("oModelList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/companies?page=" + oPage + "&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
			that.getView().getModel("oModelCompanyList").setData({
				"newData": Results.data
			});	
				},
				error: [this.errorREST, this]
			});
		},
		// onListBind: function () {

		// 	if (this.getView().byId("idb1").getType() === "Emphasized") {

		// 		var oCurrPage = this.getView().byId("idb1").getText();
		// 	} else if (this.getView().byId("idb2").getType() === "Emphasized") {
		// 		var oCurrPage = this.getView().byId("idb2").getText();
		// 	} else if (this.getView().byId("idb2").getType() === "Emphasized") {
		// 		var oCurrPage = this.getView().byId("idb3").getText();
		// 	} else {
		// 		var oCurrPage = this.getView().byId("idb4").getText();
		// 	}

		// },

		onEdit: function () {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Edit Your Company Name',
				contentWidth: "50%",
				icon: "sap-icon://edit",
				type: 'Standard',
				//	state: '',
				content: new sap.m.Input({
					value: ""
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Create',
					//	icon:"sap-icon://accept",
					width: "auto",
					class: "sapUiLargeMarginBeginEnd",
					press: function (OEvent) {

						that.onEditCompany(OEvent);

						oDialog.close();
					}
				}),
				endButton: new sap.m.Button({
					type: "Emphasized",
					//	icon:"sap-icon://decline",
					text: 'Cancel',
					class: "sapUiLargeMarginBeginEnd",
					width: "auto",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		}

		///end of pagonation code

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Fullscreen.view.View1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Fullscreen.view.View1
		 */
		// onAfterRendering: function() {

		// }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Fullscreen.view.View1
		 */
		//	onExit: function() {
		//
		//	}

	});

});