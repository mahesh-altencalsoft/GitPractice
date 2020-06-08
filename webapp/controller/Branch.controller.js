sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
		"sap/ui/core/routing/History",
], function (Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.Branch", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.Branch
		 */
		//Global Variables
		Branchname: '',
		Branchid: 0,
		oCompanyid: 0,
		HolidayListid: 0,
		HolidayListYear: 0,
		TeamTotalrec: 0,
		TeamTotalPage: 0,
		HolidayListTotalrec:0,
		HolidayListTotalPage:0,
		HolidaylistBranch: [],

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("fullScreenRoute1").attachPatternMatched(this._onObjectMatched, this);
		},

		onReadBranchName: function () {
			var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch?id=" + this.Branchid;
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
						that.Branchname = results.data.name;

						// sap.m.MessageToast("Company Saved Successfully");
					}
				},
				error: function (oError) {}

			});
		},

		_onObjectMatched: function (oEvent) {

			// this.Branchname = oEvent.getParameter("arguments").Branchname;
			this.Branchid = oEvent.getParameter("arguments").Branchid;
			this.oCompanyid = oEvent.getParameter("arguments").Companyid;
			// this.getView().byId("idojectheader").setObjectTitle(this.Branchname);
			this.onReadBranchName();
			this.onTeambinding(this.Branchid);
			this.onHolidayListBinding(this.oCompanyid, this.Branchid);
		},

		//Team list Binding	

		onTeambinding: function (okey) {

			var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/teams?id=" + okey + "&page=1&page_size=10 ";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: this.successTeamList.bind(this),
				error: [this.errorTeamList, this]
			});

		},

		successTeamList: function (Results) {
			var myData = Results.data;
			this.TeamTotalrec = Results.metaData["totalRecords"];

			this.TeamTotalPage = Math.ceil(this.TeamTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"TeamData": myData
			});

			this.getView().byId("idBranchsection").setTitle("Team(" + this.TeamTotalrec + ")");

			//step 3: Set the model to the list level as default model
			this.getView().setModel(oModel, "oModelTeamList");
			//	oList.setModel(oModel);
			this.onTeamPagination(this.TeamTotalrec);
		},

		errorTeamList: function (Results) {},

		onTeamPagination: function (ORec) {

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
				this.getView().byId("idb3").setVisible(false);
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

		},

		onNext: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb4").getText());
			if (oNext >= this.TeamTotalPage) {
				//do nothing
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Default");
					this.getView().byId("idb2").setType("Emphasized");
					this.onSecond();
				} else if (this.getView().byId("idb2").getType() === "Emphasized" && this.getView().byId("idb2").getText() == this.TeamTotalPage) {
					this.getView().byId("idb2").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Default");
					this.getView().byId("idb3").setType("Emphasized");
					this.onThird();
				} else if (this.getView().byId("idb3").getType() === "Emphasized" && this.getView().byId("idb3").getText() == this.TeamTotalPage) {
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

			var oModel2 = this.getView().getModel("oModelTeamList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/teams?id=" + this.Branchid + "&page=" + oPage +
				"&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"TeamData": Results.data
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

			var oModel2 = this.getView().getModel("oModelTeamList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/teams?id=" + this.Branchid + "&page=" + oPage +
				"&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"TeamData": Results.data
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

			var oModel2 = this.getView().getModel("oModelTeamList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/teams?id=" + this.Branchid + "&page=" + oPage +
				"&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"TeamData": Results.data
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

			var oModel2 = this.getView().getModel("oModelTeamList");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/teams?id=" + this.Branchid + "&page=" + oPage +
				"&page_size=11";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"TeamData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},

		onEditPress: function () {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Edit Your Branch Name',
				icon: "sap-icon://edit",
				type: 'Standard',
				//	state: '',
				content: new sap.m.Input({
					value: this.Branchname
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Save',
					//	icon:"sap-icon://accept",
					width: "auto",

					press: function (OEvent) {

						that.onEditBranch(OEvent);

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

			});

			oDialog.open();
		},
		onEditBranch: function (OEvent) {
			var ODialog = OEvent.getSource().getParent();
			this.getView().setBusy(true);
			var that = this;
			var Branch = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
ODialog.setBusy(true);
			var oData = JSON.stringify({
				"name": Branch
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch?id=" + this.Branchid;
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
					var oSuccess = "Branch Name" + ' ' + "Edited Successfully!!!";
					if (results.status === "SUCCESS") {
						that.Branchname = Branch;
						that.getView().byId("idojectheader").setObjectTitle(that.Branchname);
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
					sap.m.MessageToast.show(oError.responseJSON.message);
ODialog.setBusy(false);
					var mes = "";

					if (oError.responseJSON.errors) {
						var oErr = oError.responseJSON.errors["branch"].name;
						for (var i = 0; i < oErr.length; i++) {
							mes = mes + oErr[i] + '\xa0';
						}
						ODialog.getContent()[0].setValueState("Error");
						ODialog.getContent()[0].setValueStateText(mes);
						that.getView().setBusy(false);
					}
				}
			});
		},

		// onDeletePress: function () {
		// 	var that = this;

		// 	MessageBox.confirm("Are you sure you want  delete " + this.oBranchName + " Branch permanently?", {
		// 		title: "Delete",
		// 		icon: MessageBox.Icon.WARNING,
		// 		actions: ["YES", "NO"],
		// 		emphasizedAction: "NO",
		// 		initialFocus: "NO",
		// 		onClose: function (sAction) {
		// 			if (sAction === "NO") {
		// 				sap.m.MessageToast.show("Action Canceled");
		// 			} else {
		// 				that.onDeleteBranch();
		// 			}
		// 		}
		// 	});
		// 	// oDialog.open();
		// },

		// onDeleteBranch: function (OEvent) {

		// 	// var Company = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
		// 	// var oData = JSON.stringify({
		// 	// 	"name": Company
		// 	// });
		// 	var sURL = "https://cors-anywhere.herokuapp.com/https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/branch?id=" + this.Branchid;
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
		// 				"Something went Wrong!!!", {
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

		onNewTeam: function () {

			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Create New Team',
				icon: "sap-icon://citizen-connect",
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
				
					press: function (OEvent) {

						that.onCreateTeam(OEvent);

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
			}).addStyleClass("sapUiResponsiveMargin");

			oDialog.open();
		},

		onCreateTeam: function (OEvent) {
			var ODialog = OEvent.getSource().getParent();
		
		
			var that = this;
			var Team = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
			
			if (Team)
			{
					this.getView().setBusy(true);
					ODialog.setBusy(true);
			var oData = JSON.stringify({
				"name": Team
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team?branch=" + this.Branchid;
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
					var oSuccess = Team + ' ' + "created successfully!!!";
					if (results.status === "SUCCESS") {
	ODialog.setBusy(false);
						that.TeamTotalrec = that.TeamTotalrec + 1;
						that.onTeamPagination(that.TeamTotalrec);
						that.BranchTotalPage = Math.ceil(that.TeamTotalrec / 11);
						that.onFirst();
						// that.onBranchPagination(that.BranchTotalrec + 1);
								that.getView().byId("idBranchsection").setTitle("Team(" + that.TeamTotalrec + ")");
						// that.onFirst();
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
						var oErr = oError.responseJSON.errors["team"].name;
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
			}
			else{
				OEvent.getSource().getParent().getContent()[0].setValueState("Error").setValueStateText("Team Cannot be Blank");
			}
		},

		onTeamItem: function (oEvent) {
			var idTeam = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.key;
			var oTeamname = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.value;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.getView().getParent("oPrent").getParent().setVisible(false);
			// sap.ui.getCore().byId("__xmlview0--myApp2").setVisible(true);
			oRouter.navTo("BranchtoTeam", {

				Teamid: idTeam,
				companyid: this.oCompanyid,
				Branchid: this.Branchid

			});
		},


     	onHolidaylistItem: function (oEvent) {
			var idHLid =oEvent.getParameters()["listItem"].getCells()[0].getText();
			var year = oEvent.getParameters()["listItem"].getCells()[1].getText();
			// var oTeamname = oEvent.getSource("mAggregations")["mAggregations"].customData[0].mProperties.value;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.getView().getParent("oPrent").getParent().setVisible(false);
			// sap.ui.getCore().byId("__xmlview0--myApp2").setVisible(true);
			oRouter.navTo("BranchtoHoliday", {

				Holidaylistid: idHLid,
				year :year
				

			});
		},
		///////Holiday list Coding
// 		onHolidayListBinding: function (oCompany, oBranch) {
// 			var that = this;
// 			this.HolidaylistBranch = [];
// 			///get the list of holiday year using company
// 			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/holiday-lists?id=" + oCompany ;
			
// 			$.ajax({
// 				type: "GET",
// 				url: sURL,
// 				contentType: "application/json",
// 				dataType: "json",
// 				success: this.successHolidayList.bind(this),
// 				error: function () {

// 				}
// 			});

// 		},

// 		successHolidayList: function (Results) {
// this.HolidayListTotalrec =0;
// 			var that = this;
// 			var HolidayYear = this.removeDuplicates(Results.data, 'year');

		
// 			for (var i = 0; i < HolidayYear.length; i++) {
// 				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list?id=" + this.Branchid + "&year=" +
// 					HolidayYear[i].year;
// 				$.ajax({
// 					type: "GET",
// 					url: sURL,
// 					contentType: "application/json",
// 					dataType: "json",
// 					success: this.successBindHolidayList.bind(this),
// 					error: function () {

// 					}
// 				});

// 			}

// 		},

// 		successBindHolidayList: function (Results) {

// 			//this.HolidaylistBranch = Results.data +  this.HolidaylistBranch;
// 			var myData = Results.data;
// this.HolidayListTotalrec = 1 + parseInt(this.HolidayListTotalrec);
// this.HolidayListTotalPage = Math.ceil(this.HolidayListTotalrec / 10); 
// 				if(myData){
					
// 				this.HolidaylistBranch.push({
// 				id: myData.id,
// 				name: myData.name,
// 				year: myData.year
// 			});		
// 				}
		
// 			var oModel = new sap.ui.model.json.JSONModel();
// 			// oModel.setData(Results);
// 			oModel.setData({
// 				"HolidayListData": this.HolidaylistBranch
// 			});

// 			this.getView().setModel(oModel, "oModelHolidayList");
// 		this.onHolidayListPagination(this.HolidayListTotalrec);
// 		},


// removeDuplicates: function(array, key){
// var lookup = {};
//     var result = [];
//     for(var i=0; i<array.length; i++) {
//         if(!lookup[array[i][key]]){
//             lookup[array[i][key]] = true;
//             result.push(array[i]);
//         }
//     }
//     return result;	
// },

///end of holiday list code  

///New Holiday list code

onHolidayListBinding: function(){
		var that = this;
		
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list/history?branch="+this.Branchid+"&from=1800&page=1&page_size=10&to=9999";
		
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
						var myData = Results.data;
			that.HolidayListTotalrec = Results.metaData["totalRecords"];

			that.HolidayListTotalPage = Math.ceil(that.HolidayListTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"HolidayListData": myData
			});

			that.getView().byId("idHolidysection").setTitle("Holiday List(" + that.HolidayListTotalrec + ")");

			//step 3: Set the model to the list level as default model
			that.getView().setModel(oModel, "oModelHolidayList");
			//	oList.setModel(oModel);
				that.onHolidayListPagination(that.HolidayListTotalrec);
		
				},
				error: function () {

				}
			});
},

		onNewHolidayList: function (oEvent) {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Create New Holiday List',
				icon: "sap-icon://group-2",
				type: 'Standard',
				//	state: 'Information',
				content: new sap.m.VBox({
					items: [new sap.m.Input({
							value: "",
							placeholder: "Name of the Holiday List"
						}),

						new sap.m.Input({
							value: "",
							placeholder: "Year of the Holiday List",
							maxLength: 4
							
						})

					]
				}).addStyleClass("sapUiResponsiveMargin"),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Create',
					//	icon:"sap-icon://accept",
					width: "auto",

					press: function (OEvent) {

						that.onCreateHolidayList(OEvent);

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

		onCreateHolidayList: function (OEvent) {
			var flag;
			var ODialog = OEvent.getSource().getParent();
	
		
			var that = this;

			var oInput1 = OEvent.getSource().getParent().getContent()[0].getItems()[0];
			var oInput2 = OEvent.getSource().getParent().getContent()[0].getItems()[1];
			if (oInput1.getValue() === "") {
				oInput1.setValueState("Error").setValueStateText("Holiday List Name cannot be blank");
flag = 1;
			} else {
				oInput1.setValueState("None");
				var Name = oInput1.getValue();
			
			}
			if (oInput2.getValue() === "") {
				oInput2.setValueState("Error").setValueStateText("Year cannot be blank");
				flag=1;
			} else {
				oInput2.setValueState("None");
				var Year = oInput2.getValue();
			
			}
if (flag !== 1){
	var oData = JSON.stringify({
				"name": Name,
				"year": Year
			});
			
	
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list/create?branch=" + this.Branchid;		

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
							var Mes = "Holiday List has been applied to Branch Successfuly";
								that.HolidayListTotalrec = parseInt(that.HolidayListTotalrec + 1);
					
						that.HolidayListTotalPage = Math.ceil(that.HolidayListTotalrec / 10);
						that.onFirst1();
							that.getView().byId("idHolidysection").setTitle("Holiday List(" + that.HolidayListTotalrec + ")");
							that.onHolidayListPagination(that.HolidayListTotalrec);
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
								if ( oError.responseJSON.errors["holiday-list"].name) {
								
						oInput2.setValueState("Error").setValueStateText( oError.responseJSON.errors["holiday-list"].name);
							
							} else {
							oInput2.setValueState("None");
							}

							if ( oError.responseJSON.errors["holiday-list"].year) {
								
						oInput2.setValueState("Error").setValueStateText( oError.responseJSON.errors["holiday-list"].year);
							
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
		
	///pagination code
		onHolidayListPagination: function (ORec) {

			//              if(ORec === 0){
			//              this.getView().byId("idToolbarList").setVisible(false);      //pagination footer diable
			//              }

			// else 
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

		
		},

		onNext1: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb8").getText());
	if (oNext >= this.HolidayListTotalPage) {
		//do nothing
				if (this.getView().byId("idb5").getType() === "Emphasized") {
					this.getView().byId("idb5").setType("Default");
					this.getView().byId("idb6").setType("Emphasized");
					this.onSecond1();
				} else if (this.getView().byId("idb6").getType() === "Emphasized" && this.getView().byId("idb6").getText() == this.HolidayListTotalPage) {
					this.getView().byId("idb6").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb6").getType() === "Emphasized") {
					this.getView().byId("idb6").setType("Default");
					this.getView().byId("idb7").setType("Emphasized");
					this.onThird1();
				} else if (this.getView().byId("idb7").getType() === "Emphasized" && this.getView().byId("idb7").getText() == this.HolidayListTotalPage) {
					this.getView().byId("idb7").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb7").getType() === "Emphasized") {
					this.getView().byId("idb7").setType("Default");
					this.getView().byId("idb8").setType("Emphasized");
					this.onFourth();
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

			var oPage = this.getView().byId("idb1").getText();

			// var oModel2 = this.getView().getModel("oModelEmpList");
			// oModel2.setData({
			// 	"newData": myData 
			// });
		var that = this;
			// this.HolidaylistBranch = [];
			///get the list of holiday year using company
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list/history?branch="+this.Branchid+"&from=1800&page="+oPage+"&page_size=10&to=9999";
			
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				


						var myData = Results.data;

	var oModel2 = that.getView().getModel("oModelHolidayList");	
					oModel2.setData({
				"HolidayListData": myData
			
				});	
				
			
		
					},
			
				error: function () {

				}
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

			var oPage = parseInt(this.getView().byId("idb2").getText());

			// var oModel2 = this.getView().getModel("oModelEmpList");
			// oModel2.setData({
			// 	"newData": myData
			// });
		var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list/history?branch="+this.Branchid+"&from=1800&page="+oPage+"&page_size=10&to=9999";
			
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				


						var myData = Results.data;

	var oModel2 = that.getView().getModel("oModelHolidayList");	
					oModel2.setData({
				"HolidayListData": myData
			
				});	
				
			
		
					},
			
				error: function () {

				}
			});
		},
		
		
		onThird1: function () {
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Emphasized");
			this.getView().byId("idb8").setType("Default");

			var oPage = this.getView().byId("idb3").getText();

			var that = this;
		var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list/history?branch="+this.Branchid+"&from=1800&page="+oPage+"&page_size=10&to=9999";
			
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				


						var myData = Results.data;

	var oModel2 = that.getView().getModel("oModelHolidayList");	
					oModel2.setData({
				"HolidayListData": myData
			
				});	
				
			
		
					},
			
				error: function () {

				}
			});
		},
		onFourth1: function () {
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Default");
			this.getView().byId("idb8").setType("Emphasized");

			var oPage = this.getView().byId("idb8").getText();

		var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/branch/holiday-list/history?branch="+this.Branchid+"&from=1800&page="+oPage+"&page_size=10&to=9999";
			
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				


						var myData = Results.data;

	var oModel2 = that.getView().getModel("oModelHolidayList");	
					oModel2.setData({
				"HolidayListData": myData
			
				});	
				
			
		
					},
			
				error: function () {

				}
			});
		},
		
		
		
				onNavBack: function () {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.back();
				} 
				else {
				// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// 	oRouter.navTo("fullScreenRoute1", {

				// 		Branchname: this.TeamId,
				// Companyid: this.Companyid,
				// Branchid: this.Branchid

				// 	});
				}
			}

		// onPageHighlight_Emp: function () {

		// 	if (this.getView().byId("idb5").getType() === "Emphasized") {

		// 		var oCurrPage = this.getView().byId("idb5").getText();
		// 	} else if (this.getView().byId("idb6").getType() === "Emphasized") {
		// 		var oCurrPage = this.getView().byId("idb6").getText();
		// 	} else if (this.getView().byId("idb7").getType() === "Emphasized") {
		// 		var oCurrPage = this.getView().byId("idb7").getText();
		// 	} else {
		// 		var oCurrPage = this.getView().byId("idb8").getText();
		// 	}

		// },
	

	});

});