sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History",
	"ibm/fin/ar/utils/formatter"
], function (Controller, MessageBox, Fragment, History,formatter) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.Employee", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.Employee
		 //*/
formatter : formatter,
		//Global variable
		Empid: 0,
		Companyid:0,
		EmpData: {},
     	LeaveTotalrec: 0,
		LeaveTotalPage: 0,
		HistTotalrec: 0,
		HistTotalPage: 0,
			SkillTotalrec: 0,
		SkillTotalPage: 0,
		aMessages: new Array(),
		Startdate : "",
		Enddate : "",
			Startdate1 : "",
		Enddate1 : "",

		onInit: function () {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("EmplyoeeToDetail").attachPatternMatched(this._onObjectMatched, this);
			var date = new Date();
  this.Startdate = new Date(date.getFullYear(), date.getMonth(), 1);
   this.Startdate1 =  this.Startdate  ;
  //this.startdate = 	this.startdate.toISOString().split('T')[0];
  //oDRS2.setDateValue(new Date(2016, 1, 16));
		// 	oDRS2.setSecondDateValue(new Date(2016, 1, 18));
  	this.Enddate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			// this.Enddate = this.Enddate.toISOString().split('T')[0];
		this.Enddate1 = this.Enddate;
		this.byId("idrange1").setDateValue(this.Startdate).setSecondDateValue(this.Enddate );
		this.byId("idrange2").setDateValue(this.Startdate1).setSecondDateValue(this.Enddate1 );
		

			
		},

		_onObjectMatched: function (oEvent) {

			// var oloadindicator = new sap.ui.core.BusyIndicator();
			// oloadindicator.show(0);
			var that = this;
			// this.getView().setBusy(true);
		

			
			// this.getView().byId("SimpleFormDisplay480_Trial").setModel(oModel, "oModelEmpList1");
			this.Empid = oEvent.getParameter("arguments").Employeeid;
			this.Companyid = oEvent.getParameter("arguments").companyid;
			this.onLeaveBinding();
			this.onTeamHistoryBinding();
			this.onSkillBinding();
var	DataExist = 		this.getView().getModel("oModelEmpForm").getJSON();
		 if (DataExist !== "{}")
  {
  		this.getView().byId("SimpleFormDisplay480_Trial").bindElement("oModelEmpForm>/EmpData");

		this.getView().byId("SimpleFormDisplay480_Trial1").bindElement("oModelEmpForm>/EmpData");
  }
  else
  {	
			

			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1//employee?employee=" +
				this.Empid;
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
							EmpData: results.data
						};
						that.getView().getModel("oModelEmpForm").setData(data);
						that.getView().byId("SimpleFormDisplay480_Trial").bindElement("oModelEmpForm>/EmpData");

						that.getView().byId("SimpleFormDisplay480_Trial1").bindElement("oModelEmpForm>/EmpData");
						// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				},
				error: function (oError) {

					MessageBox.error(
						oError.responseJSON.message, {
							icon: MessageBox.Icon.Error,
							title: "Error",
							actions: sap.m.MessageBox.Action.Close, // default
							emphasizedAction: null,
							initialFocus: null

						}
					);
					// that.getView().setBusy(false);
				}
			});

  }	
		},
		onSaveformBind: function (oEvent) {

			// var oloadindicator = new sap.ui.core.BusyIndicator();
			// oloadindicator.show(0);
			var that = this;
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelEmpList1");
			// this.getView().byId("SimpleFormDisplay480_Trial").setModel(oModel, "oModelEmpList1");
			// this.Empid = oEvent.getParameter("arguments").Employeeid;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1//employee?employee=" +
				this.Empid;
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
							EmpData: results.data
						};
						oModel.setData(data);
						that.getView().byId("SimpleFormDisplay480_Trial").bindElement("oModelEmpList1>/EmpData");

						that.getView().byId("SimpleFormDisplay480_Trial1").bindElement("oModelEmpList1>/EmpData");
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

		onEditEmp: function () {

			var oEmpdata = this.getView().getModel("oModelEmpForm").getData().EmpData;

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

			this.byId("idfirstName").setValue(oEmpdata.firstName);
			this.byId("idMiddleName").setValue(oEmpdata.middleName);
			this.byId("idlastName").setValue(oEmpdata.lastName);
			this.byId("idBirthdate").setValue(oEmpdata.dob);
			this.byId("idgender").setSelectedKey(oEmpdata.gender[0]);
			this.byId("DP1").setValue(oEmpdata.joinDate);
			this.byId("DP2").setValue(oEmpdata.exitDate);
			this.byId("idemail").setValue(oEmpdata.email);
		},

		onexpandemployee: function (oEvent) {

			var oValue = String(oEvent.getSource().getExpanded());
			if (oValue === "true") {
				this.getView().byId("ideditemp").setVisible(true);
				
			} else {
				this.getView().byId("ideditemp").setVisible(false);
			}
		},

		onexpandLeave: function (oEvent) {
			this.getView().byId("idLeaveTab").removeSelections();
			var oValue = String(oEvent.getSource().getExpanded());
			if (oValue === "true") {
				// this.getView().byId("ideditleave").setVisible(true);
					this.getView().byId("idrange1").setVisible(true);
				this.getView().byId("idaddleave").setVisible(true);
			} else {
				// this.getView().byId("ideditleave").setVisible(false);
					this.getView().byId("idrange1").setVisible(false);
				this.getView().byId("idaddleave").setVisible(false);
			}
		},

		onexpandTeamHistory: function (oEvent) {
			this.getView().byId("idTeamMemberTab").removeSelections();
			var oValue = String(oEvent.getSource().getExpanded());
			if (oValue === "true") {
				 this.getView().byId("idaddHistory").setVisible(true);
					this.getView().byId("idrange2").setVisible(true);
			} else {
				this.getView().byId("idaddHistory").setVisible(false);
					this.getView().byId("idrange2").setVisible(false);
			}
		},
		onFormCancel: function () {
			this.byId("idEmpDailog").close();
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

if (!middleName){
	var oData = JSON.stringify({

					"firstName": firstName,
			
					"lastName": lastName,
					"dob": dob,
					"gender": gender,
					"joinDate": joinDate,
					"exitDate": exitDate,
					"email": email
				});
}
else{
	var oData = JSON.stringify({

					"firstName": firstName,
					"middleName": middleName,
					"lastName": lastName,
					"dob": dob,
					"gender": gender,
					"joinDate": joinDate,
					"exitDate": exitDate,
					"email": email
				});
}
				
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee?employee=" +
					this.Empid;

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
						// var oSuccess = "Company Name" + '\xa0' + "  Successfully!!!";
						if (results.status === "SUCCESS") {

							that.byId("idEmpDailog").setBusy(false);

							sap.m.MessageToast.show("Employee Saved Successfully");
							that.byId("idEmpDailog").close();
							that.byId("idEmpDailog").destroy();
							
							that.onSaveformBind();

						}
					},
					error: function (oError) {
						that.aMessages = [];
						var mes;
						that.byId("idEmpDailog").setBusy(false);
						sap.m.MessageToast.show(oError.responseJSON.message);
						if (oError.responseJSON.errors) {

							if (oError.responseJSON.errors.employee["."]) {
								mes = mes + oError.responseJSON.errors.employee["."] + ";" + '\xa0' + '\n';
								that.aMessages.push({
									type: 'Error',
									title: 'Form Level',
									description: oError.responseJSON.errors.employee["."]
								});
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

						if (that.aMessages) {
							that.byId("idError").setVisible(true).setText(that.aMessages);
						}
					}

					// that.byId("idEmpDailog").destroy();
					// that.byId("idEmpDailog").close();

				});
			} else {
				//do nothing
			}

			// this.getView().byId("toggleInfoToolbar13").setPressed(false);

		},

		onDeleteEmpConfirm: function (oEvent) {

			var that = this;
			MessageBox.confirm("Are you sure you want  delete this emplyoee permanently?", {
				title: "Delete",
				icon: MessageBox.Icon.WARNING,
				actions: ["YES", "NO"],
				emphasizedAction: "NO",
				initialFocus: "NO",
				onClose: function (sAction) {
					if (sAction === "NO") {
						sap.m.MessageToast.show("Action Canceled");
					} else {
						that.onDeleteEmp();
					}
				}
			});
		},

		onDeleteEmp: function (oEvent) {
			var that = this;
			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee?employee=" +
				this.Empid;
			$.ajax({
				type: "DELETE",
				url: sURL,
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

						// MessageBox.success(
						// 	oSuccess, {
						// 		icon: MessageBox.Icon.Success,
						// 		title: "Message",
						// 		actions: MessageBox.Action.Close,
						// 		emphasizedAction: null,
						// 		initialFocus: MessageBox.Action.Close

						// 	}
						// );
						sap.m.MessageToast.show("Employee deleted Successfully");
						that.onSaveformBind();
					}
				},
				error: function (oError) {
					// MessageBox.error(
					// 	oError.responseText, {
					// 		icon: MessageBox.Icon.Error,
					// 		title: "Error",
					// 		actions: sap.m.MessageBox.Action.Close, // default
					// 		emphasizedAction: null,
					// 		initialFocus: null

					// 	}
					sap.m.MessageToast.show(oError.responseJSON.message);

				}
			});
		},

		onLeaveBinding: function () {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelLeave");
			var date = new Date();
			// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var		firstDay = this.Startdate.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate.toISOString().split('T')[0];
	var sURL =
			"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/leaves?employee=" +
				this.Empid + "&from_date=" + firstDay + "&page=1&page_size=10&to_date=" + lastDay;

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

                var myData = results.data;
			that.LeaveTotalrec = results.metaData["totalRecords"];
			that.LeaveTotalPage = Math.ceil(that.LeaveTotalrec / 10); 
						var data = {
							LeaveData: results.data
						};
						oModel.setData(data);

							that.onLeavePagination(that.LeaveTotalrec);
					}
				},
				error: function (oError) {

					MessageBox.error(
						oError.responseJSON.message, {
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

		onTeamHistoryBinding: function () {
			var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelTeam");
				var		firstDay = this.Startdate1.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate1.toISOString().split('T')[0];
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/team-history?from_date="+firstDay+"&id=" +
				this.Empid + "&page=1&page_size=10&to_date="+lastDay;

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

     var myData = results.data;
			that.HistTotalrec = results.metaData["totalRecords"];
			that.HistTotalPage = Math.ceil(that.HistTotalrec / 10); 
						var data = {
							TeamData: results.data
						};
						oModel.setData(data);

								that.onHisPagination(that.HistTotalrec);
								// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				},
				error: function (oError) {

					MessageBox.error(
						oError.responseJSON.message, {
							icon: MessageBox.Icon.Error,
							title: "Error",
							actions: sap.m.MessageBox.Action.Close, // default
							emphasizedAction: null,
							initialFocus: null

						}
					);
					// that.getView().setBusy(false);
				}
			});
		},
		
		onSkillBinding: function (){
					var that = this;
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelSkill");
		
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skills?employee="+this.Empid+"&page=1&page_size=30";
    
    

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

     var myData = results.data;
			that.SkillTotalrec = results.metaData["totalRecords"];
			that.SkillTotalPage = Math.ceil(that.SkillTotalrec / 10); 
						var data = {
							SkillData: results.data
						};
						oModel.setData(data);

								that.onSkillPagination(that.SkillTotalrec);
								// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				},
				error: function (oError) {

					MessageBox.error(
						oError.responseJSON.message, {
							icon: MessageBox.Icon.Error,
							title: "Error",
							actions: sap.m.MessageBox.Action.Close, // default
							emphasizedAction: null,
							initialFocus: null

						}
					);
					// that.getView().setBusy(false);
				}
			});
		},
		
		/// Leave table 

		onLeaveDialog: function () {

			var oView = this.getView();
			if (!this.byId("idLeaveDailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.Leave",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idLeaveDailog").open();
			}
			// this.byId("idmemberName").setVisible(false);
			// this.byId("idmemberfrom").setEditable(true);
			this.byId("idupdate").setVisible(false);
		},

		onLeaveAdd: function (oEvent) {
			var that = this;
			var oDailog = oEvent.getSource().getParent();
			var oData;
			var flag = 0;
	
			var oReason = this.byId("idReason").getValue();
			var memberTill = this.byId("idmemberTo").getValue();
			var memberFrom = this.byId("idmemberfrom").getValue();

			if (!oReason) {
				this.byId("idReason").setValueState("Error").setValueStateText("Reason cannot be Blank");
				flag = 1;
			} else {
				this.byId("idReason").setValueState("None");

			}
			if (!memberFrom) {
				this.byId("idmemberfrom").setValueState("Error").setValueStateText("From Date Cannot be Blank");
				flag = 1;
			} else {
				this.byId("idmemberfrom").setValueState("None");

			}
			if (!memberTill) {
				this.byId("idmemberTo").setValueState("Error").setValueStateText("To Date Cannot be Blank");
				flag = 1;
			} else {
				this.byId("idmemberTo").setValueState("None");

			}

			if (flag !== 1) {
				oDailog.setBusy(true);
				oData = JSON.stringify({
					"leaveFrom": memberFrom,
					"leaveTill": memberTill,
					"reason": oReason
				});
			}

			if (flag !== 1) {
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/leave?employee=" +
					this.Empid;
				$.ajax({
					type: "POST",
					url: sURL,
					data: oData,
					contentType: "application/json",

					dataType: 'json', //Expected data format from server
					processdata: true, //True or False
					success: function (results) {

						var oSuccess = "Leave added successfully!!!";
						if (results.status === "SUCCESS") {
							 that.LeaveTotalrec = that.LeaveTotalrec + 1;
               that.onLeavePagination(that.LeaveTotalrec);
                	that.LeaveTotalPage = Math.ceil(that.LeaveTotalrec / 10);
                        	that.onFirst();
							oDailog.setBusy(false);
							oDailog.destroy();
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

						sap.m.MessageToast.show(oError.responseJSON.message);
						oDailog.setBusy(false);
						var mes = "";

						// var mes = "";
						if (oError.responseJSON.errors) {

							if (oError.responseJSON.errors.leave["."]) {
								var oError = oError.responseJSON.errors.leave["."];
								that.byId("idError1").setVisible(true).setText(oError);
							}
						}

					}
				});
			}

		},

		onLeaveCancel: function () {
			this.byId("idLeaveDailog").destroy();
		},

		onEditLeaveDialog: function (oEvent) {
			var oView = this.getView();
			// var oItem = this.getView().byId("idLeaveTab").getSelectedItem();
var currentItem = oEvent.getSource().getParent().getParent();
			this.idleave = currentItem.getCells()[0].mProperties["text"];
			var oFrom = currentItem.getCells()[1].mProperties["text"];
			var oTo = currentItem.getCells()[2].mProperties["text"];
			var oReason = currentItem.getCells()[3].mProperties["text"];
	

				

				if (!this.byId("idLeaveDailog")) {
					// load asynchronous XML fragment
					Fragment.load({
						id: oView.getId(),
						name: "ibm.fin.ar.fragments.Leave",
						controller: this ///very important 
					}).then(function (oDialog) {
						// connect dialog to the root view of this component (models, lifecycle)
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId("idLeaveDailog").open();
				}

				this.byId("idReason").setValue(oReason);
				this.byId("idmemberfrom").setValue(oFrom);
				this.byId("idmemberTo").setValue(oTo);
				this.byId("idAdd").setVisible(false);
			

		},

		onLeaveUpdate: function (oEvent) {
			var flag;
			var that = this;
			var oDailog = oEvent.getSource().getParent();

			var oReason = this.byId("idReason").getValue();
			var memberTill = this.byId("idmemberTo").getValue();
			var memberFrom = this.byId("idmemberfrom").getValue();
			if (!oReason) {
				this.byId("idReason").setValueState("Error").setValueStateText("Reason cannot be Blank");
				flag = 1;
			} else {
				this.byId("idReason").setValueState("None");

			}
			if (!memberFrom) {
				this.byId("idmemberfrom").setValueState("Error").setValueStateText("From Date Cannot be Blank");
				flag = 1;
			} else {
				this.byId("idmemberfrom").setValueState("None");

			}
			if (!memberTill) {
				this.byId("idmemberTo").setValueState("Error").setValueStateText("To Date Cannot be Blank");
				flag = 1;
			} else {
				this.byId("idmemberTo").setValueState("None");

			}
var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
    pattern: 'yyyy-MM-dd'
});
			if (flag !== 1) {
				
				memberFrom = new Date(memberFrom);
				memberTill = new Date(memberTill);
			memberFrom=	oDateFormat.format(memberFrom);
				memberTill=	oDateFormat.format(memberTill);
				oDailog.setBusy(true);
				var oData = JSON.stringify({
					"leaveFrom": memberFrom,
					"leaveTill": memberTill,
					"reason": oReason
				});

				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/leave?leave=" +
					this.idleave;

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
						oDailog.setBusy(false);
						oDailog.destroy();
						that.getView().setBusy(false);
						var oSuccess = "Leave" + ' ' + " Edited Successfully!!!";
						if (results.status === "SUCCESS") {
							that.onFirst();
							// that.getView().byId("idojectheader").setObjectTitle(Company);
							//	that.oCompanyName = Company;
							// that.onShiftGrpBinding();

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
						oDailog.setBusy(false);
						sap.m.MessageToast.show(oError.responseJSON.message);

						// var mes = "";
						if (oError.responseJSON.errors) {

							if (oError.responseJSON.errors.leave["."]) {
								var oError = oError.responseJSON.errors.leave["."];
								that.byId("idError1").setVisible(true).setText(oError);
							}
						}

					}
				});
			}

		},
		
		////History Table 
		
		onHistoryDialog: function(oEvent){
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
			this.byId("idAdd").setVisible(true);	
			this.byId("idlableemp").setText("Team");
		 	
	
		
		},

	onMemberAdd: function (oEvent) {
			var that = this;
				var ODialog = oEvent.getSource().getParent();
			var oData;
			var flag = 0;
			var Teamid = this.okey;
			var memberTill = this.byId("idmemberTo").getValue();
			var memberFrom = this.byId("idmemberfrom").getValue();

			if (!Teamid) {
				this.byId("idemp").setValueState("Error").setValueStateText("Team Name cannot be Blank");
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

	if (!memberTill) {
			
				// memberTill="9999-12-31";
			}
			if (memberTill) {
				oData = JSON.stringify({
					"employeeId": this.Empid,
					"memberFrom": memberFrom,
					"memberTill": memberTill
				});

			} else {

				oData = JSON.stringify({
					"employeeId": this.Empid,
					"memberFrom": memberFrom
				});
			}

			if (flag !== 1) {
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee?id=" +
					Teamid;
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
   ODialog.destroy();
   that.okey = ''
   	that.onTeamHistoryBinding();
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

						sap.m.MessageToast.show(oError.responseJSON.message);
this.okey = '';
						var mes = "";

						if (oError.responseJSON.errors) {
							var oErr = oError.responseJSON.errors["team-member"]["."];
						that.byId("idteamerror").setVisible(true).setText(oErr);
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
					
				});
			}

		},
     

onSearch:function(oEvent){
	var that=this;
			var sQuery = oEvent.getParameters().value;
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/teams?company="+this.Companyid+"&name_query="+sQuery+"&page_size=30"; //+ this.Companyid +

			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				var TeamData = Results.data;
			// this.EmpTotalrec = Results.metaData["totalRecords"];

			// this.EmpTotalPage = Math.ceil(this.EmpTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = that.getView().getModel("oModelTeamList");
			oModel.setData(Results);
			oModel.setData({
				"TeamData": TeamData
			});		
				},
				error: [this.errorEmpList, this]
			});
},

	onCompanyTeams: function () {

			var that = this;

			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/teams?company="+this.Companyid+"&page_size=30"; //+ this.Companyid +

			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: this.SuccessTeamList.bind(this),
				error: [this.errorEmpList, this]
			});

		},

		SuccessTeamList: function (Results) {
			var TeamData = Results.data;
			// this.EmpTotalrec = Results.metaData["totalRecords"];

			// this.EmpTotalPage = Math.ceil(this.EmpTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(Results);
			oModel.setData({
				"TeamData": TeamData
			});

			// this.getView().byId("idEmpsection").setTitle("Employees(" + this.EmpTotalrec + ")");

			//step 3: Set the model to the list level as default model
			this.getView().setModel(oModel, "oModelTeamList");
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

		handleValueEmployee: function (oEvent) {
			var oView = this.getView();
			this.inputId = oEvent.getSource().getId();
			if (!this.byId("idteamdailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.TeamList",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idteamdailog").open();
			}
	// this.byId("idempdailog").setTitle("Teams");
				this.onCompanyTeams();
		},
           handleValueSkill: function(oEvent){
           		var oView = this.getView();
			this.inputId1 = oEvent.getSource().getId();
			if (!this.byId("idskilldailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.SkillList",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idskilldailog").open();
			}
	// this.byId("idempdailog").setTitle("Teams");
				this.onskillset();
           },
           
           
onSearchskill:function(oEvent){
	var that=this;
			var sQuery = oEvent.getParameters().value;
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/skills?company="+this.Companyid+"&name_query="+sQuery+"&page_size=30"; //+ this.Companyid +

			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				var ComSkillData = Results.data;
			// this.EmpTotalrec = Results.metaData["totalRecords"];

			// this.EmpTotalPage = Math.ceil(this.EmpTotalrec / 10); // 10 because list shows only 9 item, division operation gives total no of pages = no of buttons
			var oModel = that.getView().getModel("oModelComSkill");
			oModel.setData(Results);
			oModel.setData({
				"ComSkillData": ComSkillData
			});		
				},
				error: [this.errorEmpList, this]
			});
},
	_handleValueHelpCloseskill: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			// var oValue = oSelectedItem["mProperties"].title;
			if (oSelectedItem) {
				this.skillid = oSelectedItem["mAggregations"].customData[0].mProperties.key;
				
				//one way to set
				// this.byId("idemp").setValue(oValue);	
				//second way
				this.byId(this.inputId1).setValue(oSelectedItem.getTitle());
			}
		},
		
onSkillAdd: function(oEvent){
	
},		
	
	onEditskillDailog: function(oEvent){
					var oView = this.getView();

			// var oItem = this.getView().byId("idTeamMemberTab").getSelectedItem();
var currentItem = oEvent.getSource().getParent().getParent();
			this.idskill = currentItem.getCells()[0].mProperties["text"];
			var skillname = currentItem.getCells()[1].mProperties["text"];
			var prof = currentItem.getCells()[3].mProperties["value"];
		
		

				if (!this.byId("idSkillDailog")) {
					// load asynchronous XML fragment
					Fragment.load({
						id: oView.getId(),
						name: "ibm.fin.ar.fragments.Skill",
						controller: this ///very important 
					}).then(function (oDialog) {
						// connect dialog to the root view of this component (models, lifecycle)
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId("idSkillDailog").open();
				}
				this.byId("idskill").setEditable(false).setValue(skillname);
				this.byId("idprof").setValue(prof);
				// this.byId("idmemberTo").setValue(oTo);
				this.byId("idAdd").setVisible(false);
				// this.byId("idlableemp").setText("Team");

	}	,
		onEditHistoryDailog: function (oEvent) {
			var oView = this.getView();

			// var oItem = this.getView().byId("idTeamMemberTab").getSelectedItem();
var currentItem = oEvent.getSource().getParent().getParent();
			this.idTeam = currentItem.getCells()[0].mProperties["text"];
			var oFrom = currentItem.getCells()[2].mProperties["text"];
			var oTo = currentItem.getCells()[3].mProperties["text"];
			var team = currentItem.getCells()[1].mProperties["text"];
		

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
				
				this.byId("idemp").setEditable(false).setValue(team);
				this.byId("idmemberfrom").setValue(oFrom);
				if(oTo === '31-Dec-9999')
				this.byId("idmemberTo").setValue('');
				else
					this.byId("idmemberTo").setValue(oTo);
				this.byId("idAdd").setVisible(false);
				this.byId("idlableemp").setText("Team");

			

		},

		onMemberSubmit: function (oEvent) {
			var oDailog = oEvent.getSource().getParent();
			oDailog.setBusy(true);
			var that = this;
			this.getView().setBusy(true);
			var oData;
			var flag = 0;
			var employeeId = this.id;
			var memberTill = this.byId("idmemberTo").getValue().trim();
			var memberFrom = this.byId("idmemberfrom").getValue().trim();

var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
    pattern: 'yyyy-MM-dd'
});

	memberFrom = new Date(memberFrom);
			
			memberFrom=	oDateFormat.format(memberFrom);
			
				
			if (memberTill) {
				oData = JSON.stringify({
					"employeeId": this.Empid,
					"memberFrom": memberFrom.trim(),
					"memberTill": memberTill.trim()
				});

			} else {
	memberTill = new Date(memberTill);
		memberTill=	oDateFormat.format(memberTill);
				oData = JSON.stringify({
					"employeeId": this.Empid,
					"memberFrom": memberFrom.trim()
				});
			}
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/employee?employee=" +
				this.Empid + "&member_from=" + memberFrom + "&team=" + this.idTeam;
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
					var oSuccess = "Team History changed successfully!!!";
					if (results.status === "SUCCESS") {
						that.onTeamHistoryBinding();
						that.getView().byId("idTeamMemberTab").removeSelections();
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
			this.okey = '';
		},

           ///Skill Table
           
           onAddSkillDialog: function(){
           	
           			var oView = this.getView();
			if (!this.byId("idSkillDailog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ibm.fin.ar.fragments.Skill",
					controller: this ///very important 
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("idSkillDailog").open();
			}
			// this.byId("idmemberName").setVisible(false);
			// this.byId("idmemberfrom").setEditable(true);
			this.byId("idupdate").setVisible(false);
				this.byId("idAdd").setVisible(true);	
			// 		this.byId("idlableemp").setText("Team");
			
			this.onskillset();
		},
           	
           	onskillset: function(oEvent){
           		
           			var that = this;
           			
           					var oModel = new sap.ui.model.json.JSONModel();
	
			// var sQuery = oEvent.getParameters().value;
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/company/skills?company="+this.Companyid+"&page=1&page_size=30";  

			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function(Results){
				var ComSkillData = Results.data;
	
			oModel.setData({
				"ComSkillData": ComSkillData
			});
		
				that.getView().setModel(oModel, "oModelComSkill");
				},
				error: [this.errorEmpList, this]
			});
           		
           	},
           	
        	onSkillCancel: function () {
			this.byId("idSkillDailog").destroy();
		},
		
		onskillchange:function(){
			alert("searchedchange");
		},
		
		
				onselectionskillchange:function(){
			alert("searchedonselection");
		},
		
		onAddSkill: function(oEvent){
			
				var that = this;
			var oDailog = oEvent.getSource().getParent();
			var oData;
			var flag = 0;
			var skillId = 	this.skillid;
			// var oskillkey = this.byId("idskill").getKey();
			var prof = this.byId("idprof").getValue();
		

			if (!skillId) {
				this.byId("idskill").setValueState("Error").setValueStateText("Skill cannot be Blank");
				flag = 1;
			} else {
				this.byId("idskill").setValueState("None");

			}
			if (!prof) {
				sap.m.MessageToast.show('Employee must have proficiency level more then one');
				// this.byId("idprof").setValueState("Error").setValueStateText(" Employee Should be proficient");
			
				flag = 1;
			} 
				if (flag !== 1) {
				
						oData = JSON.stringify({
					"proficiency": prof
				
				});
				
		var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skill?employee="+this.Empid+"&skill=" +
					skillId;
					
				$.ajax({
					type: "POST",
					url: sURL,
					data: oData,
					contentType: "application/json",

					dataType: 'json', //Expected data format from server
					processdata: true, //True or False
					success: function (results) {

						var oSuccess = "Skill added successfully!!!";
						if (results.status === "SUCCESS") {
							 that.SkillTotalrec = that.SkillTotalrec + 1;
               that.onSkillPagination(that.SkillTotalrec);
                	that.SkillTotalrec = Math.ceil(that.SkillTotalrec / 10);
                        	that.onFirst2();
							oDailog.setBusy(false);
							oDailog.destroy();
							
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
						this.skillid='';
					},
					error: function (oError) {
that.skillid='';
						sap.m.MessageToast.show(oError.responseJSON.message);
						oDailog.setBusy(false);
						var mes = "";

						// var mes = "";
						if (oError.responseJSON.errors) {

							if (oError.responseJSON.errors.leave["."]) {
								var oError = oError.responseJSON.errors.leave["."];
								that.byId("idError1").setVisible(true).setText(oError);
							}
						}

					}
				});
				}
				else{
					this.skillid = '';
				}
			
			
		},
           
          onSkillUpdate: function(oEvent){
          	 		var flag;
			var that = this;
			var oDailog = oEvent.getSource().getParent();

			var prof = this.byId("idprof").getValue();
			
			if (!prof) {
			sap.m.MessageBox.error('Employee must have proficiency level minumum one');
				flag = 1;
			} 
		

			if (flag !== 1) {
				var	oData = JSON.stringify({
					"proficiency": prof
				
				});
	var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skill?employee="+this.Empid+"&skill="+this.idskill;
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
						oDailog.setBusy(false);
						oDailog.destroy();
						that.getView().setBusy(false);
						var oSuccess = "Skill" + ' ' + " Edited Successfully!!!";
						if (results.status === "SUCCESS") {
					
							// that.getView().byId("idojectheader").setObjectTitle(Company);
							//	that.oCompanyName = Company;
							// that.onSkillBinding();
                                 that.onFirst2();
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
					oDailog.setBusy(false);
					that.getView().setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);

			
				}
			});
			}
          },
//LEAVE TABLE PAGINATION

		onLeavePagination: function (ORec) {

			if (ORec <= 10) {
				this.getView().byId("idToolbarList").setVisible(false);

		

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
			if (oNext >= this.LeaveTotalPage) {
				//do nothing
				if (this.getView().byId("idb1").getType() === "Emphasized") {
					this.getView().byId("idb1").setType("Default");
					this.getView().byId("idb2").setType("Emphasized");
					this.onSecond();
				} else if (this.getView().byId("idb2").getType() === "Emphasized" && this.getView().byId("idb2").getText() === this.LeaveTotalPage) {
					this.getView().byId("idb2").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb2").getType() === "Emphasized") {
					this.getView().byId("idb2").setType("Default");
					this.getView().byId("idb3").setType("Emphasized");
					this.onThird();
				} else if (this.getView().byId("idb3").getType() === "Emphasized" && this.getView().byId("idb3").getText() === this.LeaveTotalPage) {
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

			var oModel2 = this.getView().getModel("oModelLeave");
			// oModel2.setData({
			// 	"newData": myData
			// });
			var date = new Date();
			// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var	firstDay = this.Startdate.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			var	lastDay = this.Enddate.toISOString().split('T')[0];
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/leaves?employee=" +
				this.Empid + "&from_date=" + firstDay + "&page="+oPage+"&page_size=10&to_date=" + lastDay;

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
							LeaveData: results.data
						};
						oModel2.setData(data);

							
					}
				},
				error: function (oError) {

				}
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
	var		firstDay = this.Startdate.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate.toISOString().split('T')[0];
			var oModel2 = this.getView().getModel("oModelLeave");
				var date = new Date();
			// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var		firstDay = this.Startdate.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			var	lastDay = this.Enddate.toISOString().split('T')[0];
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/leaves?employee=" +
				this.Empid + "&from_date=" + firstDay + "&page="+oPage+"&page_size=10&to_date=" + lastDay;

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
							LeaveData: results.data
						};
						oModel2.setData(data);

							
					}
				},
				error: function (oError) {

				}
			});
		},
		onThird: function () {
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Emphasized");
			this.getView().byId("idb4").setType("Default");

			var oPage = this.getView().byId("idb3").getText();

				var oModel2 = this.getView().getModel("oModelLeave");
				var date = new Date();
			// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var		firstDay = this.Startdate.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate.toISOString().split('T')[0];
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/leaves?employee=" +
				this.Empid + "&from_date=" + firstDay + "&page="+oPage+"&page_size=10&to_date=" + lastDay;

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
							LeaveData: results.data
						};
						oModel2.setData(data);

							
					}
				},
				error: function (oError) {

				}
			});
		},
		onFourth: function () {
			this.getView().byId("idb1").setType("Default");
			this.getView().byId("idb2").setType("Default");
			this.getView().byId("idb3").setType("Default");
			this.getView().byId("idb4").setType("Emphasized");

			var oPage = this.getView().byId("idb4").getText();

			var oModel2 = this.getView().getModel("oModelLeave");
				var date = new Date();
			// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var 	firstDay = this.Startdate.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate.toISOString().split('T')[0];
			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/leaves?employee=" +
				this.Empid + "&from_date=" + firstDay + "&page="+oPage+"&page_size=10&to_date=" + lastDay;

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
							LeaveData: results.data
						};
						oModel2.setData(data);

							
					}
				},
				error: function (oError) {

				}
			});
		},


onHisPagination: function(ORec){
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
	if (oNext >= this.HistTotalPage) {
		//do nothing
				if (this.getView().byId("idb5").getType() === "Emphasized") {
					this.getView().byId("idb5").setType("Default");
					this.getView().byId("idb6").setType("Emphasized");
					this.onSecond1();
				} else if (this.getView().byId("idb6").getType() === "Emphasized" && this.getView().byId("idb6").getText()  === this.HistTotalPage) {
					this.getView().byId("idb6").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb6").getType() === "Emphasized") {
					this.getView().byId("idb6").setType("Default");
					this.getView().byId("idb7").setType("Emphasized");
					this.onThird1();
				} else if (this.getView().byId("idb7").getType() === "Emphasized" && this.getView().byId("idb7").getText() === this.HistTotalPage) {
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

			var oPage = this.getView().byId("idb1").getText();

			var oModel2 = this.getView().getModel("oModelTeam");
			// oModel2.setData({
			// 	"newData": myData 
			// });
				var		firstDay = this.Startdate1.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate1.toISOString().split('T')[0];
		// var sURL =
		// 		"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/team-history?id=" +
		// 		this.Empid + "&page="+oPage+"&page_size=10";
 var sURL	=
     "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/team-history?from_date="+firstDay+"&id=" +
				this.Empid + "&page="+oPage+"&page_size=10&to_date="+lastDay;

			$.ajax({
				type: "GET",
				url: sURL,

				dataType: "json",
				contentType: "application/json",
				headers: {
					"accept": " */*",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Credentials": true,
					"Access-Control-Allow-Methods": "*"
				},
				success: function (Results) {
					oModel2.setData({
						"TeamData": Results.data
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

			var oModel2 = this.getView().getModel("oModelTeam");
			// oModel2.setData({
			// 	"newData": myData
				var		firstDay = this.Startdate1.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate1.toISOString().split('T')[0];
		// var sURL =
		var sURL =
		   "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/team-history?from_date="+firstDay+"&id=" +
				this.Empid + "&page="+oPage+"&page_size=10&to_date="+lastDay;
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
		onThird1: function () {
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Emphasized");
			this.getView().byId("idb8").setType("Default");

			var oPage = this.getView().byId("idb7").getText();

			var oModel2 = this.getView().getModel("oModelTeam");
			// oModel2.setData({
			// 	"newData": myData
			// });
				var		firstDay = this.Startdate1.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate1.toISOString().split('T')[0];
		var sURL =
			   "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/team-history?from_date="+firstDay+"&id=" +
				this.Empid + "&page="+oPage+"&page_size=10&to_date="+lastDay;
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
		onFourth1: function () {
			this.getView().byId("idb5").setType("Default");
			this.getView().byId("idb6").setType("Default");
			this.getView().byId("idb7").setType("Default");
			this.getView().byId("idb8").setType("Emphasized");

			var oPage = this.getView().byId("idb8").getText();

			var oModel2 = this.getView().getModel("oModelTeam");
			// oModel2.setData({
			// 	"newData": myData
				var		firstDay = this.Startdate1.toISOString().split('T')[0];
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var	lastDay = this.Enddate1.toISOString().split('T')[0];
		var sURL =
		   "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/team-history?from_date="+firstDay+"&id=" +
				this.Empid + "&page="+oPage+"&page_size=10&to_date="+lastDay;
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
		
		
		
		
		onSkillPagination: function(ORec){
			
			
			if (ORec <= 10) {
				this.getView().byId("idToolbarList2").setVisible(false);

			

			} else if (ORec <= 20) {

				this.getView().byId("idToolbarList2").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(false);

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(false);
				this.getView().byId("idb12").setVisible(false).setText("2");

			} else if (ORec <= 30) {

				this.getView().byId("idToolbarList2").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(false);

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(true);
				this.getView().byId("idb12").setVisible(false).setText("3");

				//	  this.getView().byId("idb1")._bActive = true;
			} else if (ORec <= 40) {

				this.getView().byId("idToolbarList2").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(false);

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(true);
				this.getView().byId("idb12").setVisible(true);

				//  this.getView().byId("idb1")._bActive = true;
			} else {
				this.getView().byId("idToolbarList2").setVisible(true);

				// this.getView().byId("idPrev1").setEnabled(false);
				// this.getView().byId("idNext1").setEnabled(true);

				this.getView().byId("idb9").setVisible(true);
				this.getView().byId("idb10").setVisible(true);
				this.getView().byId("idb11").setVisible(true);
				this.getView().byId("idb12").setVisible(true);

				//	  this.getView().byId("idb1")._bActive = true;
			}
},

	onPrev2: function () {

			//  this.getView().byId("idb1")._bActive = true;	
			var oPrev = this.getView().byId("idb9").getText();

			if (oPrev === "1") {
					if (this.getView().byId("idb10").getType() === "Emphasized") {
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
					this.onSecond1();
				} else if (this.getView().byId("idb11").getType() === "Emphasized") {
					this.onThird2();
				} else {
					this.onFourth2();
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

		onNext2: function () {

			//	   this.getView().byId("idb1")._bActive = true;	
			var oNext = parseInt(this.getView().byId("idb12").getText());
	if (oNext >= this.SkillTotalPage) {
		//do nothing
				if (this.getView().byId("idb9").getType() === "Emphasized") {
					this.getView().byId("idb9").setType("Default");
					this.getView().byId("idb10").setType("Emphasized");
					this.onSecond2();
				} else if (this.getView().byId("idb10").getType() === "Emphasized" && this.getView().byId("idb10").getText()  === this.HistTotalPage) {
					this.getView().byId("idb10").setType("Emphasized");
					sap.m.MessageToast.show("No More Pages");
				} else if (this.getView().byId("idb10").getType() === "Emphasized") {
					this.getView().byId("idb10").setType("Default");
					this.getView().byId("idb11").setType("Emphasized");
					this.onThird2();
				} else if (this.getView().byId("idb11").getType() === "Emphasized" && this.getView().byId("idb7").getText() === this.HistTotalPage) {
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
		
	}
	
	else{
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
			//
	}
			

		

	

		},


 	onFirst2: function () {
	        this.getView().byId("idb9").setType("Emphasized");
			this.getView().byId("idb10").setType("Default");
			this.getView().byId("idb11").setType("Default");
			this.getView().byId("idb12").setType("Default");
		

			var oPage = this.getView().byId("idb9").getText();

			var oModel2 = this.getView().getModel("oModelSkill");
	
 	var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skills?employee="+this.Empid+ "&page="+oPage+"&page_size=10";

			$.ajax({
				type: "GET",
				url: sURL,

				dataType: "json",
				contentType: "application/json",
				headers: {
					"accept": " */*",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Credentials": true,
					"Access-Control-Allow-Methods": "*"
				},
				success: function (Results) {
					oModel2.setData({
						"SkillData": Results.data
					});
				},
				error: [this.errorREST, this]
			});

		},
		onSecond2: function () {
			//sap.ui.core.BusyIndicator.show(20);
			//  a.show();	

			// var olist = this.getView().byId("idList").setBusy(true);
			this.getView().byId("idb9").setType("Default");
			this.getView().byId("idb10").setType("Emphasized");
			this.getView().byId("idb11").setType("Default");
			this.getView().byId("idb12").setType("Default");
			
		

			var oPage = parseInt(this.getView().byId("idb10").getText());

			var oModel2 = this.getView().getModel("oModelSkill");
			// oModel2.setData({
			// 	"newData": myData
	
	var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skills?employee="+this.Empid+ "&page="+oPage+"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					
					oModel2.setData({
						"SkillData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},
		onThird2: function () {
			this.getView().byId("idb9").setType("Default");
			this.getView().byId("idb10").setType("Default");
			this.getView().byId("idb11").setType("Emphasized");
			this.getView().byId("idb12").setType("Default");
			
			var oPage = this.getView().byId("idb11").getText();

			var oModel2 = this.getView().getModel("oModelSkill");
			// oModel2.setData({
			// 	"newData": myData
			// });
		var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skills?employee="+this.Empid+ "&page="+oPage+"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"SkillData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},
		onFourth2: function () {
			this.getView().byId("idb9").setType("Default");
			this.getView().byId("idb10").setType("Default");
			this.getView().byId("idb11").setType("Default");
			this.getView().byId("idb12").setType("Emphasized");

			var oPage = this.getView().byId("idb12").getText();

			var oModel2 = this.getView().getModel("oModelTeam");
			// oModel2.setData({
			// 	"newData": myData
	var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/employee/skills?employee="+this.Empid+ "&page="+oPage+"&page_size=10";
			$.ajax({
				type: "GET",
				url: sURL,
				contentType: "application/json",
				dataType: "json",
				success: function (Results) {
					oModel2.setData({
						"SkillData": Results.data
					});
				},
				error: [this.errorREST, this]
			});
		},
		
		 	oDaterangeLeave: function(oEvent){
	var Dates = oEvent.getParameters();	
	this.Startdate = Dates.from;
	this.Enddate = Dates.to;
	this.onLeaveBinding();
		 	},
		 	
		 		oDaterangeHistory: function(oEvent){
	var Dates = oEvent.getParameters();	
	this.Startdate1 = Dates.from;
	this.Enddate1 = Dates.to;
	this.onTeamHistoryBinding();
		 	},

		onNavBack: function () {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("BothRoute", true);
				}
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf ibm.fin.ar.view.Employee
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ibm.fin.ar.view.Employee
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ibm.fin.ar.view.Employee
		 */
		//	onExit: function() {
		//
		//	}

	});

});