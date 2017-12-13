var radarRoles = (function(){
 var self = {};
//moved  var background;
//moved  var roleSelects;
   self.initRadarRoles=function() {
	$("#radarRolesDiv").css("visibility", "visible");

	xmlDoc = getXmlDoc("data/" + dbName + ".xml");
	var fields = XML_getFieldNames(xmlDoc);
	fields.splice(0,0,"");
	background = xmlDoc.getElementsByTagName("background")[0];
	if (!background){
		background = xmlDoc.createElement("background");
		var radarElt=xmlDoc.childNodes[0];
		radarElt.appendChild(background);
	}
self.printXmll();
	//xmlDoc.appendChild(background);
	 roleSelects = [radarRoleLselect, radarRoleHselect, radarRoleRselect, radarRoleCselect, radarRoleSselect, radarRoleBgTypeSelect, radarRoleBgHorderSelect,radarRoleBgHnumSelect, radarRoleBgRorderSelect, radarRoleBgRnumSelect, radarRoleColorStartSelect, radarRoleColorEndSelect ];
	
	 
common.fillSelectOptions(radarRoleHselect, fields);
common.fillSelectOptions(radarRoleRselect, fields);
common.fillSelectOptions(radarRoleLselect, fields);
common.fillSelectOptions(radarRoleCselect, fields);
common.fillSelectOptions(radarRoleSselect, fields);
self.initRoless();

}
   self.radarRoleAction=function(input) {
	if (input.textContent == "OK") {
if(self.updateRoles()){
self.printXml();
			var s = new XMLSerializer();
			 var str = s.serializeToString(xmlDoc);
devisuProxy.saveRadarXmlXml(dbName,str);
			$("#radarRolesDiv").css("visibility", "hidden");
			//window.location.href=updateQueryStringParameter(window.location.href, "dbName", dbName);
		}
		
		return;
	}

	if (input.textContent == "Cancel") {
		$("#radarRolesDiv").css("visibility", "hidden");
		return;
	}

}

   self.updateRoles=function() {
	for ( var i = 0; i < roleSelects.length; i++) {
		var select = roleSelects[i];
		var value = $(select).val();
		if (i < 4 && (!value || value == "")) {
			alert(roleSelects + "value is mandatory");
			return false;
		}
		var field = XML_getField(value);
		if(!field && select==radarRoleSselect)
			continue;
		if (select == radarRoleHselect) {
			field.setAttribute("radarRole", "horizontalAxis");
		}
		if (select == radarRoleRselect) {
			field.setAttribute("radarRole","radialAxis");
		}
		if (select == radarRoleLselect) {
			field.setAttribute("radarRole","label");
		}
		if (select == radarRoleCselect) {
			field.setAttribute("radarRole","color");
		}
		if (select == radarRoleSselect) {
			field.setAttribute("radarRole","shape");
		}

		// ************BG*******************
		if (select == radarRoleBgTypeSelect) {
			background.setAttribute("type", value);
		}
		if (select == radarRoleBgHnumSelect) {
			background.setAttribute("number-horizontal-steps", parseInt(value));
		}
		if (select == radarRoleBgRnumSelect) {
			background.setAttribute("number-radial-steps", parseInt(value));
		}
		if (select == radarRoleColorStartSelect) {
			background.setAttribute("start-color", value);
		}
		if (select == radarRoleColorEndSelect) {
			background.setAttribute("end-color", value);
		}
		if (select == radarRoleBgHorderSelect) {
			background.setAttribute("order-horizontal-steps", parseInt(value));
		}
		if (select == radarRoleBgRorderSelect) {
			background.setAttribute("order-radial-steps", parseInt(value));
		}
		if (select == radarRoleBgHorderSelect) {
			background.setAttribute("order-horizontal-steps", value);
		}
		if (select == radarRoleBgRorderSelect) {
			background.setAttribute("order-radial-steps", value);
		}

	}

	return true;

}

   self.initRoles=function() {

	
	for ( var i = 0; i < roleSelects.length; i++) {
		var select = roleSelects[i];

		if (select == radarRoleHselect) {
self.initInputput(select,"horizontalAxis")
		}
		if (select == radarRoleRselect) {
self.initInputput(select,"radialAxis");
		}
		if (select == radarRoleLselect) {
self.initInputput(select,"label");
		}
		if (select == radarRoleCselect) {
self.initInputput(select,"color");
		}
		if (select == radarRoleSselect) {
self.initInputput(select,"shape");
		}

		// ************BG*******************
		if (select == radarRoleBgTypeSelect) {
self.initBackgroundund(select,"type");
		}
		if (select == radarRoleBgHnumSelect) {
self.initBackgroundund(select,"number-horizontal-steps");
		}
		if (select == radarRoleBgRnumSelect) {
self.initBackgroundund(select,"number-radial-steps");
		}
		if (select == radarRoleColorStartSelect) {
self.initBackgroundund(select,"start-color");
		}
		if (select == radarRoleColorEndSelect) {
self.initBackgroundund(select,"end-color");
		}
		if (select == radarRoleBgHorderSelect) {
self.initBackgroundund(select,"order-horizontal-steps");
		}
		if (select == radarRoleBgRorderSelect) {
self.initBackgroundund(select,"order-radial-steps");
		}
	

	}
}

   self.initInput=function(input,role){
	fieldName=XML_getFieldForRole(role);
	if(fieldName!=null && fieldName!="")
		$(input).val(fieldName);
}

   self.initBackground=function(input,attr){
	attrVal=background.getAttribute(attr);
	if(attrVal!=null && attrVal!="" )
		$(input).val(attrVal);
}

   self.printXml=function(){
	var s = new XMLSerializer();
	 var str = s.serializeToString(xmlDoc);
	 console.log(str);
}

   self.updateQueryStringParameter=function(uri, key, value) {
	  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	  if (uri.match(re)) {
	    return uri.replace(re, '$1' + key + "=" + value + '$2');
	  }
	  else {
	    return uri + separator + key + "=" + value;
	  }
	}

 return self;
})()