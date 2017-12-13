var d3packTechnos = (function(){
 var self = {};
//moved  var currentRadarNode = null;
//moved  var currentPoint;
//moved  var tree;
//moved  var treeFistLevel="domain";

   self.setMessage=function() {
	;
}

   self.preparePOTData=function() {
	var domains = {};

	var docs = loadData(dbName, "technologies", {
		bu : "Groupe",
		year : 2015
	});
	var size = 100;
	for (var j = 0; j < docs.length; j++) {

		var doc = docs[j];
	

		if (domains[doc.domain] == null) {

			domains[doc.domain] = {
				name : doc.domain,
				domain_id : doc.domain_id,
				children : [ {
					name : doc.techno,
					techno_id : doc.details_id,
					id : doc.id,
					size : size
				} ]

			};

		} else {
			var x = domains[doc.domain];
			var y = domains[doc.domain].children;
			domains[doc.domain].children.push({
				name : doc.techno,
				techno_id : doc.details_id,
				id : doc.id,
				size : size
			});

		}
		// size += 10;

	}
	return domains;

}

   self.getFiltersJSON=function() {
	var queryJson = {};
	for (var i = 0; i < currentFilters.length; i++) {
		var obj = currentFilters[i];

		queryJson[obj.key] = obj.value;
		if (obj.mode == "only") {
			queryJson[obj.key] = obj.value;
		} else {
			var oldQueryJson = queryJson;
			var operator = "$" + obj.mode;
			var obj2 = {}
			obj2[obj.key] = obj.value;
			queryJson = {};
			queryJson[operator] = [];
			queryJson[operator].push(obj2);
			queryJson[operator].push(oldQueryJson);
		}
	}
	return queryJson;
}

   self.preparePortFolioData=function(domainType, domainId, subDomainType, subDomainId) {
	var query =self.getFiltersJSON();
	var domains = {};
	var subDomains = {};

	// var docs = loadData(dbName, "technologies", query);
	
	var docs = dataArray;
	for (var j = 0; j < docs.length; j++) {
		if(false && dbName=="DigitalPortfolio")
		docs[j]["domain"] = "" + docs[j].ImportanceDigital + "-" + docs[j].ImportanceManagement;
		if(!docs[j].name &&  docs[j].techno )
			docs[j].name =docs[j].techno;

		var doc = docs[j];
		if(doc.label==null)
			doc.label==doc.name;
		if(doc.label==null)
			doc.label==doc.techno;
		if (domains[doc[domainType]] == null) {

			domains[doc[domainType]] = {
				name : doc[domainType],
				domain_id : doc[domainId],
                children : [self.getPointObject(doc) ],
				subDomains : []

			};

		} else {

			if (!subDomainType) {
                domains[doc[domainType]].children.push(self.getPointObject(doc));
			} else {
				var subDomainObj = domains[doc[domainType]].subDomains[doc[subDomainType]];
				if (subDomainObj == null) {

					domains[doc[domainType]].children.push({
						name : doc[[ subDomainType ]],
						subDomain_id : doc[subDomainId],
						children : [ 
self.getPointObject(doc)
						]

					});
					var xxx = domains[doc[domainType]].children;
					domains[doc[domainType]].subDomains[doc[subDomainType]] = domains[doc[domainType]].children;
				} else {
					// var
					// subDomainObj=domains[doc[domainType]].children[doc[subDomainType]];
					// console.log(JSON.stringify(subDomain));
					domains[doc[domainType]].subDomains[doc[subDomainType]].push(
self.getPointObject(doc));
					// /
					// console.log(JSON.stringify(domains[doc[domainType]].children[doc[subDomainType]]));

				}
				// domains[domainType].children.push(subDomains[key]);
			}

		}
		// size += 10;

	}
	// console.log(JSON.stringify(domains));
	return domains;

}

   self.getPointObject=function(doc){
	var filters= radarXmls[currentRadarType].Xml_getfilterNames();
	var obj={
			name : doc.name,
			label : doc.label,
			techno_id : doc.id,
			details_id : doc.id,
			
		}
	for(var i=0;i<filters.length;i++){
		if(!obj[filters[i]])
		obj[filters[i]]=doc[filters[i]];
		
	}
	console.log("_____"+obj.name);
	return obj;
}
   self.getTechnoJson=function() {
	var domains;
	if (dbName == "POT")
self.preparePOTDataeparePOTData();
	//if (dbName == "DigitalPortfolio") {
	else{
		// domains = preparePortFolioData("domain","domain_id","Division","id");
self.preparePortFolioDataortFolioData(treeFistLevel, "domain_id", null, "radar_id");
		// domains = preparePortFolioData("Sector", "radar_id", "domain",
		// "radar_id");
	}

	var children = [];
	for ( var prop in domains) {
		children.push(domains[prop]);

	}

	var json = {
		"name" : ".",
		"children" : children,
	// size: 4000
	};

	// console.log(JSON.stringify(domains));
	return json;
}

   self.drawD3TreeGraph=function() {

	tree = new D3Tree("technologies");
	var data =self.getTechnoJson();
	tree.drawTree(data);

self.setPointsColorr();
}

function D3Tree(name) {

	this.name = name;

	this.getWidth = function() {
		return $("#" + name).parent().width();
		// return 600;
	};

	this.getHeight = function() {
		return $("#" + name).parent().height();
		// return 500;
	};

	this.getBaseSvg = function() {
		return d3.select("#" + name).append("svg").attr("width", this.viewerWidth).attr("height", this.viewerHeight).attr("class", "overlay").call(this.zoomListener);
	};

	this.ctrlEvent = function(d) {
		// manager.showNodeInfo(d);
self.showTechnoInfosos(d);
	};

	this.specificNodeEnterAppend = function(nodeEnter) {
		nodeEnter.append("circle").attr('class', 'nodeCircle').attr("r", 0).style("fill", function(d) {
			return d._children ? "lightsteelblue" : "#fff";
		});
	};

	this.clean = function() {
		var svg = d3.select("svg");
		if (svg) {
			svg.remove();
		} else {
			// console.log("first call : cannot clean");
		}
	};
}
D3Tree.prototype = new AbstractTree;

   self.drawD3PackGraph=function() {

	var state = false;
	var childSelected = false;
	var childrenVisible = false;
	// var w = 1280, h = 800, r = 720, x = d3.scale.linear().range([ 0, r ]), y
	// = d3.scale.linear().range([ 0, r ]), node, root;
	// var w = 1280/2, h = 800/2, r = 720/2, x = d3.scale.linear().range([ 200,
	// r ]), y = d3.scale.linear().range([ 0, r ]), node, root;
	var w = 1020, h = 580, r = 620, x = d3.scale.linear().range([ 0, r ]), y = d3.scale.linear().range([ 0, r ]), node, root;

	var pack = d3.layout.pack().size([ r, r ]).value(function(d) {
		return d.size;
	})

	var vis = d3.select("#radar").insert("svg:svg", "h2").attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

	d3.json("flare.json", function(data) {
self.getTechnoJsonechnoJson();
		// console.log(JSON.stringify(data));
		node = root = data;

		var nodes = pack.nodes(root);
		var childNodes = [];
		for (var i = 0; i < nodes.length; i++) {
			if (!nodes[i].children) {
				childNodes.push(nodes[i]);
			}
		}

		/*
		 * nodes.reverse(); nodes.splice(0, 0, nodes[nodes.length - 1]);
		 * nodes.splice(nodes.length - 1, 1);
		 */

		vis.selectAll("ellipse ").data(nodes).enter().append("svg:ellipse").attr("class", function(d) {
			return d.children ? "parent" : "child";
		}).attr("class", "pointsRadar").attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		}).attr("ry", function(d) {
			return d.r * 0.8;
		}).attr("rx", function(d) {
			return d.r;
		}).on("click", function(d, a, b) {
radarController.hoverHideide();
			childSelected = false;
self.setChildrenVisibleble();
			if (true || d.children) {// domains
				return zoom(node == d ? root : d);
			}
			return false;
		});

		vis.selectAll("text").data(nodes).enter().append("svg:text").attr("class", function(d) {
			return d.children ? "parent" : "child";
		}).attr("class", "pointsRadar").attr("x", function(d) {
			return d.x;
		}).attr("y", function(d) {
			return d.y;
		}).attr("dy", ".35em").attr("text-anchor", function(d) {
			if (d.children) {
				return "middle";
			}
			return "middle";
		}).style("opacity", function(d) {
			return d.r > 20 ? 1 : 0;
		}).text(function(d) {
			return d.name;
		});

		vis.selectAll(".childClick").data(childNodes).enter().append("svg:ellipse").attr("class", function(d) {
			return "childClick";
		}).attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		}).attr("ry", function(d) {
			return d.r * 0.8;
		}).attr("rx", function(d) {
			return d.r;
		}).on("click", function(d) {

self.showTechnoInfosfos(d);

		});

		d3.select(window).on("click", function() {
			childSelected = true;

		});
self.setChildrenVisiblele();

	});

	function zoom(d, i) {

		var k = r / d.r / 2;
		x.domain([ d.x - d.r, d.x + d.r ]);
		y.domain([ d.y - d.r, d.y + d.r ]);

		var t = vis.transition().duration(d3.event.altKey ? 7500 : 750);

		t.selectAll("ellipse").attr("cx", function(d) {
			return x(d.x);
		}).attr("cy", function(d) {
			return y(d.y);
		}).attr("ry", function(d) {
			return k * d.r * 0.8;
		}).attr("rx", function(d) {
			return k * d.r;
		});
		t.selectAll("text").attr("x", function(d) {
			return x(d.x);
		}).attr("y", function(d) {
			return y(d.y);
		}).attr("dy", function(d) {
			if (d.children)
				return "-10px";
			else
				return ".35em"
		}).style("font-size", function(d) {
			if (d.children)
				return "14px";
			else
				return "12px";

		}).

		node = d;
		d3.event.stopPropagation();

		state = !state;

	}

	   self.setChildrenVisible=function() {
		if (childSelected) {
			return;
		}
		childSelected = false;
		vis.selectAll("ellipse").style("opacity", function(d) {
			if (d.children) {

				return 1;
			}

			if (childrenVisible) {

				return 1;
			} else {
				return 0;
			}

		});

		vis.selectAll("text").style("opacity", function(d) {
			if (d.children) {

				return 1;
			}
			if (childrenVisible) {

				return 1;
			} else {
				return 0;
			}
		});
		childrenVisible = !childrenVisible;

	}
}
   self.showTechnoInfos0=function(d) {
	// setChildrenVisible();
	// return zoom( d);
	childSelected = true;
	var xx = d;
	var e = d3.event;
	var str = "zzzz";
	var x = e.clientX
	var y = e.clientY;
	node = {
		details_id : d.techno_id,
		label : d.name,
		id : d.id
	};
	currentRadarNode = node;
	var str =radarController.getDCPopupText(false, false);
radarController.hoverShoww(x, y, str);

}

   self.showTechnoInfos=function(d) {
	// setChildrenVisible();
	// return zoom( d);
	childSelected = true;
	var xx = d;
	var e = d3.event;
	var str = "";
	var x = e.clientX
	var y = e.clientY;
	var dcData =devisuProxy.loadData(dbName, "technologies", {
		id : d.techno_id
	});
	currentRadarNode = d;
	currentPoint = dcData[0];

	if(currentRadarNode.label==null)
		currentRadarNode.label==currentRadarNode.name;
	if(currentRadarNode.label==null)
		currentRadarNode.label==currentRadarNode.techno;

	if(!currentPoint.name)
		currentPoint.name=currentPoint.techno;
	// var str = getDCPopupText(false, false);

self.getPointTextointText(currentPoint);

radarController.hoverShoww(x, y, str);

}

   self.getPointText=function(currentPoint) {
	var excludedKeys = [ "excluded", "modifiedBy", "x", "y", "domain_id","Description"];
	var mainKeys = [  "Division", "domain", ];


	if (!currentRadarNode)
		return "";
	var str = "<button onclick='hoverHide()'>X</button>&nbsp;<br>&nbsp;&nbsp;";
	str += "<B><i>" + "name" + "</i>:" + currentPoint["name"] + "</B><br>";
self.getPointsModifiableAttrsbleAttrs(currentPoint);
	for ( var key in currentPoint) {
		if (mainKeys.indexOf(key) >= 0) {

			str += "<B><i>" + key + "</i>:" + currentPoint[key] + "</B><br>";
		}

	}
	str += "" + key + "</i>:<span class='popupDescription'>" + currentPoint["Description"] + "</span><br>";

	for ( var key in currentPoint) {
		if (excludedKeys.indexOf(key) < 0 && mainKeys.indexOf(key) < 0) {

			str += "<i>" + key + "</i>:<B>" + currentPoint[key] + "</B><br>";
		}

	}
	return str;

}

   self.filterGraph=function(filters) {
	var query =self.getFiltersJSON();
radarController.Radar_loadRadar(dbName, "technologies", query);

}

   self.setPointsColor=function() {
	var domainColors = {
		"0-0" : "#faa",
		"0-1" : "#ffa",
		"1-0" : "#faf",
		"1-1" : "#f1f",

	}
	node.select("circle.nodeCircle").attr("r", function(d) {
		var r = 10;
		if (d.MeteoProjet == 0)
			r = 4;
		if (d.MeteoProjet == 1)
			r = 10;
		return r;

	}).style("opacity", function(d) {
		var opacity = 1;
		if (d.MeteoProjet == 2)
			opacity = .3

		return opacity;

	}).style("fill", function(d) {
		var color = "#fff";
		if (!d.domain)
			return color;
		if (d.domain == "2-2")
			color = "#f00";
		else if (d.domain.indexOf("2") > -1)
			color = "#a00";
		else if (d.domain)
			color = domainColors[d.domain];

		return color;
	});

}

var modifiableAttrs = [];

   self.getPointsModifiableAttrs=function(currentPoint) {
	var attrs = [];
	if(dbName=="DigitalPortfolio")
	 attrs = [ {
		name : "ImportanceDigital",
		options : [ "0", "1", "2" ]
	}, {
		name : "ImportanceManagement",
		options : [ "0", "1", "2" ]
	}, {
		name : "MeteoProjet",
		options : [ "0", "1", "2" ]
	} ];

	modifiableAttrs = attrs;
	var str = "";
	for (i = 0; i < attrs.length; i++) {
		var field = attrs[i];
		str += "&nbsp;" + field.name + " <select id='techoModifiable" + field.name + "' onchange='modifyCurrentPointAttr(\"" + field.name + "\")'>";
		for (j = 0; j < field.options.length; j++) {
			str += "<option>" + field.options[j] + "</option>";
		}
		str += "</select><br>";

		str += "<script>setPointsModifiableAttrs();</script>";

	}
	return str;

}
   self.modifyCurrentPointAttr=function(attrs) {
	var fieldJson = null;
	var val = "";
	if (mode != "write")
		return;
	var d3Node=null;
	node.select("circle.nodeCircle").attr("r", function(d) {
	 if(d.details_id==currentPoint.id)
		 d3Node=d;
});
	var updatedFields={};
	for (i = 0; i < modifiableAttrs.length; i++) {
		var field = modifiableAttrs[i];
		val = $("#techoModifiable" + field.name + " option:selected").text();
		if(val.match(/[0-9]*/))
			val=parseInt(val);
		currentPoint[field.name] = val;
		currentRadarNode[field.name] = val;
		d3Node[field.name] = val;
		
		updatedFields[field.name]=val;
	}

	var domain = "" + currentPoint.ImportanceDigital + "-" + currentPoint.ImportanceManagement;
	currentRadarNode["domain"] = domain;
	d3Node["domain"] = domain;
	updatedFields["domain"] = domain;
	
devisuProxy.updateItemFieldss(dbName, "technologies", {id:currentPoint.id}, updatedFields)
self.setPointsColorr();
	
}
   self.setPointsModifiableAttrs=function() {
	for (i = 0; i < modifiableAttrs.length; i++) {
		var field = modifiableAttrs[i];
		var val = currentPoint[field.name];
		$("#techoModifiable" + field.name).val(val);

	}
	;
};


 return self;
})()