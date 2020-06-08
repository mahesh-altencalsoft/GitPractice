sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
		"ibm/fin/ar/utils/formatter",
			"sap/ui/core/routing/History",
				'sap/m/ColorPalettePopover',
				'sap/ui/unified/ColorPickerDisplayMode'
], function (Controller, MessageBox, Fragment,formatter,History,ColorPalettePopover, ColorPickerDisplayMode) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.Team", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.Team
		 */
formatter : formatter,
		//Global Variable
		TeamId: 0,
		TeamName: "",
		Branchid: 0,
		Companyid: 0,
		ShiftGroup: "",
		TeamMemberRow: [],
		Skill: "",
		Shift: "",
		
		TeamMemberTotalrec:0,
        TeamMemberTotalPage:0,
     	ShiftTotalrec:0,
        ShiftTotalPage:0,
       	ShiftGrpTotalrec:0,
        ShiftGrpTotalPage:0,
       	SkillTotalrec:0,
        SkillTotalPage:0,
        LeaveTotalrec:0,
        LeaveTotalPage:0,
        
        
		onInit: function () {
			//this.getView().byId("idfilter").addStyleClass("myWidth");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("BranchtoTeam").attachPatternMatched(this._onObjectMatched, this);

         	var date = new Date();
  this.Startdate = new Date(date.getFullYear(), date.getMonth(), 1);
   this.Startdate1 =  this.Startdate  ;
  
  //oDRS2.setDateValue(new Date(2016, 1, 16));
		// 	oDRS2.setSecondDateValue(new Date(2016, 1, 18));
  	this.Enddate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			// 
		 this.Enddate1 = this.Enddate;
		this.byId("idrangemember").setDateValue(this.Startdate).setSecondDateValue(this.Enddate );
		
		 this.byId("idrangeleave").setDateValue(this.Startdate1).setSecondDateValue(this.Enddate1 );
var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
    pattern: 'yyyy-MM-dd'
});		
	this.Enddate1 = this.Enddate = oDateFormat.format(this.Enddate);
   	 this.Startdate1	= this.Startdate =  oDateFormat.format(this.Startdate);
		},

		oneditrow: function (oEvent) {
			var currentItem = oEvent.getSource().getParent().getParent();
			this.id = currentItem.getCells()[0].mProperties["text"];
			var Name = currentItem.getCells()[1].mProperties["text"];
			var From = currentItem.getCells()[2].mProperties["text"];
			var To = currentItem.getCells()[3].mProperties["text"];
			var oView = this.getView();

			//	create dialog lazily
			if (!this.byId("idTeamMemberDailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.TeamMemberHistory",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idTeamMemberDailog").open();
			}
			
			this.byId("idmemberName").setText(Name);
			this.byId("idmemberfrom").setValue(From);
			if (To === "31-Dec-9999") {
				//do nothing
			} else {
				this.byId("idmemberTo").setValue(To);
			}

			this.byId("idlableemp").setVisible(false);
			this.byId("idemp").setVisible(false);
			this.byId("idAdd").setVisible(false);
		},

		onMemberSubmit: function (oEvent) {
			var oDailog = oEvent.getSource().getParent();
			oDailog.setBusy(true);
			var that = this;
			this.getView().setBusy(true);
			var oData;
			var flag = 0;
			var employeeId = this.id;
			var memberTill = this.byId("idmemberTo").getValue();
			var memberFrom = this.byId("idmemberfrom").getValue();

			if (memberTill) {
				oData = JSON.stringify({
					"employeeId": employeeId,
					"memberFrom": memberFrom,
					"memberTill": memberTill
				});

			} else {

				oData = JSON.stringify({
					"employeeId": employeeId,
					"memberFrom": memberFrom
				});
			}
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee?employee=" +
				employeeId + "&member_from=" + memberFrom + "&team=" + this.Teamid;
			$.ajax({
				type: "PUT",
				url: sURL,
				data: oData,
				contentType: "application/json",

				dataType: 'json', //Expected data format from server
				processdata: true, //True or False
				success: function (results) {
				oDailog.close();
					oDailog.setBusy(false);
					that.getView().setBusy(false);
					var oSuccess = "Team Member edited successfully!!!";
					if (results.status === "SUCCESS") {
		that.onTeamMemberBinding();
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
					oDailog.setBusy(false);
					that.getView().setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);

					// var mes = "";

					// if (oError.responseJSON.errors) {
					// 	var oErr = oError.responseJSON.errors["branch"].name;
					// 	for (var i = 0; i < oErr.length; i++) {
					// 		mes = mes + oErr[i] + '\xa0';
					// 	}

					// }

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
		
		onMemberCancel: function () {
			this.byId("idTeamMemberDailog").destroy();
		},
		
		handleValueEmployee: function (oEvent) {
			var oView = this.getView();
			this.inputId = oEvent.getSource().getId();
			if (!this.byId("idempdailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.EmployeeList",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idempdailog").open();
			}

			this.onEmployeebinding();
		},

        onSearch:function(oEvent){
          	var that=this;
			var sQuery = oEvent.getParameters().value;
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company="+this.Companyid+"&name_query="+sQuery+"&page=1&page_size=30";
				
				// "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/teams?company="+this.Companyid+"&name_query="+sQuery+"&page_size=30"; //+ this.Companyid +

			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				var EmpData = Results.data;
			// this.EmpTotalrec = Results.metaData["totalRecords"];

			// this.EmpTotalPage = Math.ceil(this.EmpTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = that.getView().getModel("oModelEmpList");
			oModel.setData(Results);
			oModel.setData({
				"EmpData": EmpData
			});		
				},
				error: function(){}
			});
},

		onEmployeebinding: function (okey) {

			var that = this;

			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/employees?company="+this.Companyid+"&page=1&page_size=30"; //+ this.Companyid +

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
			// this.EmpTotalrec = Results.metaData["totalRecords"];

			// this.EmpTotalPage = Math.ceil(this.EmpTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"EmpData": EmpData
			});

			// this.getView().byId("idEmpsection").setTitle("Employees(" + this.EmpTotalrec + ")");

			//step 3: Set the model to the list level as default model
			this.getView().setModel(oModel, "oModelEmpList");
			//	oList.setModel(oModel);

			//	oList.setModel(oModel);

		},

		errorEmpList: function (Results) {},

		_handleValueHelpClose: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			// var oValue = oSelectedItem["mProperties"].title;
			if (oSelectedItem) {
				this.okey = oSelectedItem["mAggregations"].customData[0].mProperties.key;
				//one way to set
				// this.byId("idemp").setValue(oValue);	
				//second way
				this.byId(this.inputId).setValue(oSelectedItem.getTitle());
			}
		},

		onAddTeamMember: function () {

			var oView = this.getView();
			if (!this.byId("idTeamMemberDailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.TeamMemberHistory",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idTeamMemberDailog").open();
			}
			this.byId("idmemberName").setVisible(false);
			this.byId("idmemberfrom").setEditable(true);
			this.byId("idupdate").setVisible(false);
		},

		onMemberAdd: function (oEvent) {
			var oDailog = oEvent.getSource().getParent();
			oDailog.setBusy(true);
			var that = this;
			this.getView().setBusy(true);
			var oData;
			var flag = 0;
			var employeeId = this.okey;
			var memberTill = this.byId("idmemberTo").getValue();
			var memberFrom = this.byId("idmemberfrom").getValue();

			if (!employeeId) {
				this.byId("idemp").setValueState("Error").setValueStateText("Member Name cannot be Blank");
				flag = 1;
			} else {
				this.byId("idemp").setValueState("None");
				flag = "";
			}
			if (!memberFrom) {
				this.byId("idmemberfrom").setValueState("Error").setValueStateText("From Date Cannot be Blank");
				flag = 1;
			} else {
				this.byId("idmemberfrom").setValueState("None");
				flag = ""
			}

			if (memberTill) {
				oData = JSON.stringify({
					"employeeId": employeeId,
					"memberFrom": memberFrom,
					"memberTill": memberTill
				});

			} else {

				oData = JSON.stringify({
					"employeeId": employeeId,
					"memberFrom": memberFrom
				});
			}

			if (flag !== 1) {
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee?id=" +
					this.Teamid;
				$.ajax({
					type: "POST",
					url: sURL,
					data: oData,
					contentType: "application/json",

					dataType: 'json', //Expected data format from server
					processdata: true, //True or False
					success: function (results) {

						var oSuccess = "Team Member added successfully!!!";
						if (results.status === "SUCCESS") {
                       oDailog.destroy();
                       	that.getView().setBusy(false);
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
oDailog.close();
	that.getView().setBusy(true);
						sap.m.MessageToast.show(oError.responseJSON.message);

						var mes = "";

						if (oError.responseJSON.errors) {
							var oErr = oError.responseJSON.errors["branch"].name;
							for (var i = 0; i < oErr.length; i++) {
								mes = mes + oErr[i] + '\xa0';
							}

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

		},

		ondeletememberdialog: function (oEvent) {
			var that = this;
				// this.deleteoDailog = oEvent.getSource().getParent();
					var currentItem = oEvent.getSource().getParent().getParent();
	  	this.idelete = currentItem.getCells()[0].mProperties["text"];
			// var this.deleteName = currentItem.getCells()[1].mProperties["text"];
			 this.deleteFrom = currentItem.getCells()[2].mProperties["text"];
			 this.deleteTo = currentItem.getCells()[3].mProperties["text"];

			MessageBox.confirm("Are you sure you want to delete this member from the " + this.TeamName + "  permanently?", {
				title: "Delete",
				icon: MessageBox.Icon.WARNING,
				actions: ["YES", "NO"],
				emphasizedAction: "NO",
				initialFocus: "NO",
				onClose: function (sAction) {
					if (sAction === "NO") {
						sap.m.MessageToast.show("Action Canceled");
					} else {
						that.ondeletemember();
						that.getView().setBusy(true);
					}
				}
			});
		},
		
        ondeletemember: function(oEvent){
	//var deleteoDailog = oEvent.getSource().getParent();
var that = this;
			// var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee?employee="+	this.idelete+"&member_from=" +this.deleteFrom+"&team=" + this.Teamid;
	var sURL= "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee?employee=30&member_from=2020-05-20&team=25";
			$.ajax({
				type: "DELETE",
			
				// data: oData,
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
					//		var oSuccess = Company + '\xa0' + " Edited Successfully!!!";
					if (results.status === "SUCCESS") {
							that.onTeamMemberBinding();
          //  deleteoDailog.setBusy(false);
        //    that.deleteoDailog.close();
              that.getView().setBusy(false);
						// MessageBox.success(
						// 	oSuccess, {
						// 		icon: MessageBox.Icon.Success,
						// 		title: "Message",
						// 		actions: MessageBox.Action.Close,
						// 		emphasizedAction: null,
						// 		initialFocus: MessageBox.Action.Close

						// 	}
						// );
						sap.m.MessageToast.show("Company deleted Successfully");
					}
				},
				error: function (oError) {
				//	 deleteoDailog.setBusy(false);
          //  that.deleteoDailog.close();
            that.getView().setBusy(false);
					MessageBox.error(
						oError.responseText, {
							icon: MessageBox.Icon.Error,
							title: "Error",
							actions: sap.m.MessageBox.Action.Close, // default
							emphasizedAction: null,
							initialFocus: null

						}
					);
				}
			});
	
},		
		
		onReadTeamName: function () {
			var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team?id=" + this.Teamid;
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

						that.getView().byId("TeamPage").setTitle(results.data.name);
						that.TeamName = results.data.name;

						// sap.m.MessageToast("Company Saved Successfully");
					}
				},
				error: function (oError) {}

			});
		},
		
		_onObjectMatched: function (oEvent) {

			// this.Branchname = oEvent.getParameter("arguments").Branchname;
			this.Branchid = oEvent.getParameter("arguments").Branchid;
			this.Companyid = oEvent.getParameter("arguments").companyid;
			this.Teamid = oEvent.getParameter("arguments").Teamid;
			this.getView().byId("TeamPage").setTitle(this.TeamName);
			this.onReadTeamName();
			this.onTeamMemberBinding();
			this.onShiftBinding();
			this.onSkillBinding();
			this.onShiftGrpBinding();
			this.onLeaveTeamBinding();
			// 	 this.onTeambinding(this.Branchid);

		},
		
		onEditPress: function () {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Edit Your Team Name',
				icon: "sap-icon://edit",
				type: 'Standard',
				//	state: '',
				content: new sap.m.Input({
					value: this.TeamName
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Save',
					//	icon:"sap-icon://accept",
					width: "auto",

					press: function (OEvent) {

						that.onEditTeam(OEvent);

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
		
		onEditTeam: function (OEvent) {
			var ODialog = OEvent.getSource().getParent();
		
			var that = this;
			var Team = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;


if (Team !== "")
{
	ODialog.setBusy(true);
		this.getView().setBusy(true);
		var oData = JSON.stringify({
				"name": Team
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team?id=" + this.Teamid;
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
					var oSuccess = "Team Name " + ' ' + " Edited Successfully!!!";
					if (results.status === "SUCCESS") {
						that.TeamName = Team;
						that.getView().byId("TeamPage").setTitle(that.TeamName);
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
ODialog.destroy();
 
					var mes = "";

					if (oError.responseJSON.errors) {
						var oErr = oError.responseJSON.errors["team"].name;
						for (var i = 0; i < oErr.length; i++) {
							mes = mes + oErr[i] + '\xa0';
						}
						ODialog.getContent()[0].setValueState("Error");
						ODialog.getContent()[0].setValueStateText(mes);
						that.getView().setBusy(false);
					}
				}
			});
}
else
{
	 OEvent.getSource().getParent().getContent()[0].setValueState("Error").setValueStateText("Team Cannot be Blank");
}
		},

	 	oDaterangeMember  : function(oEvent){
	var Dates = oEvent.getParameters();	
	this.Startdate = Dates.from;
	this.Enddate = Dates.to;
	var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
    pattern: 'yyyy-MM-dd'
});		
	 this.Enddate = oDateFormat.format(this.Enddate);
	 this.Startdate =  oDateFormat.format(this.Startdate);
	this.onTeamMemberBinding();
		 	},
		 	
		oDaterangeLeave: function(oEvent){
				var Dates = oEvent.getParameters();	
	this.Startdate1 = Dates.from;
	this.Enddate1 = Dates.to;
	var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
    pattern: 'yyyy-MM-dd'
});		
	 this.Enddate1 = oDateFormat.format(this.Enddate1);
	 this.Startdate1 =  oDateFormat.format(this.Startdate1);
	this.onLeaveTeamBinding();
		},
		
		onTeamMemberBinding: function () {
			var that = this;
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelTeamMember");

       var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee-history?from_date="+this.Startdate+"&id="+this.Teamid+"&page=1&page_size=10&to_date="+this.Enddate;	
			
	
				
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
                      
                      that.TeamMemberTotalrec = results.metaData["totalRecords"];
        that.TeamMemberTotalPage = Math.ceil(that.TeamMemberTotalrec / 10);
                      
						var data = {
							TeamMembertData: results.data
						};
						oModel.setData(data);
that.onTeamMemberPagination(that.TeamMemberTotalrec);
						// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				},
				error: function (oError) {

					// MessageBox.error(
					// oError.responseJSON.message, {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					// );
					// that.getView().setBusy(false);
				}
			});
		},
		
		onShiftBinding: function(){
				var that = this;
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelShiftList");

       var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/shifts?from_date="+this.Startdate+"&team="+this.Teamid+"&page=1&page_size=10&to_date="+this.Enddate;	
			

				
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
                      
                      that.ShiftTotalrec = results.metaData["totalRecords"];
        that.ShiftTotalPage = Math.ceil(that.ShiftTotalrec / 10);
                      
						var data = {
							ShiftData: results.data
						};
						oModel.setData(data);
// that.onTeamMemberPagination(that.ShiftTotalrec);
						
					}
				},
				error: function (oError) {
				}
			});
		},
		
		onLeaveTeamBinding: function(){
					var that = this;
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelLeaveList");

var sURL = 	"	https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/leaves?from_date="+this.Startdate1+"&team="+this.Teamid+"&page=1&page_size=10&to_date="+this.Enddate1;	
			

				
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

						var data = ({
							LeaveData: results.data
						});
						oModel.setData(data);

						// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				},
				error: function (oError) {

					// MessageBox.error(
					// oError.responseJSON.message, {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					// );
					// that.getView().setBusy(false);
				}
			});
		},
		
		onSkillBinding: function () {
			var that = this;
			// this.getView().setBusy(true);
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelSkillList");

			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=false&page=1&page_size=10&team=" +
				this.Teamid;
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
      that.SkillTotalrec = results.metaData["totalRecords"];
        that.SkillTotalPage = Math.ceil(that.SkillTotalrec / 10);
						var data = {
							SkillData: results.data
						};
						oModel.setData(data);
	that.getView().setBusy(false);
					
					that.onSkillPagination(that.SkillTotalrec);
					}
				},
				error: function (oError) {

				
				}
			});
		},

		onShiftGrpBinding: function () {
			var that = this;
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelShiftgrpList");

			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/shift-groups?page=1&page_size=30&team=" +
				this.Teamid;
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
          that.ShiftGrpTotalrec = results.metaData["totalRecords"];
        that.ShiftGrpTotalPage = Math.ceil(that.ShiftGrpTotalrec / 10);
						var data = {
							ShiftgrpData: results.data
						};
						oModel.setData(data);

					that.onShiftGrpPagination(that.ShiftGrpTotalrec);
						// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				},
				error: function (oError) {

					// MessageBox.error(
					// oError.responseJSON.message, {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					// );
					// that.getView().setBusy(false);
				}
			});
		},

		onAddShiftGrpDailog: function () {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Add Shift Group',
				icon: "sap-icon://add",
				// contentWidth :"30%",
				type: 'Standard',
				//	state: 'Information',
				content: new sap.m.Input({
					value: "",
					placeholder:" Shift Group"
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Add',
					//	icon:"sap-icon://accept",
					width: "auto",
					class: "sapUiLargeMarginBeginEnd",
					press: function (OEvent) {

						that.onAddShiftGrp(OEvent);

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
		
		onAddShiftGrp: function (OEvent) {

			var that = this;
			var ODialog = OEvent.getSource().getParent();
		
			
			var that = this;
			var ShiftGroup = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
	if (ShiftGroup !== ""){
			this.getView().setBusy(true);
			ODialog.setBusy(true);
			var oData = JSON.stringify({
				"name": ShiftGroup
			});
	
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift-group?team=" +
				this.Teamid;
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
					var oSuccess = "New Shift Group" + '\xa0' + ShiftGroup + '\xa0' + "Added successfully!!!";
					that.ShiftGrpTotalrec = 1 + this.ShiftGrpTotalrec;
						that.ShiftGrpTotalPage = Math.ceil(that.ShiftGrpTotalrec / 10);
					if (results.status === "SUCCESS") {
										that.onShiftGrpBinding();
								ODialog.setBusy(false);
								
						that.onShiftGrpPagination(that.ShiftGrpTotalrec);
						// that.onInit();
						// 	var Data ={
						//  "id": results.Data,
						//  "name": results.message
						//};             	var oMasterPage = this.getView().byId("idMasterPage");
						// var OHeadertext = "Companies (" + that.Totalrec + ") ";
						// that.getView().byId("idMasterPage").setTitle(OHeadertext);
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
							ODialog.setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);

					var mes = "";

					if (oError.responseJSON.errors) {

						var oErr = oError.responseJSON.errors["shift-group"].name;
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
}

else{
OEvent.getSource().getParent().getContent()[0].setValueState("Error").setValueStateText("Holiday  Name cannot be blank");
}
		},
		
	
		
		oneditshiftgrprow: function (oEvent) {
			var that = this;
			var currentItem = oEvent.getSource().getParent().getParent();
			this.ShiftGroupId = currentItem.getCells()[0].mProperties["text"];
			this.ShiftGroup = currentItem.getCells()[1].mProperties["text"];
			//	var Name = currentItem.getCells()[1].mProperties["text"];	

			var oDialog = new sap.m.Dialog({
				title: 'Edit Shift Group',
				contentWidth: "40%",
				icon: "sap-icon://edit",
				type: 'Standard',
				//	state: '',
				content: new sap.m.Input({
					value: this.ShiftGroup
				}),

				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Update',
					//	icon:"sap-icon://accept",
					width: "auto",
				
					press: function (OEvent) {

						that.onEditShiftGrp(OEvent);

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
				}),
				afterClose: function () {
					// oDialog.destroy();
				}
			});

			oDialog.open();
		},

		onEditShiftGrp: function (OEvent) {
			var that = this;

			var ODialog = OEvent.getSource().getParent();
		
		
			var that = this;
			var Shiftgrp = OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
		if (Shiftgrp  !== ""){
				this.getView().setBusy(true);
				ODialog.setBusy(true);
			var oData = JSON.stringify({
				"name": Shiftgrp
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift-group?group=" +
				this.ShiftGroupId;
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
					ODialog.setBusy(false);
					ODialog.close();
					that.getView().setBusy(false);
					var oSuccess = "Shift Goup" + ' ' + " Edited Successfully!!!";
					if (results.status === "SUCCESS") {
						// that.getView().byId("idojectheader").setObjectTitle(Company);
						//	that.oCompanyName = Company;
						that.onShiftGrpBinding();
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
						var oErr = oError.responseJSON.errors["shift-group"].name;
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
			OEvent.getSource().getParent().getContent()[0].setValueState("Error").setValueStateText("Shift Group cannot be blank");
		}
	
		},

		ondeleteshiftgrprow: function (oEvent) {

		},
		
     	onAddSkillDailog: function () {
			var that = this;
			var oDialog = new sap.m.Dialog({
				title: 'Add New Skill',
				icon: "sap-icon://add",
				// contentWidth :"30%",
				type: 'Standard',
				//	state: 'Information',
				content:[ new sap.m.Input({
					value: "",
					width:"300px",
					placeholder:"Add Skill"
				}).addStyleClass("sapUiResponsiveMargin"),
				new sap.m.Input({
					value: "",
						width:"300px",
						placeholder:"Add Description"
				}).addStyleClass("sapUiResponsiveMargin")
],
				beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Add',
					//	icon:"sap-icon://accept",
					width: "auto",
			
					press: function (OEvent) {

						that.onAddSkill(OEvent);

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
		
		onAddSkill: function (OEvent) {

			var that = this;
			var ODialog = OEvent.getSource().getParent();
			
			var that = this;
			var Skill = 	OEvent.getSource().getParent().getContent()[0]["mProperties"].value;
			var Desc = OEvent.getSource().getParent().getContent()[1]["mProperties"].value;
	if ( Skill !== "" ){
		
		this.getView().setBusy(true);
			ODialog.setBusy(true);
			var oData = JSON.stringify({
				"name": Skill,
				"description": Desc
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/skill?company=" +
				this.Companyid;
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
					var oSuccess = "New Skill" + '\xa0' + Skill + '\xa0' + "Added successfully!!!";
					that.SkillTotalrec = 1 + that.SkillTotalrec;
						that.SkillTotalPage = Math.ceil(that.SkillTotalrec / 11);
					if (results.status === "SUCCESS") {
										// that.onSkillBinding();
								ODialog.setBusy(false);
								
						that.onSkillPagination(that.SkillTotalrec);
						// that.onInit();
						// 	var Data ={
						//  "id": results.Data,
						//  "name": results.message
						//};             	var oMasterPage = this.getView().byId("idMasterPage");
						// var OHeadertext = "Companies (" + that.Totalrec + ") ";
						// that.getView().byId("idMasterPage").setTitle(OHeadertext);
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
							ODialog.setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);

					var mes = "";

					if (oError.responseJSON.errors) {

						var oErr = oError.responseJSON.errors["skill"].name;
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
	}
	else{
			OEvent.getSource().getParent().getContent()[0].setValueState("Error").setValueStateText("Skill cannot be blank");
	}	

		},
		
		oneditskillrow: function (oEvent) {
			var that = this;
			var currentItem = oEvent.getSource().getParent().getParent();
			this.SkillId = currentItem.getCells()[0].mProperties["text"];
			var skill = currentItem.getCells()[1].mProperties["text"];
			var Desc = currentItem.getCells()[2].mProperties["text"];	

			var oDialog = new sap.m.Dialog({
				title: 'Edit Skill',
				contentWidth: "auto",
				icon: "sap-icon://edit",
				type: 'Standard',
				//	state: '',
		content:  new sap.m.VBox({
					items: [
						new sap.m.HBox({
							
						alignItems : "Center",	
						items:	[ new sap.m.Label({
							text: "Skill",
							width:"100px"
						}).addStyleClass("sapUiTinyMarginBeginEnd"),

						new sap.m.Input({
							value: skill,
							placeholder: "Type New Skill..."
						})

					]
						}).addStyleClass("sapUiTinyMarginBeginEnd"),
						new sap.m.HBox({
									alignItems : "Center",	
						items:	[ new sap.m.Label({
							text: "Description",
							width:"100px"
						
						}).addStyleClass("sapUiTinyMarginBeginEnd"),

						new sap.m.Input({
							value: Desc,
							width:"300px",
							placeholder: "Type Description of a Skill..."
						})

					]
							}).addStyleClass("sapUiTinyMarginBeginEnd"),
	    	]	}).addStyleClass("sapUiResponsiveMargin"),
				
						beginButton: new sap.m.Button({
					type: "Transparent",
					text: 'Update',
					//	icon:"sap-icon://accept",
					width: "auto",
			
					press: function (OEvent) {

						that.onEditSkill(OEvent);

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
				}),
				afterClose: function () {
					// oDialog.destroy();
				}
			});

			oDialog.open();
		},

		onEditSkill: function (OEvent) {
			var that = this;

			var ODialog = OEvent.getSource().getParent();
		
			var that = this;
			var skill = OEvent.getSource().getParent().getContent()[0].getItems()[0].getItems()[1].getValue();
	var Desc = OEvent.getSource().getParent().getContent()[0].getItems()[1].getItems()[1].getValue();
	
	if (skill !== ""){
			ODialog.setBusy(true);
			this.getView().setBusy(true);
			var oData = JSON.stringify({
			"description": Desc,
  "name": skill
			});
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/skill?skill=" +
				this.SkillId;
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
					ODialog.setBusy(false);
					ODialog.close();
					that.getView().setBusy(false);
					var oSuccess = "Skill" + ' ' + " Edited Successfully!!!";
					if (results.status === "SUCCESS") {
						// that.getView().byId("idojectheader").setObjectTitle(Company);
						//	that.oCompanyName = Company;
						that.onSkillBinding();
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
						var oErr = oError.responseJSON.errors["skill"].name;
						for (var i = 0; i < oErr.length; i++) {
							mes = mes + oErr[i] + '\xa0';
						}
						// ODialog.getContent()[0].setValueState("Error");
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
				}
			});
	}
	else{
			OEvent.getSource().getParent().getContent()[0].getItems()[0].getItems()[1].setValueState("Error").setValueStateText("Skill cannot be blank");	
	}
		
		},

		ondeleteskill: function (oEvent) {

		},
		
		
		
		onAddShiftDailog: function(){
		
				sap.m.MessageToast.show("Create a New Shift");
			var oView = this.getView();

			//	create dialog lazily
			if (!this.byId("idShtDailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.ShiftDetail",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idShtDailog").open();
			}
	
		},
			onShiftCancel: function () {
			this.byId("idShtDailog").destroy();
			// this.getView().byId("toggleInfoToolbar13").setPressed(false);
		},
		
				openSampleWithDisplayModeSet: function (oEvent) {
			if (!this.oColorPaletteDisplayMode) {
				this.oColorPaletteDisplayMode = new ColorPalettePopover("oColorPaletteDisplayMode", {
					showDefaultColorButton: false,
					displayMode: ColorPickerDisplayMode.Simplified,
					colorSelect: this.handleColorSelect
				});
			}

			this.oColorPaletteDisplayMode.openBy(oEvent.getSource());
		},

		handleColorSelect: function (oEvent) {
			sap.m.MessageToast.show("Color Selected: value - " + oEvent.getParameter("value") );
			// +	", \n defaultAction - " + oEvent.getParameter("defaultAction"));
		},
		
		///Pagination code for Team Member Table
		      
		       onTeamMemberPagination: function(ORec){
		   
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
			if (oNext >= this.TeamMemberTotalPage) {
				//do nothing
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Default");
					this.getView().byId("idb2").setType("Emphasized");
					this.onSecond();
				} else if (this.getView().byId("idb2").getType() === "Emphasized" && this.getView().byId("idb2").getText() == this.TeamMemberTotalPage) {
					this.getView().byId("idb2").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Default");
					this.getView().byId("idb3").setType("Emphasized");
					this.onThird();
				} else if (this.getView().byId("idb3").getType() === "Emphasized" && this.getView().byId("idb3").getText() == this.TeamMemberTotalPage) {
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

			var oModel2 = this.getView().getModel("oModelTeamMember");
				

var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee-history?from_date="+this.Startdate+"&id="+this.Teamid+"&page="+oPage+"&page_size=10&to_date="+this.Enddate;	
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
                      
              
                      
						var data = {
							TeamMembertData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
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

				var oModel2 = this.getView().getModel("oModelTeamMember");
				

var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee-history?from_date="+this.Startdate+"&id="+this.Teamid+"&page="+oPage+"&page_size=10&to_date="+this.Enddate;	
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
                      
              
                      
						var data = {
							TeamMembertData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function() {
					
				}
			});
		},
		 
	        	onThird: function () {
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Emphasized");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb3").getText();

				var oModel2 = this.getView().getModel("oModelTeamMember");
				

var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee-history?from_date="+this.Startdate+"&id="+this.Teamid+"&page="+oPage+"&page_size=10&to_date="+this.Enddate;	
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
                      
              
                      
						var data = {
							TeamMembertData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});
		},
		
	        	onFourth: function () {
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Emphasized");

			var oPage = this.getView().byId("idb4").getText();

			var oModel2 = this.getView().getModel("oModelTeamMember");
				

var sURL = 	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee-history?from_date="+this.Startdate+"&id="+this.Teamid+"&page="+oPage+"&page_size=10&to_date="+this.Enddate;	
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
                      
              
                      
						var data = {
							TeamMembertData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});
		},


  //////Pagination code for Shift Group Table
  
  onShiftGrpPagination: function(ORec) {
		   
		   	this.getView().byId("idb9").setText("1").setType("Emphasized");
			this.getView().byId("idb10").setText("2").setType("Default");
			this.getView().byId("idb11").setText("3").setType("Default");
			this.getView().byId("idb12").setText("4").setType("Default");
			
			if (ORec <= 10) {
				this.getView().byId("idToolbarList2").setVisible(false);

				

			} else if (ORec <= 20) {

				this.getView().byId("idToolbarList2").setVisible(true);

				

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(false);
				this.getView().byId("idb12").setVisible(false).setText("2");

			} else if (ORec <= 30) {

				this.getView().byId("idToolbarList2").setVisible(true);

				

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(true);
				this.getView().byId("idb12").setVisible(false).setText("3");

				//	  this.getView().byId("idb9")._bActive = true;
			} else if (ORec <= 40) {

				this.getView().byId("idToolbarList2").setVisible(true);

				

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(true);
				this.getView().byId("idb12").setVisible(true);

				//  this.getView().byId("idb9")._bActive = true;
			} else {
				this.getView().byId("idToolbarList2").setVisible(true);

			

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(true);
				this.getView().byId("idb12").setVisible(true);

				
			}

		       },
		       
    	onPrev2: function (oEvent) {

			//  this.getView().byId("idb9")._bActive = true;	
			var oPrev = this.getView().byId("idb9").getText();

			if (oPrev === "1") {
				
				if (this.getView().byId("idb9").getType() === "Emphasized") {
					sap.m.MessageToast.show("You are at First Page");
				} else if (this.getView().byId("idb10").getType() === "Emphasized") {
					this.getView().byId("idb9").setType("Emphasized");
					this.getView().byId("idb10").setType("Default");
					this.onFirst2();
				} else if (this.getView().byId("idb11").getType() === "Emphasized") {
					this.getView().byId("idb10").setType("Emphasized");
					this.getView().byId("idb11").setType("Default");
					this.onSecond2();
				} else {
					this.getView().byId("idb11").setType("Emphasized");
					this.getView().byId("idb12").setType("Default");
					this.onThird2();
				}

			} else {
				this.getView().byId("idb9").setText(parseInt(oPrev) - 1);
				this.getView().byId("idb10").setText(parseInt(oPrev));
				this.getView().byId("idb11").setText(parseInt(oPrev) + 1);
				this.getView().byId("idb12").setText(parseInt(oPrev) + 2);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb9").getType() === "Emphasized") {
					this.onFirst2();
				} else if (this.getView().byId("idb10").getType() === "Emphasized") {
					this.onSecond2();
				} else if (this.getView().byId("idb11").getType() === "Emphasized") {
					this.onThird2();
				} else {
					this.onFourth2();
				}
				//
			}

			if (this.Totalrec === oPrev + 4) {
				this.getView().byId("idNext2").setEnabled(false);
			} else {
				this.getView().byId("idNext2").setEnabled(true);
			}

		
		},		       

         onNext2: function () {

			//	   this.getView().byId("idb9")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb12").getText());
			if (oNext >= this.ShiftGrpTotalPage) {
				//do nothing
				if (this.getView().byId("idb9").getType() === "Emphasized") {
					this.getView().byId("idb9").setType("Default");
					this.getView().byId("idb10").setType("Emphasized");
					this.onSecond2();
				} else if (this.getView().byId("idb10").getType() === "Emphasized" && this.getView().byId("idb10").getText() == this.ShiftGrpTotalPage) {
					this.getView().byId("idb10").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb10").getType() === "Emphasized") {
					this.getView().byId("idb10").setType("Default");
					this.getView().byId("idb11").setType("Emphasized");
					this.onThird2();
				} else if (this.getView().byId("idb11").getType() === "Emphasized" && this.getView().byId("idb11").getText() == this.ShiftGrpTotalPage) {
					this.getView().byId("idb11").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb11").getType() === "Emphasized") {
					this.getView().byId("idb11").setType("Default");
					this.getView().byId("idb12").setType("Emphasized");
					this.onFourth2();
				} else {
					//do nothing
					//this.onFourth();
					sap.m.MessageToast.show("No More Pages");
				}
			} else {
				this.getView().byId("idb9").setText(parseInt(oNext) - 2);
				this.getView().byId("idb10").setText(parseInt(oNext) - 1);
				this.getView().byId("idb11").setText(parseInt(oNext));
				this.getView().byId("idb12").setText(parseInt(oNext) + 1);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb9").getType() === "Emphasized") {
					this.onFirst2();
				} else if (this.getView().byId("idb10").getType() === "Emphasized") {
					this.onSecond2();
				} else if (this.getView().byId("idb11").getType() === "Emphasized") {
					this.onThird2();
				} else {
					this.onFourth2();
				}
			
			}

		},
		
		onFirst2: function () {

			this.getView().byId("idb9").setType("Emphasized");
			this.getView().byId("idb10").setType("Default");
			this.getView().byId("idb11").setType("Default");
			this.getView().byId("idb12").setType("Default");

			var oPage = this.getView().byId("idb9").getText();

			var oModel2 = this.getView().getModel("oModelShiftgrpList");
				

var sURL =	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/shift-groups?page="+oPage+"&page_size=10&team=" +
				this.Teamid;
			
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
                      
              
                      
						var data = {
							ShiftgrpData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		onSecond2: function () {

			this.getView().byId("idb9").setType("Default");
			this.getView().byId("idb10").setType("Emphasized");
			this.getView().byId("idb11").setType("Default");
			this.getView().byId("idb12").setType("Default");

			var oPage = parseInt(this.getView().byId("idb10").getText());

			var oModel2 = this.getView().getModel("oModelShiftgrpList");
				

var sURL =	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/shift-groups?page="+oPage+"&page_size=10&team=" +
				this.Teamid;
			
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
                      
              
                      
						var data = {
							ShiftgrpData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		onThird2: function () {

			this.getView().byId("idb9").setType("Default");
			this.getView().byId("idb10").setType("Default");
			this.getView().byId("idb11").setType("Emphasized");
			this.getView().byId("idb12").setType("Default");

			var oPage = parseInt(this.getView().byId("idb11").getText());

			var oModel2 = this.getView().getModel("oModelShiftgrpList");
				

var sURL =	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/shift-groups?page="+oPage+"&page_size=10&team=" +
				this.Teamid;
			
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
                      
              
                      
						var data = {
							ShiftgrpData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		onFourth2: function () {

			this.getView().byId("idb9").setType("Default");
			this.getView().byId("idb10").setType("Default");
			this.getView().byId("idb11").setType("Default");
			this.getView().byId("idb12").setType("Emphasized");

			var oPage = parseInt(this.getView().byId("idb12").getText());

			var oModel2 = this.getView().getModel("oModelShiftgrpList");
				

var sURL =	"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/shift-groups?page="+oPage+"&page_size=10&team=" +
				this.Teamid;
			
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
                      
              
                      
						var data = {
							ShiftgrpData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		
		
/////Pagination code for Skills		
		
			 onSkillPagination: function(ORec) {
		   
		   	this.getView().byId("idb13").setText("1").setType("Emphasized");
			this.getView().byId("idb14").setText("2").setType("Default");
			this.getView().byId("idb15").setText("3").setType("Default");
			this.getView().byId("idb16").setText("4").setType("Default");
			
			if (ORec <= 10) {
				this.getView().byId("idToolbarList3").setVisible(false);

				

			} else if (ORec <= 20) {

				this.getView().byId("idToolbarList3").setVisible(true);

				

				this.getView().byId("idb13").setVisible(true);
				this.getView().byId("idb14").setVisible(true);
				this.getView().byId("idb15").setVisible(false);
				this.getView().byId("idb16").setVisible(false).setText("2");

			} else if (ORec <= 30) {

				this.getView().byId("idToolbarList3").setVisible(true);

				

				this.getView().byId("idb13").setVisible(true);
				this.getView().byId("idb14").setVisible(true);
				this.getView().byId("idb15").setVisible(true);
				this.getView().byId("idb16").setVisible(false).setText("3");

				//	  this.getView().byId("idb13")._bActive = true;
			} else if (ORec <= 40) {

				this.getView().byId("idToolbarList3").setVisible(true);

				

				this.getView().byId("idb13").setVisible(true);
				this.getView().byId("idb14").setVisible(true);
				this.getView().byId("idb15").setVisible(true);
				this.getView().byId("idb16").setVisible(true);

				//  this.getView().byId("idb13")._bActive = true;
			} else {
				this.getView().byId("idToolbarList3").setVisible(true);

			

				this.getView().byId("idb13").setVisible(true);
				this.getView().byId("idb14").setVisible(true);
				this.getView().byId("idb15").setVisible(true);
				this.getView().byId("idb16").setVisible(true);

				
			}

		       },
		       
		     	onPrev3: function (oEvent) {

			//  this.getView().byId("idb13")._bActive = true;	
			var oPrev = this.getView().byId("idb13").getText();

			if (oPrev === "1") {
				
				if (this.getView().byId("idb13").getType() === "Emphasized") {
					sap.m.MessageToast.show("You are at First Page");
				} else if (this.getView().byId("idb14").getType() === "Emphasized") {
					this.getView().byId("idb13").setType("Emphasized");
					this.getView().byId("idb14").setType("Default");
					this.onFirst3();
				} else if (this.getView().byId("idb15").getType() === "Emphasized") {
					this.getView().byId("idb14").setType("Emphasized");
					this.getView().byId("idb15").setType("Default");
					this.onSecond3();
				} else {
					this.getView().byId("idb15").setType("Emphasized");
					this.getView().byId("idb16").setType("Default");
					this.onThird3();
				}

			} else {
				this.getView().byId("idb13").setText(parseInt(oPrev) - 1);
				this.getView().byId("idb14").setText(parseInt(oPrev));
				this.getView().byId("idb15").setText(parseInt(oPrev) + 1);
				this.getView().byId("idb16").setText(parseInt(oPrev) + 2);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb13").getType() === "Emphasized") {
					this.onFirst3();
				} else if (this.getView().byId("idb14").getType() === "Emphasized") {
					this.onSecond3();
				} else if (this.getView().byId("idb15").getType() === "Emphasized") {
					this.onThird2();
				} else {
					this.onFourth3();
				}
				//
			}

			if (this.Totalrec === oPrev + 4) {
				this.getView().byId("idNext3").setEnabled(false);
			} else {
				this.getView().byId("idNext3").setEnabled(true);
			}

		
		},	  
		
		        onNext3: function () {

			//	   this.getView().byId("idb13")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb16").getText());
			if (oNext >= this.SkillTotalPage) {
				//do nothing
				if (this.getView().byId("idb13").getType() === "Emphasized") {
					this.getView().byId("idb13").setType("Default");
					this.getView().byId("idb14").setType("Emphasized");
					this.onSecond3();
				} else if (this.getView().byId("idb14").getType() === "Emphasized" && this.getView().byId("idb14").getText() == this.SkillTotalPage) {
					this.getView().byId("idb14").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb14").getType() === "Emphasized") {
					this.getView().byId("idb14").setType("Default");
					this.getView().byId("idb15").setType("Emphasized");
					this.onThird3();
				} else if (this.getView().byId("idb15").getType() === "Emphasized" && this.getView().byId("idb15").getText() == this.SkillTotalPage) {
					this.getView().byId("idb15").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb15").getType() === "Emphasized") {
					this.getView().byId("idb15").setType("Default");
					this.getView().byId("idb16").setType("Emphasized");
					this.onFourth3();
				} else {
					//do nothing
					//this.onFourth();
					sap.m.MessageToast.show("No More Pages");
				}
			} else {
				this.getView().byId("idb13").setText(parseInt(oNext) - 2);
				this.getView().byId("idb14").setText(parseInt(oNext) - 1);
				this.getView().byId("idb15").setText(parseInt(oNext));
				this.getView().byId("idb16").setText(parseInt(oNext) + 1);

				// code for highlighted button data load when previous button pressed
				if (this.getView().byId("idb13").getType() === "Emphasized") {
					this.onFirst3();
				} else if (this.getView().byId("idb14").getType() === "Emphasized") {
					this.onSecond3();
				} else if (this.getView().byId("idb15").getType() === "Emphasized") {
					this.onThird3();
				} else {
					this.onFourth3();
				}
			
			}

		},
		    
		      	onFirst3: function () {

			this.getView().byId("idb13").setType("Emphasized");
			this.getView().byId("idb14").setType("Default");
			this.getView().byId("idb15").setType("Default");
			this.getView().byId("idb16").setType("Default");

			var oPage = this.getView().byId("idb13").getText();

			var oModel2 = this.getView().getModel("oModelSkillList");
				

var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=false&page="+oPage+"&page_size=10&team=" +
				this.Teamid;	
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
                      
              
                      
						var data = {
							SkillData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		     
		     onSecond3: function () {

			this.getView().byId("idb13").setType("Default");
			this.getView().byId("idb14").setType("Emphasized");
			this.getView().byId("idb15").setType("Default");
			this.getView().byId("idb16").setType("Default");

			var oPage = this.getView().byId("idb14").getText();

			var oModel2 = this.getView().getModel("oModelSkillList");
				

var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=false&page="+oPage+"&page_size=10&team=" +
				this.Teamid;	
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
                      
              
                      
						var data = {
							SkillData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		      	onThird3: function () {

			this.getView().byId("idb13").setType("Default");
			this.getView().byId("idb14").setType("Default");
			this.getView().byId("idb15").setType("Emphasized");
			this.getView().byId("idb16").setType("Default");

			var oPage = this.getView().byId("idb15").getText();

			var oModel2 = this.getView().getModel("oModelSkillList");
				

var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=false&page="+oPage+"&page_size=10&team=" +
				this.Teamid;	
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
                      
              
                      
						var data = {
							SkillData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		       onFourth3: function () {

			this.getView().byId("idb13").setType("Default");
			this.getView().byId("idb14").setType("Default");
			this.getView().byId("idb15").setType("Default");
			this.getView().byId("idb16").setType("Emphasized");

			var oPage = this.getView().byId("idb16").getText();

			var oModel2 = this.getView().getModel("oModelSkillList");
				

var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=false&page="+oPage+"&page_size=10&team=" +
				this.Teamid;	
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
                      
              
                      
						var data = {
							SkillData: results.data
						};
						oModel2.setData(data);

					}
				},
				error: function(){}
			});

		},
		
		
		
		
		
		
		
		
		////on line item press pf skill
		
		onclickshift: function(oEvent){
	var sPath =	oEvent.getParameter('listItem').getBindingContext("oModelShiftList").getPath();
		var oModel = this.getView().getModel("oModelShiftList");
		var  oData = oModel.getProperty(sPath);
// var oModel1	= this.getView().getModel("oModelGBShift");
 this.getView().getModel("oModelGBShift").setData({
 	ShiftData:oData
 });
 
 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TeamtoShiftpage", {

				Shiftid: oData.id,
				Teamid: this.Teamid
				

			});
		// oModel1.setData(oData);
		// window.ShiftData = oData;
			
		},
		
		
		onShiftSubmit: function(){
			var that = this;
			var adata ={};
			var ErrorFlag;
			this.aMessages = [];
			var Shiftname = this.byId("idShiftName").getValue();
			var Shiftdesc = this.byId("idShiftDesc").getValue();
			var formdate = this.byId("idfromdate").getValue();
			var Todate = this.byId("idtodate").getValue();
		
			var starttime = this.byId("idstarttime").getValue();
			var endtime = this.byId("idEndtime").getValue();
		
		
				if (Shiftname === null || Shiftname === "") {
				this.byId("idShiftName").setValueState("Error");
				this.byId("idShiftName").setValueStateText("Shift Name cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("idShiftName").setValueState("None");
				// ErrorFlag = "";
			}


   //        	if (Todate === null || Todate === "") {
			// 	this.byId("idtodate").setValueState("Error");
			// 	this.byId("idtodate").setValueStateText(" To Date cannot be Blank");
			// 	ErrorFlag = 1;
			// } else {
			// 	this.byId("idtodate").setValueState("None");
			// 	// ErrorFlag = "";
			// }
			
			     	if (formdate === null || formdate === "") {
				this.byId("idfromdate").setValueState("Error");
				this.byId("idfromdate").setValueStateText(" From Date cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("idfromdate").setValueState("None");
				// ErrorFlag = "";
			}
		
		 	if (starttime === null || starttime === "") {
				this.byId("idstarttime").setValueState("Error");
				this.byId("idstarttime").setValueStateText(" Start Time cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("idstarttime").setValueState("None");
				// ErrorFlag = "";
			}
		
		
			if (endtime === null || endtime === "") {
				this.byId("idEndtime").setValueState("Error");
				this.byId("idEndtime").setValueStateText(" End Time cannot be Blank");
				ErrorFlag = 1;
			} else {
				this.byId("idEndtime").setValueState("None");
				// ErrorFlag = "";
			}
			
			
			
			if (ErrorFlag !== 1){
		
	this.byId("idShtDailog").setBusy(true); 
	
var	oStime = starttime.split(" ");
var Stime,Etime, Stime1,oETime,oETime1;

	Stime1 = oStime[0].split(":");
     if (oStime[1] === "am" ){
     
     
     	
     	  if(Stime1[0] != 12)
   	Stime  = parseInt(Stime1[0])  * 60  + parseInt(Stime1[1]);
     else
     Stime  = parseInt(Stime1[1]);
     }
     else{
     	Stime  = parseInt(Stime1[0])  * 60  + parseInt(Stime1[1]) + 720;
     }
     
     
       var  oETime = endtime.split(" ");
	oETime1 = oETime[0].split(":");
     if (oETime[1] === "am" ){
     
     if(oETime1[0] != 12)
     	Etime  = parseInt(oETime1[0])  * 60  + parseInt(oETime1[1]);
     else
     Etime  = parseInt(oETime1[1]);
     	
     }
     else{
     	Etime  = parseInt(oETime1[0])  * 60  + parseInt(oETime1[1]) + 720;
     }


     
   
	

	
		adata.duration = Etime;
		adata.name = Shiftname;
		adata.starts = Stime;
		adata.validFrom = formdate;
		
		if(Todate){
		adata.validTill = 	Todate;
		}
		
			if(Shiftdesc){
		adata.description = 	Shiftdesc;
		}
	
	if (this.byId("idmon").getSelected() == true){
		adata.onMonday = true;
	}
	
		if (this.byId("idtue").getSelected() == true){
		adata.onTuesday = true;
	}
		if (this.byId("idwed").getSelected() == true){
		adata.onWednesday = true;
	}
		if (this.byId("idthu").getSelected() == true){
		adata.onThursday = true;
	}
		if (this.byId("idfri").getSelected() == true){
		adata.onFriday = true;
	}
		if (this.byId("idsat").getSelected() == true){
		adata.onSaturday = true;
	}
		if (this.byId("idsun").getSelected() == true){
		adata.onSunday = true;
	}
// 		var oData = JSON.stringify({
			
//   "duration": 320,
//   "name": "A",
 
//   "starts": 124,

//   "validFrom": "2019-12-01"
 
// }
// 		);

adata = JSON.stringify(adata);

		var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift?team=" +
					this.Teamid;	
			
					$.ajax({
					type: "POST",
					url: sURL,
					data: adata,
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
	that.byId("idShtDailog").setBusy(false); 
							// that.byId("idEmpDailog").setBusy(false);

							sap.m.MessageToast.show("Shift added Successfully");
							// that.byId("idEmpDailog").close();
							// that.byId("idEmpDailog").destroy();
							
							// that.onSaveformBind();

						}
					},
					error: function (oError) {
						that.byId("idShtDailog").setBusy(false);
					// 	that.aMessages = [];
					// 	var mes;
					// 	that.byId("idEmpDailog").setBusy(false);
						sap.m.MessageToast.show(oError.responseJSON.message);
					// 	if (oError.responseJSON.errors) {

					// 		if (oError.responseJSON.errors.employee["."]) {
					// 			mes = mes + oError.responseJSON.errors.employee["."] + ";" + '\xa0' + '\n';
					// 			that.aMessages.push({
					// 				type: 'Error',
					// 				title: 'Form Level',
					// 				description: oError.responseJSON.errors.employee["."]
					// 			});
					// 		}
					// 		//Gender 
							if (oError.responseJSON.errors.name) {
								that.byId("idShiftName").setValueState("Error");
								that.byId("idShiftName").setValueStateText(oError.responseJSON.errors.name);
								// mes = mes + oError.responseJSON.errors.employee.gender + ";" + '\xa0' + '\n';
								// this.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Gender',
								// 	description: 'oError.responseJSON.errors.employee.gender'
								// });
							} else {
								that.byId("idShiftName").setValueState("None");
							}

							if (oError.responseJSON.errors.duration) {
								that.byId("idEndtime").setValueState("Error");
								that.byId("idEndtime").setValueStateText(oError.responseJSON.errors.duration);
								// mes = mes + oError.responseJSON.errors.employee.firstName + ";" + '\xa0' + '\n';
								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'FirstName',
								// 	description: 'oError.responseJSON.errors.employee.firstName'
								// });
							} else {
								that.byId("idEndtime").setValueState("None");
							}

							if (oError.responseJSON.errors.starts) {
								that.byId("idstarttime").setValueState("Error");
								that.byId("idstarttime").setValueStateText(oError.responseJSON.errors.starts);
								// mes = mes + oError.responseJSON.errors.employee.email + ";" + '\xa0' + '\n';
								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'E-mail',
								// 	description: 'oError.responseJSON.errors.employee.email'
								// });

							} else {
								that.byId("idstarttime").setValueState("None");
							}

							if (oError.responseJSON.errors.validFrom) {
								that.byId("idfromdate").setValueState("Error");
								that.byId("idfromdate").setValueStateText(oError.responseJSON.errors.validFrom);
								// mes = mes + oError.responseJSON.errors.employee.joinDate + ";" + '\xa0' + '\n';
								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Join Date',
								// 	description: 'oError.responseJSON.errors.employee.joinDate'
								// });

							} else {
								that.byId("idfromdate").setValueState("None");
							}

							if (oError.responseJSON.errors.validTill) {
								that.byId("idtodate").setValueState("Error");
								that.byId("idtodate").setValueStateText(oError.responseJSON.errors.validTill);
								// mes = mes + oError.responseJSON.errors.employee.dob + ";" + '\xa0' + '\n';

								// that.aMessages.push({
								// 	type: 'Error',
								// 	title: 'Date of Birth',
								// 	description: 'oError.responseJSON.errors.employee.dob'
								// });

							} else {
								that.byId("idtodate").setValueState("None");
							}

					// 	}
					// 	// 			if (this.aMessages) {
					// 	// 				var oMessagePopover = new sap.m.MessagePopover({
					// 	// 					items: {
					// 	// 						path: '/',
					// 	// 						template: new sap.m.MessageItem({
					// 	// 							type: '{type}',
					// 	// 							title: '{title}',
					// 	// 							description: '{description}'
					// 	// 						})

					// 	// 					}

					// 	// 				});

					// 	if (that.aMessages) {
					// 		that.byId("idError").setVisible(true).setText(that.aMessages);
					// 	}
					// }

					// that.byId("idEmpDailog").destroy();
					// that.byId("idEmpDailog").close();

				
						
					}
					});	
			}
			else{
				//do nothing
			}
			
		},
		
			onParentClicked: function (oEvent) {
			var bSelected = oEvent.getParameter("selected");
			
		if (bSelected){
			this.byId("idmon").setSelected(true);
	     	this.byId("idsun").setSelected(true);
			this.byId("idtue").setSelected(true);
			this.byId("idwed").setSelected(true);
			this.byId("idthu").setSelected(true);	
			this.byId("idfri").setSelected(true);
			this.byId("idsat").setSelected(true);
			
			
		}
		
		else{
			this.byId("idmon").setSelected(false);
	     	this.byId("idsun").setSelected(false);
			this.byId("idtue").setSelected(false);
			this.byId("idwed").setSelected(false);
			this.byId("idthu").setSelected(false);	
			this.byId("idfri").setSelected(false);
			this.byId("idsat").setSelected(false);
				
		}
			// this.oModel.setData({ child1: bSelected, child2: bSelected, child3: bSelected });
		},
			onNavBack: function () {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} 
				// else {
				// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				// 	oRouter.navTo("fullScreenRoute1", {

				// 		Branchname: this.TeamId,
				// Companyid: this.Companyid,
				// Branchid: this.Branchid

				// 	});
				// }
			}
		
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ibm.fin.ar.view.Team
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ibm.fin.ar.view.Team
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ibm.fin.ar.view.Team
		 */
		// onExit: function () {
		// 	this.getView().byId("TeamPage").setTitle("");
		// }

	});

});