var adminMongo = (function(){
 var self = {};
//moved  var dbName;
//moved  var storedQueries;
//moved  var currentFlattenedData=[];
//moved  var fieldNames=[];
// messageDivId=document.getElementById("message");

$(function() {
	initDBs();
	//storedQueries= new StoredQueries(qHistory,jsonStr,jsonStr);
	

});

   self.createDB=function() {
	dbName = $("#dbName").val();
	if (!dbName || !dbName.length > 0) {
		setMessage("enter dbName", "red");
	}
devisuProxy.createDBB(dbName);

}

   self.createNodeNature=function() {
	var dbName = $("#dbName").val();
	if (!dbName || !dbName.length > 0) {
		setMessage("enter dbName", "red");
	}
	if (!nodeNatureName || !nodeNatureName.length > 0) {
		setMessage("enter nodeNatureName", "red");
	}

	if (!nodeNatureColor || !nodeNatureColor.length > 0) {
		setMessage("enter nodeNatureColor", "red");
	}

	var obj = {
		type : "nodeNature",
		name : $(nodeNatureName).val(),
		color : $(nodeNatureColor).val()
	};

devisuProxy.addItem(dbName, "admin", obj);
}

   self.executeAction=function(action) {
	var fieldsStr=$("#fields").val();
	fieldsStr="{"+fieldsStr+"}";
	var fieldsObj=JSON.parse(fieldsStr);
	
	
	$("#stateDisplay").html("");
	dbName = $("#dbName").val();
	if (!dbName || !dbName.length > 0) {
		setMessage("enter dbName", "red");
	}
	var jsonStr = $("#jsonStr").val();
	if (!jsonStr || !jsonStr.length > 0) {
		setMessage("enter json", "red");
	}
self.addQueryy(jsonStr);
	var collectionName = $("#collectionName").val();
	if (!collectionName || !collectionName.length > 0) {
		setMessage("enter collectionName", "red");
	}
	try {
		var obj0;
		if (jsonStr == null || jsonStr == "") {
			obj0 = [ {} ];
		} else {
			obj0 = JSON.parse(jsonStr);
			if (obj0 == null)
				obj0 = [ {} ];
		}
		if (!$.isArray(obj0)) {
			obj0 = [ obj0 ];
		}

		var result = "";
		for (var i = 0; i < obj0.length; i++) {
			obj = obj0[i];
			if (action == "add")
devisuProxy.addItem(dbName, collectionName, obj);
			else if (action == "update")
devisuProxy.updateItem(dbName, collectionName, obj);
			else if (action == "delete")
devisuProxy.deleteItemxy_deleteItem(dbName, collectionName, obj.id);
			else if (action == "get"){
if(!self.isEmpty(fieldsObj))
devisuProxy.loadDataFieldsloadDataFields(dbName, collectionName, obj,fieldsObj);
				else
devisuProxy.loadDataroxy_loadData(dbName, collectionName, obj);
				
			}
			else if (action == "exportCSV") {
                if(!self.isEmpty(fieldsObj))
devisuProxy.loadDataFieldsloadDataFields(dbName, collectionName, obj,fieldsObj);
				else
devisuProxy.loadDataroxy_loadData(dbName, collectionName, obj);
				var sep="\t";
				if($("#csvSep")){
					sep=$("#csvSep").val();
				}
				var body = common.formatResultToCsv(result,sep );
				$("#resultTextArea").val(body);
				$("#mongoTabs").tabs({active: 1});
				return;
			} else if (action == "exportJson") {
if(!self.isEmpty(fieldsObj))
devisuProxy.loadDataFieldsloadDataFields(dbName, collectionName, obj,fieldsObj);
				else
devisuProxy.loadDataroxy_loadData(dbName, collectionName, obj);
				$("#resultTextArea").val(JSON.stringify(result));
				$("#mongoTabs").tabs({active: 1});
				return;
			}
			else if (action == "importJson") {
				//importResultJson(dbName, collectionName, obj);
				alert ("to implement...");
				return;
			}

		}
		if ($.isArray(result)) {
		//	$("#resultTextArea").val(JSON.stringify(result));
		
self.processResultult(result);
		
		} else {
			setMessage(result, "green");
		}
	} catch (e) {
		setMessage(e, "red");
	}

}

   self.addQuery=function(q) {

	if ($.inArray(q, $("#qHistory").val()) < 0) {
		var val = qHistory.options.length + 1;
		$("#qHistory").append($('<option/>', {
			value : val,
			text : q,
		}));
		$("#qHistory").sort(function(a, b) {
			a = a.value;
			b = b.value;

			return b - a;
		});
	}
}

   self.selectQuery=function() {
	$("#jsonStr").val($(qHistory).text());
}

   self.saveQueries=function() {
	dbName = $("#dbName").val();
	var q = $("#qHistory").text();
	var obj = JSON.parse('{"type":"query"}",{"value":' + q + '}');
devisuProxy.addItem(dbName, "admin", obj);
}

   self.loadQueries=function() {
	dbName = $("#dbName").val();
	var queries =devisuProxy.loadDataa(dbName, 'admin', {
		type : "query"
	});
	for (var i = 0; i < queries.length; i++) {
		$("#qHistory").append($('<option/>', {
			value : queries[i].name,
			text : queries[i].name
		}));
	}

}

   self.initDBs=function() {
	var dbs =devisuProxy.getDBNames("admin", 'admin', {});
	for (var i = 0; i < dbs.length; i++) {
		var str = dbs[i].name;
		$("#dbSelect").append($('<option/>', {
			value : str,
			text : str
		}));
	}
}



   self.initCollections=function() {
	var dbName = $("#dbName").val();
	var dbs =devisuProxy.getCollectionNames(dbName, 'admin', {});
	for (var i = 0; i < dbs.length; i++) {
		var str = dbs[i].name;
		$("#collSelect").append($('<option/>', {
			value : str,
			text : str
		}));
	}
}

   self.processResult=function(jsonArray) {
	currentFlattenedData=[];
	var fields=[];
	var data=[];
	for (var i = 0; i < jsonArray.length; i++) {
		for(var key in jsonArray[i]){
			if(fields.indexOf(key)<0)
				fields.push({title:key});
		}
		
	}
	 fieldNames=[]
	for(var i=0;i< fields.length;i++){
		fieldNames.push(fields[i].title);
	}
	currentFlattenedData.push(fieldNames);

		for (var j = 0; j < jsonArray.length; j++) {
			var line=[]
			for(var i=0;i< fields.length;i++){
		 var cell=jsonArray[j][fields[i].title];
		 if(!cell)
			 cell="";
		 line.push(cell);
		
			}
			 currentFlattenedData.push(line);
			data.push(line);
			
	}
	
	if ($.fn.dataTable.isDataTable('#resultTable')) {

		$('#resultTable').DataTable().destroy();
	}

	
	$('#resultTable')
			.DataTable(
					{
						 //destroy: true,
						"bDestroy": true,
						data : data,
						columnDefs : [ {
							"className" : "dt-center",
						
							"sClass": "alertDTcol0", "aTargets": [ 0 ]
						
						} ],
						columns : fields,
						
					});
	
	var table=$('#table_Alerts').DataTable();
	fieldNames.splice(0,0,"");
common.fillSelectOptionsWithStringArrayy(fieldNamesSelect, fieldNames) ;
		
		
}

   self.exportCSV=function() {
	var str = "";
	var csvSep=$("#csvSep").val();
	for (var i = 0; i < currentFlattenedData.length; i++) {
		var line = currentFlattenedData[i];
		for (var j = 0; j < line.length; j++) {
			str += line[j] + csvSep;
		}
		str += "\n";

	}

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,'
			+ encodeURIComponent(str));
	element.setAttribute('download', "exportToutLesens");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);

}


   self.fillFieldsInput=function(select){
	var str=$("#fields").val();
	var value=$(select).val();
	
	if(str.length>0)
		str+=",";
	str+='"'+value+'":1';
	$("#fields").val(str);
	
}


   self.executeScript=function() {
	var str = $("#jsonStr").val();
	var script = document.createElement("script");
	script.appendChild(document.createTextNode(str));
	(document.body || document.head || document.documentElement).appendChild(script);

}

   self.replaceLatinChars=function() {
	db.feeds2.find({
		hashcode : -996749175
	}).forEach(function(doc) {
		var title = doc.title;
		console.log(title);

	});
}


   self.isEmpty=function(obj) {
    return Object.keys(obj).length === 0;
}

 return self;
})()