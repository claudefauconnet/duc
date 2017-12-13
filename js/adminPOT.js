var adminPOT = (function(){
 var self = {};
//moved  var currentYear=0;
//moved  var currentBU="";


$(function() {
	var years=getDistinct("POT", "technologies", {}, "year");
	years.splice(0,0,"");
common.fillSelectOptions(adminPOTduplicateRadarYears, years);
	

	
});


   self.fillSelect=function(select){
	
	if( select==adminPOTduplicateRadarYears){
		currentYear=parseInt($(select).val());
		var query={year:currentYear}
		var BUs=devisuProxy.getDistinct("POT", "technologies", query, "bu");
		BUs.splice(0,0,"");
common.fillSelectOptions(adminPOTduplicateRadarBUs, BUs);
	}
	else if(select==adminPOTduplicateRadarBUs){
		currentBU=$(select).val();
		var query={bu:currentBU,year:currentYear};
		var versions=devisuProxy.getDistinct("POT", "technologies", query, "version");
		versions.splice(0,0,"");
common.fillSelectOptions(adminPOTduplicateRadarVersions, versions);
		
	}
	
}


   self.adminPOTduplicateRadar=function(){
	var oldYear=$("#adminPOTduplicateRadarYears").val();
	var oldBU=$("#adminPOTduplicateRadarBUs").val();
	var oldVersion=$("#adminPOTduplicateRadarVersions").val();
	
	var newYear=$("#adminPOTduplicateRadarNewYear").val();
	var newBU=$("#adminPOTduplicateRadarNewBU").val();
	var newVersion=$("#adminPOTduplicateRadarNewVersion").val();
	
	if(newYear=="" ){
		$("#adminPOTduplicateRadarMessage").html("new year is mandatory");
		return;
	}
	if(newBU=="" ){
		$("#adminPOTduplicateRadarMessage").html("new BU is mandatory");
		return;
	}
	if(newVersion=="" ){
		$("#adminPOTduplicateRadarMessage").html("new version is mandatory");
		return;
	}
	if(newVersion=="" ){
		$("#adminPOTduplicateRadarMessage").html("new version is mandatory");
		return;
	}
	
	oldYear=parseInt(oldYear);
	newYear=parseInt(newYear);
	
	var jsonQuery={year:oldYear,version:oldVersion,bu:oldBU};
	var oldData=devisuProxy.loadData("POT", "technologies", jsonQuery) ;
	for( var i=0;i<oldData.length;i++){
		var item=oldData[i];
		item.year=newYear;
		item.bu=newBU;
		item.version=newVersion;
		delete item.id;
devisuProxy.addItem("POT", "technologies", item);
		
		
		
	}
	$("#adminPOTduplicateRadarMessage").html(oldData.length+ "items added");
	
	
	
}

   self.adminPOTdeleteRadar=function(){
	if(!confirm("Do you really want to delete this radar  ?"))
		return;
	var oldYear=$("#adminPOTduplicateRadarYears").val();
	oldYear=parseInt(oldYear);
	var oldBU=$("#adminPOTduplicateRadarBUs").val();
	var oldVersion=$("#adminPOTduplicateRadarVersions").val();
	var jsonQuery={year:oldYear,version:oldVersion,bu:oldBU};
	var oldData=devisuProxy.loadDataa("POT", "technologies", jsonQuery) ;
	for( var i=0;i<oldData.length;i++){
devisuProxy.deleteItem("POT", "technologies", oldData[i].id);
	}
	$("#adminPOTduplicateRadarMessage").html(oldData.length+ "items deleted");
}


   self.adminPOTgenerateUseCasesRadar=function(){
	var useCasesYear=$("#adminPOTuseCasesYears").val();
	useCasesYear=parseInt(useCasesYear);
	var useCasesBranch=$("#adminPOTuseCasesBranches").val();
	var useCasesBD=$("#adminPOTuseCasesBDs").val();
	if(useCasesYear=="" ){
		$("#adminPOTduplicateRadarMessage").html("Year is mandatory");
		return;
	}
	if(useCasesBranch=="" ){
		$("#adminPOTduplicateRadarMessage").html("Branch is mandatory");
		return;
	}
	
	var jsonQuery={year:useCasesYear,branch:useCasesBranch};

	
	if(!useCasesBD=="all"){
		jsonQuery.BD=useCasesBD;
	}
	
	var useCasesData=devisuProxy.loadDataa("POT", "use_cases", jsonQuery) ;
	for( var i=0;i<useCasesData.length;i++){
		var useCase=useCasesData[i];
		var item={};
		item.type="use case"
		item.year=useCase.year;
		item.name=useCase.name;
		item.branch=useCase.branch;
		item.BD=useCase.BD;
		item.BC=useCase.BC;
		item.emergency=useCase.emergency;
		item.impact=useCase.impact;
		item.value=useCase.value;
		delete item.id;
devisuProxy.addItem("POT", "technologies", item);
	}
	$("#adminPOTduplicateRadarMessage").html(useCasesData.length+ "rarar items created");
	
	
}
 return self;
})()