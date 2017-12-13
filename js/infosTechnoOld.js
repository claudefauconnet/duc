var infosTechno = (function(){
 var self = {};
//moved  var queryParams = getQueryParams(document.location.search);
//moved  var dbName = queryParams.dbName;
//moved  var currentObjectId = parseInt(queryParams.objectId);
var maturities = [ "", "emerging", "adolescent", "first rollout", "main stream" ];
var marketSkills = [ "", "initial", "low", "medium", "high" ];
var TotalSkills = [ "", "initial", "low", "medium", "high" ];

$(function() {
	if (currentObjectId)
		self.execute(currentObjectId)
});

self.execute=function(objId) {
	if(!objId)
		return;
	currentObjectId=objId;
	fillAccordion(objId);
}

function fillAccordion() {
	$("#idSpan").html(currentObjectId)
	var technoData =devisuProxy.loadData(dbName, "technologies", {
		id : currentObjectId
	});

	var dcsData =devisuProxy.loadData(dbName, "r_T_DC", {
		techno_id : currentObjectId
	});

	var linkedTechnosData =devisuProxy.loadData(dbName, "linkedTechnos", {
		techno_id : currentObjectId
	});
	
	var linkedTechnosData =devisuProxy.loadData(dbName, "linkedTechnos", {
		techno_id : currentObjectId
	});

	var technoDoc = technoData[0];
	if (dcsData)
		technoDoc.dcs = dcsData;
	if (linkedTechnosData)
		technoDoc.linkedTechnos = linkedTechnosData;

	var technoDoc2 = processTexts(technoDoc);

self.drawFieldInputs(technoDoc);

	var str = "";
	$("#attrsSpan").html(technoDoc2.span);
	$("#nameSpan").html(technoDoc2.name);
	$("#descriptionSpan").html(technoDoc2.description);
	$("#imgSpan").html(technoDoc.img);

	$("#categorySpan").html(technoDoc.category);
	$("#digitalPolaritySpan").html(technoDoc.digitalPolarity);
	$("#technologyMaturitySpan").html(technoDoc.maturity);
	$("#marketSkillsSpan").html(technoDoc.marketSkills);
	$("#TotalSkillsSpan").html(technoDoc.TotalSkills);

	// $("#attrsArraySpan").html(technoDoc2.attrsArray);
	$("#DCsSpan").html(technoDoc2.dcs);
	$("#stronglyLinkedTechsSpan").html(technoDoc2.stronglyLinkedTechs);
	$("#weaklyLinkedTechsSpan").html(technoDoc2.weaklyLinkedTechs);

	$("#examplesSpan").html(technoDoc2.examples);
	$("#resourcesSpan").html(technoDoc2.docs);
	$("#advantagesSpan").html(technoDoc2.advantages);
	$("#limitationsSpan").html(technoDoc2.limitations);

	$("#accordion").accordion();

}

function processTexts(technoDoc) {

	if (technoDoc.dcs) {
		var str = "";
		for (var i = 0; i < technoDoc.dcs.length; i++) {
			str += technoDoc.dcs[i].DC_name + ";";
		}
		technoDoc.dcs = str;
	}
	if (technoDoc.linkedTechnos) {
		var strWeak = "";
		var strStrong = "";
		for (var i = 0; i < technoDoc.linkedTechnos.length; i++) {
			var weak = technoDoc.linkedTechnos[i].weaklyLinkedTo_name;
			var strong = technoDoc.linkedTechnos[i].stronglyLinked_name;
			if (weak)
				strWeak += weak + ";";
			if (strong)
				strStrong += strong + ";";
		}

		technoDoc.stronglyLinkedTechs = strStrong;
		technoDoc.weaklyLinkedTechs = strWeak;
	}

	for ( var key in technoDoc) {// pour tous les champs
		var str2 = "";
		var str = "" + technoDoc[key];

		var p = 0;
		var q = 0;
		if (str.indexOf("http") > -1) {// hyperlink

			while ((p = str.indexOf("http", q + 10)) > 1) {
				var q = str.indexOf(";", p + 1);
				if (q < 0)
					q = str.length - 1;
				var href = str.substring(p, q);
				str = str.slice(0, p) + "<a href='" + href
						+ "' target='_blank'>" + "click here" + "</a>"
						+ str.slice(q);
			}
			technoDoc[key] = str;
		}

		if (str.indexOf(";") > -1) {
			// if(str.endsWith(";"))
			// str=str.substring(0,str.length-1);
			technoDoc[key] = "<ul><li>" + str.replace(/;/g, '</li><li>')
					+ "</li></ul>"
		}

		else {
			technoDoc[key] = technoDoc[key];
		}

	}

	if (technoDoc.img) {// insertion image
		technoDoc.img = "</span><img src='data/pictures/" + technoDoc.img
				+ "' width='100px' text-align='left'><span>";
	}

	// technoDoc.digitalPolarity=maturities[digitalPolarity];
	technoDoc.maturity = maturities[technoDoc.maturity];
	technoDoc.marketSkills = marketSkills[technoDoc.marketSkills];
	technoDoc.TotalSkills = TotalSkills[technoDoc.TotalSkills];

	return technoDoc;
}

   self.drawFieldInputs=function(obj) {
	$("#attrsDiv").html("");
	var str = "<br><div id='inputPanel'>";
	str += "<button onclick=saveNodeInput(true)>Creer noeud</button>&nbsp;";
	str += "<div id='inputFieldsNodes'>";
	str += "<hr><table id='inputFieldsNodesTable'>";

	for ( var key in obj) {
		var fieldName = key;
		var fieldValue = obj[key];

		str += "<tr>"
		str += "<td>" + fieldName
				+ " : </td><td><input class='inputFieldNode' value='"
				+ fieldValue + "' id='field_" + fieldName + "'>" + "<td>";
		str += "</tr>"
	}

	str += "</table>"
	str += "<button onclick=addPropertyToNode('')>+</button>";

	str += "</div>"
	str += "</div>"
	$("#attrsDiv").html(str);

}
 return self;
})()
