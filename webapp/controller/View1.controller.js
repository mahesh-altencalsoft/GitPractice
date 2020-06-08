
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"ibm/fin/ar/utils/formatter",
	"sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, MessageBox, formatter, Fragment) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.View1", {

		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Workforce.view.View1
		 */
		//GLOBAL VARIABLES	 
		EmpTotalrec: 0,
		EmpTotalPage: 0,
		BranchTotalrec: 0,
		BranchTotalPage: 0,
		oCompanyName: '',
		oCompanyKey: 0,
		aMessages: new Array(),
			CompanyIndex: null,

		onInit: function () {
			// this.oRouter = this.getOwnerComponent().getRouter();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("BothRoute").attachPatternMatched(this._onObjectMatched, this);
			// this.getView().getParent("oPrent").getParent("oPrent").getParent("mAggregations").getContent()[0].setVisible(true);
			//			this.getView().getParent("oPrent").getParent("oPrent").getParent("mAggregations").getContent()[1].setVisible(false);

		},

		onReadCompanyName: function () {
			var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company?id=" + this.oCompanyKey;
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

						that.getView().byId("idojectheader").setObjectTitle(results.data.name);
						that.oCompanyName = results.data.name;

						// sap.m.MessageToast("Company Saved Successfully");
					}
				},
				error: function (oError) {}

			});
		},

		_onObjectMatched: function (oEvent) {

			// this.oCompanyName = oEvent.getParameter("arguments").companyname;
			this.oCompanyKey = oEvent.getParameter("arguments").companyid;
			// this.getView().byId("idojectheader").setObjectTitle(this.oCompanyName);
		this.CompanyIndex =  oEvent.getParameter("arguments").ComIndex;
			var oProperty =  "/newData/"+this.CompanyIndex+"/name";
	var CompanyName = 	this.getView().getModel("oModelCompanyList").getProperty(oProperty);
	if(!CompanyName)
{
	 this.onReadCompanyName();
}
	 else
	 {
		this.getView().byId("idojectheader").setObjectTitle(CompanyName);
	 }	
			// this.onReadCompanyName();
			// if(!this.BranchTotalrec)
			this.onBranchbinding(this.oCompanyKey);
			// if(!this.EmpTotalrec)
			this.onEmployeebinding(this.oCompanyKey);

		},

		onEditPress: function () {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Edit Your Company Name',
				icon: "sap-icon://edit",
				type: 'Standard',
				//	state: '',
				content: new sap.m.Input({
					value: this.oCompanyName
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Save',
					//	icon:"sap-icon://accept",
					width: "auto",

					press: function (OEvent) {

						that.onEditCompany(OEvent);

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

		onEditCompany: function (OEvent) {
			var ODialog = OEvent.getSource().getParent();
			this.getView().setBusy(true);
			var that = this;
			ODialog.setBusy(true);
			var Company = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
			var oData = JSON.stringify({
				"name": Company
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company?id=" + this.oCompanyKey;
			$.ajax({
				type: "PUT",
				url: sURL,
				data: oData,
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
					ODialog.close();
					that.getView().setBusy(false);
					var oSuccess = "Company Name" + ' ' + "Edited Successfully!!!";
					if (results.status === "SUCCESS") {
						
				////Company master view change  after edit
			
			var oProperty =  "/newData/"+that.CompanyIndex+"/name";
			that.getView().getModel("oModelCompanyList").setProperty(oProperty, Company);	
			  //// End of code
						
						that.getView().byId("idojectheader").setObjectTitle(Company);
						that.oCompanyName = Company;
						MessageBox.success(
							oSuccess, {
								icon: MessageBox.Icon.Success,
								title: "Success",
								actions: MessageBox.Action.Close,
								emphasizedAction: null,
								initialFocus: MessageBox.Action.Close

							}
						);
						// sap.m.MessageToast("Company Saved Successfully");
					}
				},
				error: function (oError) {
					that.getView().setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);

					var mes = "";

					if (oError.responseJSON.errors) {
						var oErr = oError.responseJSON.errors["company"].name;
						for (var i = 0; i < oErr.length; i++) {
							mes = mes + oErr[i] + '\xa0';
						}
						ODialog.getContent()[0].setValueState("Error");
						ODialog.getContent()[0].setValueStateText(mes);
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
				}
			});
		},

		// onDeletePress: function () {
		// 	var that = this;

		// 	MessageBox.confirm("Are you sure you want  delete " + this.oCompanyName + " company permanently?", {
		// 		title: "Delete",
		// 		icon: MessageBox.Icon.WARNING,
		// 		actions: ["YES", "NO"],
		// 		emphasizedAction: "NO",
		// 		initialFocus: "NO",
		// 		onClose: function (sAction) {
		// 			if (sAction === "NO") {
		// 				sap.m.MessageToast.show("Action Canceled");
		// 			} else {
		// 				that.onDeleteCompany();
		// 			}
		// 		}
		// 	});
		// 	// oDialog.open();
		// },

		// onDeleteCompany: function (OEvent) {

		// 	// var Company = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
		// 	// var oData = JSON.stringify({
		// 	// 	"name": Company
		// 	// });
		// 	var sURL = "https://cors-anywhere.herokuapp.com/https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company?id=" + this.oCompanyKey;
		// 	$.ajax({
		// 		type: "DELETE",
		// 		url: sURL,
		// 		// data: oData,
		// 		contentType: "application/json",
		// 		headers: {
		// 			"accept": " */*",
		// 			"Access-Control-Allow-Origin": "*",
		// 			"Access-Control-Allow-Credentials": true,
		// 			"Access-Control-Allow-Methods": "*"
		// 		},

		// 		//
		// 		dataType: 'json', //Expected data format from server
		// 		processdata: true, //True or False
		// 		success: function (results) {
		// 			//		var oSuccess = Company + '\xa0' + " Edited Successfully!!!";
		// 			if (results.status === "SUCCESS") {

		// 				// MessageBox.success(
		// 				// 	oSuccess, {
		// 				// 		icon: MessageBox.Icon.Success,
		// 				// 		title: "Message",
		// 				// 		actions: MessageBox.Action.Close,
		// 				// 		emphasizedAction: null,
		// 				// 		initialFocus: MessageBox.Action.Close

		// 				// 	}
		// 				// );
		// 				sap.m.MessageToast.show("Company deleted Successfully");
		// 			}
		// 		},
		// 		error: function (oError) {
		// 			MessageBox.error(
		// 				oError.responseText, {
		// 					icon: MessageBox.Icon.Error,
		// 					title: "Error",
		// 					actions: sap.m.MessageBox.Action.Close, // default
		// 					emphasizedAction: null,
		// 					initialFocus: null

		// 				}
		// 			);
		// 		}
		// 	});
		// },

		//Branch list Binding	

		onBranchbinding: function (okey) {

			var that = this;

			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/branches?id=" + okey + "&page=1&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: this.successBranchList.bind(this),
				error: [this.errorBranchList, this]
			});

		},

		successBranchList: function (Results) {
			var myData = Results.data;
			this.BranchTotalrec = Results.metaData["totalRecords"];

			this.BranchTotalPage = Math.ceil(this.BranchTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"BranchData": myData
			});

			this.getView().byId("idBranchsection").setTitle("Branch(" + this.BranchTotalrec + ")");

			//step 3: Set the model to the list level as default model
			this.getView().setModel(oModel, "oModelBranchList");
			//	oList.setModel(oModel);
			this.onBranchPagination(this.BranchTotalrec);
		},

		errorBranchList: function (Results) {},

		///End of branch list Binding

		//Company Table Binding
		onEmployeebinding: function (okey) {

			var that = this;

			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company=" + okey +
				"&page=1&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: this.SuccessEmpList.bind(this),
				error: [this.errorEmpList, this]
			});

		},

		SuccessEmpList: function (Results) {
			var EmpData = Results.data;
			this.EmpTotalrec = Results.metaData["totalRecords"];

			this.EmpTotalPage = Math.ceil(this.EmpTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"EmpData": EmpData
			});

			this.getView().byId("idEmpsection").setTitle("Employees(" + this.EmpTotalrec + ")");

			//step 3: Set the model to the list level as default model
			this.getView().setModel(oModel, "oModelEmpList");
			//	oList.setModel(oModel);

			//	oList.setModel(oModel);
			this.onEmployeePagination(this.EmpTotalrec);
		},

		errorEmpList: function (Results) {},

		///End of Company Binding

		///Pagination code for Branch List
		///pagination code
		onBranchPagination: function (ORec) {

			this.getView().byId("idb1").setText("1").setType("Emphasized");
			this.getView().byId("idb2").setText("2").setType("Default");
			this.getView().byId("idb3").setText("3").setType("Default");
			this.getView().byId("idb4").setText("4").setType("Default");
			if (ORec <= 10) {
				this.getView().byId("idToolbarList").setVisible(false);

				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(false);

				// this.getView().byId("idb1").setVisible(true);
				// this.getView().byId("idb2").setVisible(false);
				// this.getView().byId("idb3").setVisible(false);
				// this.getView().byId("idb4").setVisible(false);

			} else if (ORec <= 20) {

				this.getView().byId("idToolbarList").setVisible(true);

				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(false);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(false);
				this.getView().byId("idb4").setVisible(false).setText("2");

			} else if (ORec <= 30) {

				this.getView().byId("idToolbarList").setVisible(true);

				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(false);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(false).setText("3");

				//	  this.getView().byId("idb1")._bActive = true;
			} else if (ORec <= 40) {

				this.getView().byId("idToolbarList").setVisible(true);

				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(false);

				this.getView().byId("idb1").setVisible(true);
				this.getView().byId("idb2").setVisible(true);
				this.getView().byId("idb3").setVisible(true);
				this.getView().byId("idb4").setVisible(true);

				//  this.getView().byId("idb1")._bActive = true;
			} else {
				this.getView().byId("idToolbarList").setVisible(true);

				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(true);

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

			if (this.Totalrec === oPrev + 4) {
				this.getView().byId("idNext").setEnabled(false);
			} else {
				this.getView().byId("idNext").setEnabled(true);
			}

			if (parseInt(oPrev) - 1 === 1) {
				//	this.getView().byId("idPrev").setEnabled(false);
			}
			// this.onListBind();
		},
		onNext: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb4").getText());
			if (oNext >= this.BranchTotalPage) {
				//do nothing
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Default");
					this.getView().byId("idb2").setType("Emphasized");
					this.onSecond();
				} else if (this.getView().byId("idb2").getType() === "Emphasized" && this.getView().byId("idb2").getText() == this.BranchTotalPage) {
					this.getView().byId("idb2").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Default");
					this.getView().byId("idb3").setType("Emphasized");
					this.onThird();
				} else if (this.getView().byId("idb3").getType() === "Emphasized" && this.getView().byId("idb3").getText() == this.BranchTotalPage) {
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
			
			}

		},

		onFirst: function () {

			this.getView().byId("idb1").setType("Emphasized");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb1").getText();

			var oModel2 = this.getView().getModel("oModelBranchList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/branches?id=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"BranchData": Results.data
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

			var oModel2 = this.getView().getModel("oModelBranchList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/branches?id=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"BranchData": Results.data
					});
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

			var oModel2 = this.getView().getModel("oModelBranchList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/branches?id=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"BranchData": Results.data
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

			var oModel2 = this.getView().getModel("oModelBranchList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/branches?id=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"BranchData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},

		// onPageHighlight: function () {

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

		//Creation of new branch code
		onnewBranch: function () {

			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Create New Branch',
				icon: "sap-icon://add",
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

						that.onCreateBranch(OEvent);

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

		onCreateBranch: function (OEvent) {
			var ODialog = OEvent.getSource().getParent();
			this.getView().setBusy(true);
			var that = this;
			var Branch = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
			var oData = JSON.stringify({
				"name": Branch
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch?company=" + this.oCompanyKey;
			$.ajax({
				type: "POST",
				url: sURL,
				data: oData,
				contentType: "application/json",

				dataType: 'json', //Expected data format from server
				processdata: true, //True or False
				success: function (results) {
					ODialog.close();
					that.getView().setBusy(false);
					var oSuccess = Branch + ' ' + "created successfully!!!";
					if (results.status === "SUCCESS") {

						that.BranchTotalrec = that.BranchTotalrec + 1;
						that.onBranchPagination(that.BranchTotalrec);
						that.BranchTotalPage = Math.ceil(that.BranchTotalrec / 10);
						that.onFirst();
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

					var mes = "";

					if (oError.responseJSON.errors) {
						var oErr = oError.responseJSON.errors["branch"].name;
						for (var i = 0; i < oErr.length; i++) {
							mes = mes + oErr[i] + '\xa0';
						}
						ODialog.getContent()[0].setValueState("Error");
						ODialog.getContent()[0].setValueStateText(mes);
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
				}
			});
		},

		///Code to navigate the page from Company Detail to Branch Detail
		onBranchItem: function (oEvent) {
			var oBranch = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.key;
			var oBranchname = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.value;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.getView().getParent("oPrent").getParent().setVisible(false);
			// sap.ui.getCore().byId("__xmlview0--myApp2").setVisible(true);
			oRouter.navTo("fullScreenRoute1", {

				Branchid: oBranch,
		
				Companyid: this.oCompanyKey

			});

		},
		onNewEmployee: function (oEvent) {
			sap.m.MessageToast.show("Create a New Employee");
			var oView = this.getView();

			//	create dialog lazily
			if (!this.byId("idEmpDailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.EmployeeCreateForm",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idEmpDailog").open();
			}

		},
		onFormCancel: function () {
			this.byId("idEmpDailog").close();
			this.getView().byId("toggleInfoToolbar13").setPressed(false);
		},

		// handleMessagePopoverPress: function (oEvent) {
		// 	var oMessagePopover = new sap.m.MessagePopover({
		// 		items: {
		// 			path: '/',
		// 			template: new sap.m.MessageItem({
		// 				type: '{type}',
		// 				title: '{title}',
		// 				description: '{description}'
		// 			})

		// 		}

		// 	});

		// 	var oModel = new sap.ui.model.json.JSONModel();
		// 	oModel.setData(this.aMessages);
		// 	this.getView().setModel(oModel);
		// 	this.getView().addDependent(oMessagePopover);
		// 	oMessagePopover.toggle(oEvent.getSource());
		// },
		// onFormClear: function () {

		// 	this.aMessages = [];
		// 	this.byId("idfirstName").setValue("").setValueState("None");
		// 	this.byId("idMiddleName").setValue("").setValueState("None");
		// 	this.byId("idlastName").setValue("").setValueState("None");
		// 	this.byId("idBirthdate").setValue("").setValueState("None");
		// 	this.byId("idgender").setSelectedKey("M").setValueState("None");
		// 	this.byId("DP1").setValue("").setValueState("None");
		// 	this.byId("DP2").setValue("").setValueState("None");
		// 	this.byId("idemail").setValue("").setValueState("None");
		// },
		onFormSubmit: function (oEvent) {
			var that = this;
			var ErrorFlag;
			this.aMessages = [];
			var firstName = this.byId("idfirstName").getValue();
			var middleName = this.byId("idMiddleName").getValue();
			var lastName = this.byId("idlastName").getValue();
			var dob = this.byId("idBirthdate").getValue();
			var gender = this.byId("idgender")._getSelectedItemText();
			var joinDate = this.byId("DP1").getValue();
			var exitDate = this.byId("DP2").getValue();
			var email = this.byId("idemail").getValue();

			if (firstName === null || firstName === "") {
				this.byId("idfirstName").setValueState("Error");
				this.byId("idfirstName").setValueStateText("First Name cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("idfirstName").setValueState("None");
				// ErrorFlag = "";
			}

			if (joinDate === null || joinDate === "") {
				this.byId("DP1").setValueState("Error");
				this.byId("DP1").setValueStateText("Join Date cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("DP1").setValueState("None");
				// ErrorFlag = "";
			}

			if (dob === null || dob === "") {
				dob = null;
				// ErrorFlag =1;
			}

			if (exitDate === null || exitDate === "") {
				exitDate = null;
			}

			if (email === null || email === "") {
				this.byId("idemail").setValueState("Error");
				this.byId("idemail").setValueStateText("Email cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("idemail").setValueState("None");
				// ErrorFlag = "";
			}
			if (ErrorFlag !== 1) {

				this.byId("idEmpDailog").setBusy(true);

				var oData = JSON.stringify({
					"id": this.oCompanyKey,
					"firstName": firstName,
					"middleName": middleName,
					"lastName": lastName,
					"dob": dob,
					"gender": gender,
					"joinDate": joinDate,
					"exitDate": exitDate,
					"email": email
				});
				var sURL = "https://cors-anywhere.herokuapp.com/https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee?company=" +
					this.oCompanyKey;
				$.ajax({
					type: "POST",
					url: sURL,
					data: oData,
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
						// var oSuccess = "Company Name" + '\xa0' + "  Successfully!!!";
						if (results.status === "SUCCESS") {

							that.byId("idEmpDailog").setBusy(false);

							sap.m.MessageToast.show("Employee Created Successfully");
							that.EmpTotalrec = that.EmpTotalrec + 1;
							that.EmpTotalPage = Math.ceil(that.EmpTotalrec/10);
							that.onEmployeePagination(that.EmpTotalrec );
							that.onFirst1();
							that.byId("idEmpDailog").close();
							that.byId("idEmpDailog").destroy();

						}
					},
					error: function (oError) {
						// that.aMessages = [];
						var mes, ErrorMessage;
						that.byId("idEmpDailog").setBusy(false);
						sap.m.MessageToast.show(oError.responseJSON.message);
						if (oError.responseJSON.errors) {

							if (oError.responseJSON.errors.employee["."]) {
								mes = mes + oError.responseJSON.errors.employee["."] + '\xa0' + '\n';
							ErrorMessage = oError.responseJSON.errors.employee["."];
							// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Form Level',
								// 	description: oError.responseJSON.errors.employee["."]
								// });
								
							}
							//Gender 
							if (oError.responseJSON.errors.employee.gender) {
								that.byId("idgender").setValueState("Error");
								that.byId("idgender").setValueStateText(oError.responseJSON.errors.employee.gender);
								mes = mes + oError.responseJSON.errors.employee.gender + ";" + '\xa0' + '\n';
								// this.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Gender',
								// 	description: 'oError.responseJSON.errors.employee.gender'
								// });
							} else {
								that.byId("idgender").setValueState("None");
							}

							if (oError.responseJSON.errors.employee.firstName) {
								that.byId("idfirstName").setValueState("Error");
								that.byId("idfirstName").setValueStateText(oError.responseJSON.errors.employee.firstName);
								mes = mes + oError.responseJSON.errors.employee.firstName + ";" + '\xa0' + '\n';
								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'FirstName',
								// 	description: 'oError.responseJSON.errors.employee.firstName'
								// });
							} else {
								that.byId("idfirstName").setValueState("None");
							}

							if (oError.responseJSON.errors.employee.email) {
								that.byId("idemail").setValueState("Error");
								that.byId("idemail").setValueStateText(oError.responseJSON.errors.employee.email);
								mes = mes + oError.responseJSON.errors.employee.email + ";" + '\xa0' + '\n';
								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'E-mail',
								// 	description: 'oError.responseJSON.errors.employee.email'
								// });

							} else {
								that.byId("idemail").setValueState("None");
							}

							if (oError.responseJSON.errors.employee.joinDate) {
								that.byId("DP1").setValueState("Error");
								that.byId("DP1").setValueStateText(oError.responseJSON.errors.employee.joinDate);
								mes = mes + oError.responseJSON.errors.employee.joinDate + ";" + '\xa0' + '\n';
								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Join Date',
								// 	description: 'oError.responseJSON.errors.employee.joinDate'
								// });

							} else {
								that.byId("DP1").setValueState("None");
							}

							if (oError.responseJSON.errors.employee.dob) {
								that.byId("idBirthdate").setValueState("Error");
								that.byId("idBirthdate").setValueStateText(oError.responseJSON.errors.employee.dob);
								mes = mes + oError.responseJSON.errors.employee.dob + ";" + '\xa0' + '\n';

								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Date of Birth',
								// 	description: 'oError.responseJSON.errors.employee.dob'
								// });

							} else {
								that.byId("idBirthdate").setValueState("None");
							}

						}
						// 			if (this.aMessages) {
						// 				var oMessagePopover = new sap.m.MessagePopover({
						// 					items: {
						// 						path: '/',
						// 						template: new sap.m.MessageItem({
						// 							type: '{type}',
						// 							title: '{title}',
						// 							description: '{description}'
						// 						})

						// 					}

						// 				});

					if (ErrorMessage){
							 that.byId("idError").setVisible(true).setText("Error:"+ ErrorMessage);
					}
					else{
					 that.byId("idError").setVisible(false);	
					}
					}

					// that.byId("idEmpDailog").destroy();
					// that.byId("idEmpDailog").close();

				});
			} else {
				//do nothing
			}

			this.getView().byId("toggleInfoToolbar13").setPressed(false);

		},

		onclickemployee: function (oEvent) {
			var spath = oEvent.getParameters("listItem").listItem.mAggregations.cells[1].mBindingInfos.text.binding.oContext.sPath;
			var index = spath.split("/")[2];
			sap.m.MessageToast.show("Employee is selected!!!");
			var data = this.getView().getModel("oModelEmpList").getData().EmpData[index];
			var empid = data.id;
			var odata = {
				EmpData: data
			};
			this.getView().getModel("oModelEmpForm").setData(odata);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("EmplyoeeToDetail", {

				Employeeid: empid,
               companyid: this.oCompanyKey
			});
		},

		///Pagination code for employee list

		///pagination code
		onEmployeePagination: function (ORec) {
	this.getView().byId("idb5").setText("1").setType("Emphasized");
			this.getView().byId("idb6").setText("2").setType("Default");
			this.getView().byId("idb7").setText("3").setType("Default");
			this.getView().byId("idb8").setText("4").setType("Default");
			if (ORec <= 10) {
				this.getView().byId("idToolbarList1").setVisible(false);

				// this.getView().byId("idPrev").setEnabled(false);
				// this.getView().byId("idNext").setEnabled(false);

				// this.getView().byId("idb1").setVisible(true);
				// this.getView().byId("idb2").setVisible(false);
				// this.getView().byId("idb3").setVisible(false);
				// this.getView().byId("idb4").setVisible(false);

			} else if (ORec <= 20) {

				this.getView().byId("idToolbarList1").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(false);

				this.getView().byId("idb5").setVisible(true);
				this.getView().byId("idb6").setVisible(true);
				this.getView().byId("idb7").setVisible(false);
				this.getView().byId("idb8").setVisible(false).setText("2");

			} else if (ORec <= 30) {

				this.getView().byId("idToolbarList1").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(false);

				this.getView().byId("idb5").setVisible(true);
				this.getView().byId("idb6").setVisible(true);
				this.getView().byId("idb7").setVisible(true);
				this.getView().byId("idb8").setVisible(false).setText("3");

				//	  this.getView().byId("idb1")._bActive = true;
			} else if (ORec <= 40) {

				this.getView().byId("idToolbarList1").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(false);

				this.getView().byId("idb5").setVisible(true);
				this.getView().byId("idb6").setVisible(true);
				this.getView().byId("idb7").setVisible(true);
				this.getView().byId("idb8").setVisible(true);

				//  this.getView().byId("idb1")._bActive = true;
			} else {
				this.getView().byId("idToolbarList1").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(true);

				this.getView().byId("idb5").setVisible(true);
				this.getView().byId("idb6").setVisible(true);
				this.getView().byId("idb7").setVisible(true);
				this.getView().byId("idb8").setVisible(true);

				//	  this.getView().byId("idb1")._bActive = true;
			}

		},

		onPrev1: function () {

			//  this.getView().byId("idb1")._bActive = true;	
			var oPrev = this.getView().byId("idb5").getText();

			if (oPrev === "1") {
					if (this.getView().byId("idb5").getType() === "Emphasized") {
			sap.m.MessageToast.show("You are at First Page");
				} else if (this.getView().byId("idb6").getType() === "Emphasized") {
					this.getView().byId("idb5").setType("Emphasized");
					this.getView().byId("idb6").setType("Default");
					this.onFirst1();
				} else if (this.getView().byId("idb7").getType() === "Emphasized") {
					this.getView().byId("idb6").setType("Emphasized");
					this.getView().byId("idb7").setType("Default");
					this.onSecond1();
				} else {
					this.getView().byId("idb7").setType("Emphasized");
					this.getView().byId("idb8").setType("Default");
					this.onThird1();
				}
			} else {
				this.getView().byId("idb5").setText(parseInt(oPrev) - 1);
				this.getView().byId("idb6").setText(parseInt(oPrev));
				this.getView().byId("idb7").setText(parseInt(oPrev) + 1);
				this.getView().byId("idb8").setText(parseInt(oPrev) + 2);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb5").getType() === "Emphasized") {
					this.onFirst1();
				} else if (this.getView().byId("idb6").getType() === "Emphasized") {
					this.onSecond1();
				} else if (this.getView().byId("idb7").getType() === "Emphasized") {
					this.onThird1();
				} else {
					this.onFourth1();
				}
				//
			}

			// if (this.Totalrec === oPrev + 4) {
			// 	this.getView().byId("idNext1").setEnabled(false);
			// } else {
			// 	this.getView().byId("idNext1").setEnabled(true);
			// }

			// if (parseInt(oPrev) - 1 === 1) {
			// 	this.getView().byId("idPrev1").setEnabled(false);
			// }
			// this.onPageHighlight_Emp();
		},

		onNext1: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb8").getText());
	if (oNext >= this.EmpTotalPage) {
		//do nothing
				if (this.getView().byId("idb5").getType() === "Emphasized") {
					this.getView().byId("idb5").setType("Default");
					this.getView().byId("idb6").setType("Emphasized");
					this.onSecond1();
				} else if (this.getView().byId("idb6").getType() === "Emphasized" && this.getView().byId("idb6").getText() == this.EmpTotalPage) {
					this.getView().byId("idb6").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb6").getType() === "Emphasized") {
					this.getView().byId("idb6").setType("Default");
					this.getView().byId("idb7").setType("Emphasized");
					this.onThird1();
				} else if (this.getView().byId("idb7").getType() === "Emphasized" && this.getView().byId("idb7").getText() == this.EmpTotalPage) {
					this.getView().byId("idb7").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb7").getType() === "Emphasized") {
					this.getView().byId("idb7").setType("Default");
					this.getView().byId("idb8").setType("Emphasized");
					this.onFourth1();
				} else {
					//do nothing
					//this.onFourth();
					sap.m.MessageToast.show("No More Pages");
				}
		
	}
	
	else{
	this.getView().byId("idb5").setText(parseInt(oNext) - 2);
			this.getView().byId("idb6").setText(parseInt(oNext) - 1);
			this.getView().byId("idb7").setText(parseInt(oNext));
			this.getView().byId("idb8").setText(parseInt(oNext) + 1);	
			
				// code for highlighted button data load when previous button pressed
			if (this.getView().byId("idb5").getType() === "Emphasized") {
				this.onFirst1();
			} else if (this.getView().byId("idb6").getType() === "Emphasized") {
				this.onSecond1();
			} else if (this.getView().byId("idb7").getType() === "Emphasized") {
				this.onThird1();
			} else {
				this.onFourth1();
			}
			//
	}
			

		

	

		},

		onFirst1: function () {

			this.getView().byId("idb5").setType("Emphasized");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Default");
			this.getView().byId("idb8").setType("Default");

			var oPage = this.getView().byId("idb5").getText();

			var oModel2 = this.getView().getModel("oModelEmpList");
			// oModel2.setData({
			// 	"newData": myData 
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company=" + this.oCompanyKey +
				"&page="+oPage+"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"EmpData": Results.data
					});
				},
				error: [this.errorREST, this]
			});

		},
		onSecond1: function () {
			//sap.ui.core.BusyIndicator.show(20);
			//  a.show();	

			// var olist = this.getView().byId("idList").setBusy(true);
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Emphasized");
			this.getView().byId("idb7").setType("Default");
			this.getView().byId("idb8").setType("Default");

			var oPage = parseInt(this.getView().byId("idb6").getText());

			var oModel2 = this.getView().getModel("oModelEmpList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"EmpData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},
		onThird1: function () {
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Emphasized");
			this.getView().byId("idb8").setType("Default");

			var oPage = this.getView().byId("idb7").getText();

			var oModel2 = this.getView().getModel("oModelEmpList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"EmpData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},
		onFourth1: function () {
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Default");
			this.getView().byId("idb8").setType("Emphasized");

			var oPage = this.getView().byId("idb8").getText();

			var oModel2 = this.getView().getModel("oModelEmpList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company=" + this.oCompanyKey +
				"&page=" + oPage + "&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"EmpData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},

		onPageHighlight_Emp: function () {

			if (this.getView().byId("idb5").getType() === "Emphasized") {

				var oCurrPage = this.getView().byId("idb5").getText();
			} else if (this.getView().byId("idb6").getType() === "Emphasized") {
				var oCurrPage = this.getView().byId("idb6").getText();
			} else if (this.getView().byId("idb7").getType() === "Emphasized") {
				var oCurrPage = this.getView().byId("idb7").getText();
			} else {
				var oCurrPage = this.getView().byId("idb8").getText();
			}

		},

		///End of pagination logic
		// 	onNext: function (){
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// oRouter.navTo("fullScreenRoute1", {

		// 	companyid :'' ,
		// 	companyname: ''

		// });

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Workforce.view.View1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Workforce.view.View1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Workforce.view.View1
		 */
		//	onExit: function() {
		//
		//	}

	});

});