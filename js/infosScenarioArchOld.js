var infosScenarioArch = (function(){
 var self = {};

// depends on infosGeneric.js

//moved  var queryParams = getQueryParams(document.location.search);
//moved  var dbName = queryParams.dbName;
//moved  var currentScenario = {};
//moved  var bbIds = [];
//moved  var currentbbId;
//moved  var modified=false;
//moved  var scenariosData ;
$(function() {
	// $("#attrsTabMessage", window.parent.document).html("");
	  var  queryParams = common.getQueryParams(document.location.search);
	if (!queryParams.dbName)
	    dbName = "POT"+Gparams.CURRENT_YEAR;
	dbName = queryParams.dbName;
self.setScenariosSelect();

});

   self.setScenariosSelect=function() {

    if (typeof scenarioSelect == 'undefined')
    	return;
	var useCasesTechnos = {};
       scenariosData= devisuProxy.loadData(dbName, "scenarios", {});

	scenariosData.sort(function(a, b) {
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	});
	scenariosData.splice(0, 0, "");

common.fillSelectOptions(scenarioSelect, scenariosData, "name", "id");
	
	 var scenarioCatsData=[]
	 for(var i=0;i<scenariosData.length;i++){
		 if(scenarioCatsData.indexOf(scenariosData[i].category)<0){
			 scenarioCatsData.push(scenariosData[i].category);
		 }
	 }
common.fillSelectOptionsWithStringArray(scenarioCatSelect,scenarioCatsData );
	

}

   self.loadScenario=function() {
	if(currentScenario && modified){
		if(confirm("Do you want to save current scenario before changing")){
self.saveScenarioBuildingBlocks();
		}
		modified=false;
	}
		
	$("#buidingBlocksSpan").html("");
	var SC_id = parseInt($("#scenarioSelect").val());
	
self.loadScenarioBuildingBlocks(SC_id);
}

   self.loadScenarioCat=function(){
	var cat=$("#scenarioCatSelect").val();
	for(var i=0;i<scenariosData.length;i++){
		if(scenariosData[i].category==cat){
self.loadScenarioBuildingBlocks(scenariosData[i].id)
		}
	}
}

   self.loadScenarioBuildingBlocks=function(scenarioId) {
 currentScenario= devisuProxy.loadData (dbName, "scenarios", {
		id : scenarioId
	});
	window.parent.currentObjectId=currentScenario.id;
	window.parent.srcIsLoaded=true;
	window.parent.d3radar.setRadarLabel(currentScenario.name,"axisX");
	var bbs=devisuProxy.loadData(dbName, "r_SC_BB", {
		SC_id:scenarioId
		
	});
	
	if (!bbs)
		bbs = [];
	else
		bbs.sort(function(a,b){
		return a.BB_name>b.BB_name;
	});
	bbIds = [];
	for (var i = 0; i < bbs.length; i++) {
self.addBuildingBlockToPage(bbs[i].BB_id);
		bbIds.push(bbs[i].BB_id);
	}

self.highlightBuidingBlocksOnArchMap(bbIds);
	
}

   self.loadScenarioBuildingBlocksOld=function(scenarioId) {
devisuProxy.loadData = loadData(dbName, "scenarios", {
		id : scenarioId
	})[0];
	window.parent.currentObjectId=currentScenario.id;
	window.parent.srcIsLoaded=true;
	window.parent.setRadarLabel(currentScenario.name,"axisX");
	var bbs = currentScenario.buildingBlocks;
	if (!bbs)
		bbs = [];
	bbIds = [];
	for (var i = 0; i < bbs.length; i++) {
self.addBuildingBlockToPage(bbs[i].id);
		bbIds.push(bbs[i].id);
	}

self.highlightBuidingBlocksOnArchMap(bbIds);

}

   self.highlightBuidingBlocksOnArchMap=function(bbs) {
	window.parent.d3radar.forcePointColor(bbs, "blue");

}


self.execute=function(objId) {
   	if(!objId)
   		return;
	currentObjectId = objId;
	var scenario = $("#scenarioSelect").val();
	if (scenario == "") {
		return;
		// alert("choose a scenario first");
	} else {
		modified=true;
		bbIds.push(objId);
self.addBuildingBlockToPage(objId,true);

	}
}


   self.addBuildingBlockToPage=function(BB_id, isNewFromMap) {

	var bbs =devisuProxy.loadData(dbName, "buildingBlocks", {
		id : BB_id
	});
	if (bbs.length > 0) {
self.drawBuildingBlockBox(bbs[0]);
		if (!currentScenario.buildingBlocks) {
			currentScenario.buildingBlocks = [];

		}
		if(isNewFromMap)
			currentScenario.buildingBlocks.push({id:BB_id,comment:"",name:bbs[0].name});
		currentbbId = BB_id;
		window.parent.d3radar.forcePointColor(bbIds, "blue");
	}
}

   self.drawBuildingBlockBox=function(bbObj) {
	var checked = "checked='checked'";
	var CbxText = "<input class='cbx-bb' onchange='onBbCbxChange(this)' type='checkBox' "
			+ checked + "label='" + bbObj.name + "' id='" + bbObj.id + "'>";
	var bbCcommentButton = "<button onclick='getbbComment(" + bbObj.id
			+ ")'>Comment...</div>";
	
	var bbCcommentButton ="<img onclick='getbbComment(" + bbObj.id+ ")' src='images/info.jpg' width='15px'>"
	
	var text = "<li>" + CbxText + "<font color='blue'>" + bbObj.name
			+ "</font> " + bbCcommentButton + "</li>";
	$("#buidingBlocksSpan").append(text);
}

   self.onBbCbxChange=function(cbx) {
	var bbId = parseInt(cbx.id);
	if ($(cbx).prop("checked")) {
		bbIds.push(bbId);
	} else {
		bbIds.splice(bbIds.indexOf(bbId), 1);
	}
	window.parent.forcePointColor(bbIds, "blue");
}

   self.saveScenarioBuildingBlocks=function() {
	
	var cbxs = $(".cbx-bb");
	var newBbs = [];
	for (var i = 0; i < cbxs.length; i++) {
		if (cbxs[i].checked) {// ajout des technos à chaque dc
			var BB_id = parseInt(cbxs[i].id);
			var BB_name = cbxs[i].label;
			for (var j= 0; j < currentScenario.buildingBlocks.length; j++) {
				var bb = currentScenario.buildingBlocks[j];
				if (bb.id == BB_id) {
					newBbs.push(bb);
				}
			}

		}
	}
devisuProxy.deleteItemByQuery(dbName, "r_SC_BB", {SC_id:currentScenario.id},true);
	for(var i=0;i<newBbs.length;i++){
devisuProxy.addItem(dbName,"r_SC_BB",newBbs[i],true);
	}
	currentScenario.buildingBlocks = newBbs;
devisuProxy.updateItem(dbName, "scenarios", currentScenario);
	//generateSVG();
	modified=false;

}

   self.showAllbuidingBlocks=function() {

	window.parent.resetAllPointsOpacity(1);
}

   self.addBuidlingBlock=function() {
	var bbName = prompt("Enter new building block name");
	if (bbName && bbName.length > 0) {
devisuProxy.addItem(dbName, "technologies", {
			name : bbName
		});
		window.parent.reloadRadar();
	}

}

   self.getbbComment=function(bbId) {

	
	currentbbId = bbId;
	var comment = "";
	for (var i = 0; i < currentScenario.buildingBlocks.length; i++) {
		var bb = currentScenario.buildingBlocks[i];
		if (bb.id == bbId) {
			comment = currentScenario.buildingBlocks[i].comment;
			if (!comment)
				comment = "";
		}
	}
	$("#bbComment").val(comment);

}



   self.setbbComment=function() {
	modified=true;
	var comment = $("#bbComment").val();
	if (currentScenario && !currentScenario.buildingBlocks) {
		currentScenario.buildingBlocks = [];
	}
	if (comment && currentScenario && currentbbId) {
	
		for (var i = 0; i < currentScenario.buildingBlocks.length; i++) {
			var bb = currentScenario.buildingBlocks[i];
			if (bb.id == currentbbId) {
				currentScenario.buildingBlocks[i].comment = comment;
			}
		}
	}

}

function generateSVG(){
	var svg=window.parent.d3radar.getSVG();
	if(!currentScenario){
		alert("select object first");
		return;
	}
	
	var jsonFields={svg:svg};
devisuProxy.updateItemFields(dbName, "scenarios", {id:currentScenario.id}, jsonFields)
	

}

 return self;
})()

