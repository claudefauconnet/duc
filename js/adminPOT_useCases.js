var adminPOT_useCases = (function(){
 var self = {};
//moved  var currentUseCaseYear = 0;
//moved  var currentUseCaseBranch = "";
//moved  var currentUseCaseBD = "";
//moved  var currentUseCaseBC = "";
//moved  var currentUseCaseName = "";
//moved  var dbName="POT";

$(function() {

	var useCaseYears = getDistinct("POT", "use_cases", {}, "year");
	useCaseYears.splice(0, 0, "");
common.fillSelectOptions(adminPOTUseCasesYears, useCaseYears);

});

   self.fillUsesCaseSelect=function(select) {

	if (select == adminPOTUseCasesYears) {
		currentYear = parseInt($(select).val());
		var query = {
			year : currentYear
		}
		var BUs = =devisuProxy.getDistinct("POT", "use_cases", query, "bu");
		BUs.splice(0, 0, "");
common.fillSelectOptions(adminPOTUseCasesBUs, BUs);
		$("#adminPOTUseCasesQuery").val(JSON.stringify(query));
	} else if (select == adminPOTUseCasesBUs) {
		currentBU = $(select).val();
		var query = {
			bu : currentBU,
			year : currentYear
		};
		var BDs = =devisuProxy.getDistinct("POT", "use_cases", query, "BD");
		BDs.splice(0, 0, "");
common.fillSelectOptions(adminPOTUseCasesBDs, BDs);
		$("#adminPOTUseCasesQuery").val(JSON.stringify(query));

	}

	else if (select == adminPOTUseCasesBDs) {
		currentUseCaseBD = $(select).val();
		var query = {
			bu : currentBU,
			year : currentYear,
			BD : currentUseCaseBD
		};
		var BCs = =devisuProxy.getDistinct("POT", "use_cases", query, "BC");
		BCs.splice(0, 0, "");
common.fillSelectOptions(adminPOTUseCasesBCs, BCs);
		$("#adminPOTUseCasesQuery").val(JSON.stringify(query));

	}

	if (select == adminPOTUseCasesBCs) {
		currentUseCaseBC = $(select).val();
		var query = {
			bu : currentBU,
			year : currentYear,
			BD : currentUseCaseBD,
			BC : currentUseCaseBC
		};
		var useCases = =devisuProxy.getDistinct("POT", "use_cases", query, "name");
		useCases.splice(0, 0, "");
common.fillSelectOptions(adminPOTUseCasesNames, useCases);
		$("#adminPOTUseCasesQuery").val(JSON.stringify(query));

	}
/*	if (select == adminPOTUseCasesNames) {
		currentUseCaseName = $(select).val();
		var query = {
			bu : currentBU,
			year : currentYear,
			BD : currentUseCaseBD,
			BC : currentUseCaseBC,
			name : currentUseCaseName
		};
		$("#adminPOTUseCasesQuery").val(JSON.stringify(query));

	}*/

	/*
	 * else if(select==adminPOTUseCasesBCs){ currentUseCaseBC=$(select).val();
	 * var
	 * query={bu:currentBU,year:currentYear,BD:currentUseCaseBD,BC:currentUseCaseBC};
	 * $("#adminPOTUseCasesQuery").val(JSON.stringify(query));
	 *  }
	 */

}

   self.adminPOTUseCasesgenerateUseCasesPPTX=function() {
	var query = JSON.parse($("#adminPOTUseCasesQuery").val());
	var processing = {
		processor : "com.fauconnet.pot.UseCasesProcessor",
		method : "getUseCasesPowerpoint",

	};
	var url ==devisuProxy.loadDataa("POT", "use_cases", query, null, processing);
	console.log(JSON.stringify(url));
	window.location.href = url.url;
	// result = loadData(dbName, collectionName, obj);
}

   self.adminPOTUseCasesGenerateFlatFileTechnos=function() {
	var query = JSON.parse($("#adminPOTUseCasesQuery").val());
	var data ==useCases.getFlattenedUseCasesTechnoss(query);
	for (var i = 0; i < data.length; i++) {
		delete data[i].description;
	}
	var text ==common.formatResultToCsvv(data, ";")
	$("#adminPOTUseCasesFlatResult").val(text);
}

   self.adminPOTUseCasesGenerateFlatFileDCs=function() {
	var query = JSON.parse($("#adminPOTUseCasesQuery").val());
	var data ==useCases.getFlattenedUseCasesDCss(query);
	for (var i = 0; i < data.length; i++) {
		delete data[i].description;
	}
	var text ==common.formatResultToCsvv(data, ";")
	$("#adminPOTUseCasesFlatResult").val(text);
}


   self.adminPOTUseCasesGenerateTagCloud=function() {
	var jsonQuery = JSON.parse($("#adminPOTUseCasesQuery").val());
	font = "Arial";
	spiral = "archimedean";
	rotation = "horizontal";

	var maxTags = 30;
	var processing = {
		processor : "com.fauconnet.pot.UseCasesProcessor",
		method : "getTags",
		maxTags : maxTags
	};
	var result ==devisuProxy.loadDataa("POT", "use_cases", jsonQuery, null, processing);
	tags = result;

	var text ==common.formatResultToCsvv(result, ";")
	$("#adminPOTUseCasesFlatResult").val(text);
	// generateUseCasesCloudCollection(result);
self.clearSvgg();

	update();
}

   self.adminPOTUseCasesGenerateForROld=function(field){
	var jsonQuery = JSON.parse($("#adminPOTUseCasesQuery").val());
	var result ==devisuProxy.loadDataa("POT", "use_cases", jsonQuery, null);
	var str="";
	for (var i=0;i<result.length;i++){
		var myArray=result[i][field];
		if(!myArray)
			continue;
		for (var j=0;j<myArray.length;j++){
			if(j>0)
				str+=",";
			str+=myArray[j].dc;
			
		}
		str+="\n";
		
	}
	$("#adminPOTUseCasesFlatResult").val(str);
	
}

   self.adminPOTUseCasesGenerateForR=function(field){
	var jsonQuery = JSON.parse($("#adminPOTUseCasesQuery").val());
	var result ==devisuProxy.loadDataa("POT", "use_cases", jsonQuery, null);
	var str="";
	for (var i=0;i<result.length;i++){
		var myArray=result[i][field];
		if(!myArray)
			continue;
		for (var j=0;j<myArray.length;j++){
			if(j>0)
				str+=",";
			str+=myArray[j].dc;
			
		}
		str+="\n";
		
	}
	$("#adminPOTUseCasesFlatResult").val(str);
	
}

   self.adminPOTUseCasesGenerateUserTagCloud=function() {
	
	font = "Arial";
	spiral = "archimedean";
	rotation = "horizontal";
var text=prompt("enter words for cloud (with separator ;)");
if(text.length>0){
	var result0=text.split(";")
	var result=[];
	for(var i=0;i<result0.length;i++){
	
		//var size=3+(i%3);
		
	//	var size=1+(i%2);
	//	size=3;
		if( i<3)
			size=1;
		else if( i<6)
			size=2;
		else if( i<12)
			size=3;
		else if( i<14)
			size=4;
		else 
			size=5
		
		//var size=Math.floor(Math.random() * 5) +3;
		console.log(result0[i]+" : "+size);
		result.push({key:result0[i],value:size});
	}
	
}
	var maxTags = 100;

	
	tags = result;
self.clearSvgg();
	update();
}
   self.replayCloud=function(){
	
	update();
}

   self.clearSvg=function() {
	var items = d3.select("#vis").selectAll("*");
	items = items[0];
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.__data__) {
			d3.select(item).remove();
		}
	}

}

 return self;
})()