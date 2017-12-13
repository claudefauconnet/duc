var spreadsheet = (function(){
 var self = {};
drawSpreadSheet//var headers = [];
//var data = [];
//moved  var graphData;
   self.Spreadsheet_load=function(spreadsheet, data, sortColumnFunction, filterFunction) {
	var data = formatDataForSpreadSheet(data, sortColumnFunction, filterFunction);
	var headers = data[0];
	data.splice(0, 1);
self.drawSpreadSheet(spreadsheet, headers, data);

}

   self.drawSpreadSheet=function(spreadsheet, headers, data) {
	
	$(spreadsheet).handsontable({
		data : data,
		minCols : 30,
		minRows : 100,
		minSpareRows : 1,
		colHeaders : headers,
		rowHeaders : true,
		contextMenu : true,
		// columns:[{},{},{type:'autocomplete',source:getNatures(), strict:
		// true}],
		// fixedColumnsLeft: 1,
		columnSorting : true,
		stretchH : 'all',
		search : true,
		contextMenu : true
	});

}

   self.Spreadsheet_Import=function() {

	var data = [ [ "paste", "here" ], [ "your", "data" ] ];
	$('#spreadsheetImport').handsontable({
		afterChange : function(changes, source) {
			var source;
			var changes;
		},
		// data : data,
		minCols : 30,
		minRows : 100,
		minSpareRows : 1,
		colHeaders : true,
		contextMenu : true,
		rowHeaders : true,
		colHeaders : true,
		stretchH : 'all',
		columnSorting : true,
		contextMenu : true
	});

}

   self.formatDataForSpreadSheet=function(rawData, sortColumnFunction, filterFunction) {
	var dataSpeadSheet = [];
	var titles = [];

	for ( var i = 0; i < rawData.length; i++) {
		if (i == 0) {
			for ( var key in rawData[0]) {
				if (radarXmls[currentRadarType].nonVisibleFields.indexOf(key) < 0)
					titles.push(key);
			}
			if (sortColumnFunction) {
				var sortOrder = sortColumnFunction();
				titles.sort(function(a, b) {
					var p = $.inArray(a, sortOrder);
					var q = $.inArray(b, sortOrder);
					if (p == -1)
						p = 100;
					if (q == -1)
						q = 100;
					return p - q;
				});
			}

			dataSpeadSheet.push(titles);
		}
		if (!filterFunction || filterFunction(rawData[i])) {
			var line = [];
			for ( var j = 0; j < titles.length; j++) {
				line.push(rawData[i][titles[j]]);
			}
			dataSpeadSheet.push(line);

		}
	}
	return dataSpeadSheet;

}

   self.Spreadsheet_save=function(aSpreadsheet,collectionName) {
	if(!collectionName)
	 collectionName=prompt("enter collection name", "");
	var exportData =self.Spreadsheet_getSpreadSheetData(aSpreadsheet);
	for ( var i = 0; i < exportData.length; i++) {
		var notNullline = false;
		for ( var prop in exportData[i]) {
			if (exportData[i][prop] != null && exportData[i][prop] != "")
				notNullline = notNullline | true;

common.cleanTextForJsonImport = cleanTextForJsonImport(exportData[i][prop]);
			exportData[i].modifiedBy=userLogin;
		}
		if (notNullline == false)
			exportData.length = i;

	}
devisuProxy.saveDataa(dbName, collectionName, exportData);

}






   self.getSpreadSheetHeaders=function(spredSheetDivId) {
	var data = $(spredSheetDivId).handsontable("getColHeader");
	for ( var i = 0; i < data.length; i++) {// tronquer aux colonnes utiles

	}
	return data;
}

   self.addEmptyRows=function(spredSheetDivId, number) {
	var ht = $(spredSheetDivId).handsontable('getInstance');
	ht.alter('insert_row', null, number);

}
   self.Spreadsheet_getSpreadSheetData=function(spredSheetDivId) {
	var handsontable = $(spredSheetDivId).data('handsontable');
	var data = handsontable.getData();
	return data;
}

   self.adjustColumns=function(headers) {
	// suppression des colonnes inutiles (A ...AZ..)
	for ( var i = 0; i < headers.length; i++) {
		if (headers[i] == null)
			return headers;

		if (headers[i].length == 2) {
			var n = headers[i].charCodeAt(0);
			var p = headers[i].charCodeAt(1);
			if (n > 64 && n < 91 && p > 64 && p < 91) {
				headers.length = i;
				return headers;
			}
		}
		if (headers[i].length == 1) {
			var n = headers[i].charCodeAt(0);
			if (n > 64 && n < 91) {
				headers.length = i;
				return headers;
			}
		}

	}
	return headers;
}

   self.createBigData=function() {
	var rows = [], i, j;

	for (i = 0; i < 1000; i++) {
		var row = [];
		for (j = 0; j < 6; j++) {
			row.push(Handsontable.helper.spreadsheetColumnLabel(j) + (i + 1));
		}
		rows.push(row);
	}

	return rows;
}

   self.Spreadsheet_Init=function(spreadsheet) {

	var data = [ [ "", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi" ], [ "2009", 0, 2941, 4303, 354, 5814 ], [ "2010", 5, 2905, 2867, 412, 5284 ],
			[ "2011", 4, 2517, 4822, 552, 6127 ], [ "2012", 2, 2422, 5399, 776, 4151 ] ];

	var sheet = $(spreadsheet).handsontable({

		// data: data,
		// colWidths: [55, 80, 80, 80, 80, 80, 80], //can also be a number or a
		// function
		rowHeaders : true,
		colHeaders : true,
		minRows : 200,
		// fixedColumnsLeft: 2,
		// fixedRowsTop: 2,
		minSpareRows : 1,
		stretchH : 'all',
		columnSorting : true,
		contextMenu : true
	});

}

   self.Spreadsheet_GetHeader=function(jsonArray) {
	var headers=[];

	for ( var i = 0; i < jsonArray.length; i++) {
		for ( var prop in jsonArray[i]) {
			headers.push(prop);
		}
	return headers;
	}
}

 return self;
})()