sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
		"ibm/fin/ar/utils/formatter",
			"sap/ui/core/Fragment",
			"sap/m/MessageBox"
], function (Controller,History,formatter,Fragment,MessageBox) {
	"use strict";

	return Controller.extend("ibm.fin.ar.controller.Shift", {

           formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ibm.fin.ar.view.Shift
		 */
		 
		 //Global  Variable
		Teamid:0,
		Shiftid:0,
		SkillTotalrec:0,
		SkillTotalPage:0,
		
		onInit: function () {

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("TeamtoShiftpage").attachPatternMatched(this._onObjectMatched, this);
		
		

		},


       _onObjectMatched: function(oEvent){
       		this.Shiftid = oEvent.getParameter("arguments").Shiftid;
			// this.getView().byId("idojectheader").setObjectTitle(this.oCompanyName);
			this.Teamid =  oEvent.getParameter("arguments").Teamid;
					this.onSkillBinding();
					var	DataExist = 	this.getView().getModel("oModelGBShift").getJSON();
		 if (DataExist === "{}")
  {
  	this.onShiftDetail();
  	
  }
					
       },
       
       
       
       onShiftDetail: function(){
       	 var that = this;
       	
       			var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift?shift=" +
				this.Shiftid;
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
							ShiftData: results.data
						};
						that.getView().getModel("oModelGBShift").setData(data);
				
						// sap.m.MessageToast("Company Saved Successfully");
						// oloadindicator.hide();
						// that.getView().setBusy(false);
					}
				}
				// error: function (oError) {

				// 	MessageBox.error(
				// 		oError.responseJSON.message, {
				// 			icon: MessageBox.Icon.Error,
				// 			title: "Error",
				// 			actions: sap.m.MessageBox.Action.Close, // default
				// 			emphasizedAction: null,
				// 			initialFocus: null

				// 		}
				// 	);
				// 	// that.getView().setBusy(false);
				// }
			});
       },
       
       
       
       	onSkillBinding: function () {
			var that = this;
			// this.getView().setBusy(true);
			// this.getView().setBusy(true);
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel, "oModelSkillList");

			var sURL =
				"https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift/skills?page=1&page_size=30&shift=" +
				this.Shiftid;
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
	// that.getView().setBusy(false);
					
					// that.onSkillPagination(that.SkillTotalrec);
					}
				},
				error: function (oError) {

				
				}
			});
		},
		
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
				
				oDailog.setBusy(true);
				
						oData = JSON.stringify({
					"proficiency": prof
				
				});
				
		var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift/skill?shift="+this.Shiftid+"&skill=" +
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
               //that.onSkillPagination(that.SkillTotalrec);
                	that.SkillTotalrec = Math.ceil(that.SkillTotalrec / 10);
                        	// that.onFirst2();
                        	that.onSkillBinding();
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
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=true&name_query="+sQuery+"&page=1&page_size=30&team="+this.Teamid; //+ this.Companyid +

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
		
           	
           	onskillset: function(oEvent){
           		
           			var that = this;
           			
           					var oModel = new sap.ui.model.json.JSONModel();
	
			// var sQuery = oEvent.getParameters().value;
				var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/team/skills?direct_only=true&page=1&page_size=30&team="+this.Teamid;  

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
				oDailog.setBusy(true);
				var	oData = JSON.stringify({
					"proficiency": prof
				
				});
	var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift/skill?shift="+this.Shiftid+"&skill="+this.idskill;
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
					oDailog.setBusy(false);
					that.getView().setBusy(false);
					sap.m.MessageToast.show(oError.responseJSON.message);

			
				}
			});
			}
          },
        	onSkillCancel: function () {
			this.byId("idSkillDailog").destroy();
		},
		
		
// 			onEditshiftdet: function(){
		
		
// ;			
// 			var oView = this.getView();

// 			//	create dialog lazily
// 			if (!this.byId("idShtDailog")) {
// 				// load asynchronous XML fragment
// 				Fragment.load({
// 					id: oView.getId(),
// 					name: "ibm.fin.ar.fragments.ShiftDetail",
// 					controller: this ///very important 
// 				}).then(function (oDialog) {
// 					// connect dialog to the root view of this component (models, lifecycle)
// 					oView.addDependent(oDialog);
// 					oDialog.open();
// 				});
// 			} else {
// 				this.byId("idShtDailog").open();
// 			}
	
// 		// this.byId("idShiftName").setValue(oEmpdata.firstName);
// 		// 	this.byId("idShiftDesc").setValue(oEmpdata.middleName);
// 		// 	this.byId("idfromdate").setValue(oEmpdata.lastName);
// 		// 	this.byId("idstarttime").setValue(oEmpdata.dob);
// 		// 	this.byId("idEndtime").setSelectedKey(oEmpdata.gender[0]);
// 		// 	this.byId("DP1").setValue(oEmpdata.joinDate);
// 		// 	this.byId("DP2").setValue(oEmpdata.exitDate);
// 		// 	this.byId("idemail").setValue(oEmpdata.email);
	
// 		},
			onShiftCancel: function () {
			this.byId("idShtDailog").destroy();
			// this.getView().byId("toggleInfoToolbar13").setPressed(false);
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

		var sURL = "https://schedulerc8aaeac97.ap1.hana.ondemand.com/scheduler/v1/shift?shift=" +
					this.Shiftid;	
			
					$.ajax({
					type: "PUT",
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
   that.onShiftDetail();
							sap.m.MessageToast.show("Shift edited Successfully");
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
		
		onShiftDetedit: function(){
			
			var Data = this.getView().getModel("oModelGBShift").getData().ShiftData;
			
			// var oModel2 = new sap.ui.model.json.JSONModel();
			
			// this.getView().setModel(oModel2,"oModelGBShiftNew");
			
			// oModel2.setData({
			// 		ShiftData:Data
			// });
			
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
		
		 this.byId("idShiftName").setValue(Data.name);
		 this.byId("idShiftDesc").setValue(Data.description);
		this.byId("idfromdate").setValue(Data.validFrom);
		 this.byId("idtodate").getValue(Data.validTill);
         this.byId("idstarttime").setValue(this.formatTime(Data.starts));
		this.byId("idEndtime").setValue(this.formatTime(Data.duration));
			
			this.byId("idmon").setSelected(Data.onMonday);
	     	this.byId("idsun").setSelected(Data.onSunday);
			this.byId("idtue").setSelected(Data.onTuesday);
			this.byId("idwed").setSelected(Data.onWednesday);
			this.byId("idthu").setSelected(Data.onThursday);	
			this.byId("idfri").setSelected(Data.onFriday);
			this.byId("idsat").setSelected(Data.onSaturday);
		
		
		},
		
formatTime:function(mins){
			
	  var hrs = Math.floor(mins / 60);  
            // getting the minutes. 
            var min = mins % 60;  
            // formatting the hours. 
          var  hrs1 = hrs < 10 ? '0' + hrs : hrs;  
            // formatting the minutes. 
           var  min1 = min < 10 ? '0' + min : min;  
            // returning them as a string. 
            
               var newformat = hrs1 >= 12 ? 'PM' : 'AM'; 
               hrs1 = hrs1 % 12 ;
          return hrs1+":"+min1 + ' ' + newformat; 
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
		 * @memberOf ibm.fin.ar.view.Shift
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ibm.fin.ar.view.Shift
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ibm.fin.ar.view.Shift
		 */
		//	onExit: function() {
		//
		//	}

	});

});