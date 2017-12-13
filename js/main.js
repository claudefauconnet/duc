var main = (function(){
 var self = {};
//moved  var graphLoaded = false;
//moved  var radarLoaded = false;
//moved  var leftIndex = 10;
//moved  var tabs = [];
//moved  var tabsObj = {};
//moved  var currentTab = "";
//moved  var ucRadarLoaded;
//moved  var technoRadarLoaded;


   self.onTabClick=function(tabName) {
	
	var radarTabs=$("#radarTabs").detach();
	$('#tabs ').html("");
	$('#tabs').append(radarTabs);
			
	currentTab = getTab(tabName);
	var divName = "#tabs-" + tabName;
	var xwww = $(divName);
	if (!tabsObj[tabName].loaded) {
self.loadTabContentnt(tabName);
		tabsObj[tabName].loaded = true;
		$(divName).css("visibility", "visible");
	}

	if (tabName == "spreadsheet")
		;

	else if (tabName == "radarController") {
		if(technoRadarLoaded)
			return;
		technoRadarLoaded=true;

		setTimeout(function() {
		//	var radarModelName = "POT";
			//currentRadarType = "POT";
			
			var radarModelName = dbName;
			currentRadarType = dbName;
			currentRadarCollectionName = "technologies";
		
			filterDiv="radarFilters"
			filterDiv_BC="radarFilters-BC";
			$('#left-radar_useCase').detach();
			$("left").html();
			$('#left').append($('#left-radar').detach());
			$('#tabs').append($('#radar0').detach());
radarController.Radar_loadRadardar(radarModelName, currentRadarCollectionName);
			
			
			

		}, 500);

	}
	else if (tabName == "radarUseCases" ) {
		
		if(ucRadarLoaded)
			return;
		ucRadarLoaded=true;
		
		setTimeout(function() {
			currentRadarType = "POTuseCases";
			radarModelName = "POTuseCases";
			currentRadarCollectionName = "use_cases";
		
			filterDiv="radarFilters_UC"
			filterDiv_BC="radarFilters-BC_UC";	
			$('#left-radar').detach();
			$("left").html();
		$('#left').append($('#left-radar_useCase').detach());
			$('#tabs').append($('#radar0_useCase').detach());
radarController.Radar_loadRadardar(radarModelName, currentRadarCollectionName);
		

		}, 500);

	}
	else if (tabName == "radarSpreadsheet") {
spreadsheet.Spreadsheet_loadad('#spreadsheetRadar', dataArray, getSortOrderArray, isVisible);
		$('#tabs').append($('#spreadsheetRadarDiv').detach());

	}
	else if (tabName == "graph") {
		if (graphLoaded == false) {
			setTimeout(function() {
				initGraph();
				loadGraphData();
				drawGraphOrTree();
				scrollToCenter();
				$('#left').append($('#left-graph').detach());
				$('#tabs').append($('#graph').detach());

			}, 500);

		}
		$("#left-graph").css("z-index", leftIndex++);
	} 
	else if (tabName == "graphSpreadsheet") {
		loadGraphSpreadsheetData();

		$('#left').append($('#left-graph').detach());
		$('#tabs').append($('#spreadsheetGraphDiv').detach());

	} 
	else if (tabName == "query") {//
		initQuery();

	}
	else if (tabName == "thesaurusSpreadsheet") {
		showThesaurusSpreadSheet();
	}

	else if (tabName == "useCases") {
useCases.UseCases_loadad(useCasesSpreadsheet);
		$('#left').append($('#left-empty').detach());
		$('#tabs').append($('#useCasesSpreadsheet').detach());
	}

	else if (tabName == "BCs") {
useCases.UseCases_loadad(BCsSpreadsheet)
		$('#left').append($('#left-empty').detach());
		$('#tabs').append($('#useCasesSpreadsheet').detach());

	} else if (tabName == "DCs") {
useCases.UseCases_loadad(DCsSpreadsheet)
		$('#left').append($('#left-empty').detach());
		$('#tabs').append($('#useCasesSpreadsheet').detach());

	}

	else {
		$('#left').append($('#left-empty').detach());
		$('#left').append($('#left-empty').detach());
		$('#tabs').append($('#useCasesSpreadsheet').detach());
	}

}

   self.getTab=function(tabName) {
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i].name == tabName)
			return tabs[i];
	}
	return null;
}

   self.initTabs=function() {
	//
devisuProxy.loadData(dbName, "admin", {
		"type" : "tab"
	}, null);
	tabs.sort(function(a, b) {
		return a.order > b.order ? 1 : -1;
	});

	for (var i = 0; i < tabs.length; i++) {
		var tab = tabs[i];
		tabsObj[tab.name] = tab;
		if (userRole == "admin" || tab.role != "admin") {// ||
			// userRole=="admin")
			// {
			if (!tab.label)
				tab.label = tab.name;
			$("#radarTabs").append('<li> <a href="#tabs-' + tab.name + ' "onclick = "onTabClick(\'' + tab.name + '\');">' + tab.label + '</a></li > ');
			if (i > 0) {
				var divName = "#tabs-" + tab.name;
				$(divName).css("visibility", "hidden");
			}

		}
	}
	$("#tabs").tabs();
	var tabNum = 0;
self.onTabClickk("home")
	$("#tabs").tabs("option", "active", tabNum);

}
   self.initSplitter=function() {
	$(".resizable1").resizable(
			{
				autoHide : true,
				handles : 'e',
				resize : function(e, ui) {
					var parent = ui.element.parent();
					var remainingSpace = parent.width() - ui.element.outerWidth(), divTwo = ui.element.next(), divTwoWidth = (remainingSpace - (divTwo.outerWidth() - divTwo.width())) / parent.width()
							* 100 + "%";
					divTwo.width(divTwoWidth);
				},
				stop : function(e, ui) {
					var parent = ui.element.parent();
					ui.element.css({
						width : ui.element.width() / parent.width() * 100 + "%",
					});
				}
			});
}

   self.loadTabContent=function(tabName) {
	var _url = "htmlFragments/" + tabName + ".html";
	if (tabName.indexOf("-") == 0)// si on va chercher dans d'autres
		// applications sur le serveur, on preffixe
		// /app/
		_url = tabName.replaceAll("-", "/");
	var div = $('<div id="tabs-' + tabName + '"></div>');
	$("#tabs").append(div);
	$.ajax({
		url : _url,
		async : false,
		error : function(jqXHR, textStatus, errorThrown) {
			console.error(errorThrown);
			setMessage("errorThrown", "red");
		},
		complete : function(jqXHR, textStatus) {
			var html = jqXHR.responseText;
			$(div).append(html);

		}

	});
}
 return self;
})()