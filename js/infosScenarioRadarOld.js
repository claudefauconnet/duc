var infosScenarioRadar = (function(){
 var self = {};

//moved  var queryParams = getQueryParams(document.location.search);
//moved  var dbName = queryParams.dbName;
//moved  var currentObjectId = parseInt(queryParams.objectId);
//moved  var currentScenario = {};

$(function() {
    var queryParams = common.getQueryParams(document.location.search);
	if (!queryParams.dbName)
	    dbName = "POT"+Gparams.CURRENT_YEAR;
	dbName = queryParams.dbName;
if(currentObjectId)
	execute(currentObjectId);


});

   self.execute=function(objId) {
	   var  queryParams = common.getQueryParams(document.location.search);
	   if (!queryParams.dbName)
		    dbName = "POT"+Gparams.CURRENT_YEAR;
		dbName = queryParams.dbName;
   	if(!objId)
   		return;
	currentObjectId=objId;
	$("#idSpan").html(objId)
self.fillAccordion(objId);

}

   // id,name,businessValue,easeOfImpl,maturity,category,x,y,global,Costlevel,OrgSkills,excluded,horizon,marketSkills,numbOfBD,numbOfBU,numbOfUC,year,nUC
    self.scenarioDesc = {
      /*  name: {
            "value": "",
            type: "text",
            cols: 50,
            rows: 2

        },*/

        description: {
            "value": "",
            type: "text",
            cols: 50,
            rows: 5
        }
    }

    self.scenarioAttrs = {

        businessValue: {
            "value": "",
            type: "select",
            list: "priority"
        },
        easeOfImpl: {
            "value": "",
            type: "select",
            list: "priority"
        },
        maturity: {
            "value": "",
            type: "select",
            list: "priority"
        },

        category: {
            "value": "",
            type: "select",
            list: "level",
        },

        global: {
            "value": "",
            type: "select",
            list: "boolean"
        },
        Costlevel: {
            "value": "",
            type: "select",
            list: "costLevel"
        },

        OrgSkills: {
            "value": "",
            type: "select",
            list: "OrgSkills"
        },

        horizon: {
            "value": "",
            type: "select",
            list: "boolean"
        },




    };



   self.fillAccordion=function() {
	var SCdata = devisuProxy.loadData(dbName, "scenarios", {
		id : currentObjectId
	});

	if (SCdata.length > 0)
		currentScenario = SCdata[0];

	/*var UCData = loadData(dbName, "use_cases", {
		scenario_id : currentObjectId
	});*/

	
	
	var scenarioUseCases = devisuProxy.loadData(dbName, "r_UC_SC", {
		SC_id: currentScenario.id
	});
	
	var scenarioBBs = devisuProxy.loadData(dbName, "r_SC_BB", {
		SC_id: currentScenario.id
	});
	

	$("#nameSpan").html(currentScenario.name);
	$("#descriptionSpan").html(currentScenario.description);

       infosGeneric.setAttributesValue("scenarios",currentScenario,self.scenarioDesc);
       infosGeneric.drawAttributes(self.scenarioDesc,"descSpan");


       infosGeneric.setAttributesValue("scenarios",currentScenario,self.scenarioAttrs);
       infosGeneric.drawAttributes(self.scenarioAttrs,"attrsSpan");

	var str = "";
	for (var i = 0; i < scenarioUseCases.length; i++) {
		str += "<b>"+scenarioUseCases[i].UC_name+";</b>";//<br><font >-["+ UCData[i].bu+"/"+ UCData[i].BD+"/"+ UCData[i].BC+ "]</font>" + ";";
	}
	$("#UCsSpan").html(
			"<ul><li>" + str.replace(/;/g, '</li><li>') + "</li></ul>");

       var str = "";
       for (var i = 0; i < scenarioBBs.length; i++) {
           str += "<b>"+scenarioBBs[i].BB_name+";</b>";//<br><font >-["+ UCData[i].bu+"/"+ UCData[i].BD+"/"+ UCData[i].BC+ "]</font>" + ";";
       }
       $("#bbsSpan").html(
           "<ul><li>" + str.replace(/;/g, '</li><li>') + "</li></ul>");
	
	/*
	$("#bbsSpan").html(
			"<ul><li>" + str.replace(/;/g, '</li><li>') + "</li></ul>");

*/
	/*var str = "";
	for (var i = 0; i < ucDCs.length; i++) {
		str += ucDCs[i] + ";";
	}
	$("#DCsSpan").html(
			"<ul><li>" + str.replace(/;/g, '</li><li>') + "</li></ul>");

	var str = "";
	for (var i = 0; i < ucTechnos.length; i++) {
		str += ucTechnos[i] + ";";
	}
	$("#technosSpan").html(
			"<ul><li>" + str.replace(/;/g, '</li><li>') + "</li></ul>");*/

	$("#accordion").accordion();

}

 return self;
})()

