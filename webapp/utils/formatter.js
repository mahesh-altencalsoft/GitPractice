sap.ui.define([	], function()

{
	return  {
		
		formatName: function(ofirst,omid,olast){
			
		// var	 name = ofirst + "";
	

		var  name = ofirst + '\xa0' ;

		 if( omid === 'null' || typeof(omid) === "undefined"|| omid === ''  ) {
		 //do nothing
		 }
		 else
		 {
		 		name +=  omid + '\xa0';
		 }
		if(olast === 'null' || typeof(olast) === "undefined" || olast === '') {
		 	 //do nothing
		 }
		 else
		 {
		 		name +=  olast;
		 }

		return name;
			
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
		
		formatIcon: function(oValue){
		
		var a= true,
		    b= false,
		    icon;
		    if(a==oValue){
		    		 icon = 'sap-icon://accept';
		    }
		else {
			 icon = 'sap-icon://decline';	
		}
	
		
	
		return icon;
		},
		
			formatIconColor: function(oValue){
		
		var a= true,
		    b= false,
		    color;
		    if(a==oValue){
		    		 color = '#008000';
		    }
		else {
			 color = '#FF0000';	
		}
	
		
	
		return color;
		}
		
	
};
 });