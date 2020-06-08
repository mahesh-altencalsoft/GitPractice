sap.ui.define(["sap/ui/core/UIComponent"],
	function (UIComponent, Btn) {
		return UIComponent.extend("ibm.fin.ar.Component", {
			metadata: {
				manifest: "json"
			},
			init: function () {
				//we will write initilization code like initialization of router
				//calling the base class construtor in child class
				sap.ui.core.UIComponent.prototype.init.apply(this);
				this.getRouter().initialize();
			},
			destroy: function () {
				//clean up code
				sap.ui.core.UIComponent.prototype.destroy.apply(this);
			}
		});
	}
);