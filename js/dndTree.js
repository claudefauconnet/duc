var dndTree = (function(){
 var self = {};
   self.D3Tree=function(thesaurusName_) {

	
	
	
	
	// coefficients du graphes (espacements) ajout CF
	var thesaurusName = thesaurusName_;
	var parentDiv = $("#d3TreeDiv_" + thesaurusName);
	var HeightCoef = 25;
	var LabelLengthCoef = 10;
	// var widthCoef=500;
	var widthCoef = 200;
	
	
	HorNodesSpacing=250;

	// define a d3 diagonal projection for use by the node paths later on.
	var totalNodes = 0;
	var maxLabelLength = 0;
	// variables for drag/drop
	var selectedNode = null;
	var draggingNode = null;
	// panning variables
	var panSpeed = 200;
	var panBoundary = 20; // Within 20px from edges will pan when dragging.
	// Misc. variables
	var i = 0;
	var duration = 750;

	var svgGroup;
	var zoomListener;
	var baseSvg;
	var diagonal;
	var treeData;
	var viewerWidth;
	var viewerHeight;
	var tree;
	var nodeColors = {}
	nodeColors["use_case"] = "#ABFA32";
	nodeColors["DC"] = "#0BE0D9";
	nodeColors["techno"] = "#FF3686";
	nodeColors["BC"] = "#4AFF4A";
	nodeColors["bu"] = "#0BBAA2";
	nodeColors["BD"] = "#2FBF0B";
	var fills = [ "#00AC6B", "#20815D", "#007046", "#35D699", "#60D6A9" ];
	// var eventFactory = parent.thesaurus.eventFactory();
	var treeData = null

	this.maxIdt = -1;
	var maxId = -1;
	this.root = null;
	this.drawTree = function() {
		treeData = rootNode;

		// Calculate total nodes, max label length
		var totalNodes = 0;
		var maxLabelLength = 0;
		// variables for drag/drop
		var selectedNode = null;
		var draggingNode = null;
		// panning variables
		var panSpeed = 200;
		var panBoundary = 20; // Within 20px from edges will pan when
								// dragging.
		// Misc. variables
		var i = 0;
		var duration = 750;

		// size of the diagram
		var viewerWidth = $(document).width() * 0.8;
		var viewerHeight = $(document).height() - 50;
		viewerWidth = $("#d3TreeDiv_" + thesaurusName).width();
		// viewerHeight = $("#d3TreeDiv_" + thesaurusName).height();

		// var viewerHeight =( $(document).height()/2)-100;
		// viewerWidth=500;
		// viewerHeight=500;
		var tree = d3.layout.tree().size([ viewerHeight, viewerWidth ]);

		// define a d3 diagonal projection for use by the node paths later on.
		var diagonal = d3.svg.diagonal().projection(function(d) {
			return [ d.y, d.x ];
		});

		// A recursive helper function for performing some setup by walking
		// through all nodes

		   self.visit=function(parent, visitFn, childrenFn) {
			if (!parent)
				return;

			visitFn(parent);

			var children = childrenFn(parent);
			if (children) {
				var count = children.length;
				for (var i = 0; i < count; i++) {
					visit(children[i], visitFn, childrenFn);
				}
			}
		}

		// Call visit function to establish maxLabelLength
self.visitit(treeData, function(d) {
			totalNodes++;
			if(!d.name){
				var xxx=d;
			}
		//	maxLabelLength = Math.max(d.name.length, maxLabelLength);
			maxLabelLength =200;

		}, function(d) {
			return d.children && d.children.length > 0 ? d.children : null;
		});

		// sort the tree according to the node names

		   self.sortTree=function() {
			tree.sort(function(a, b) {
				return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
			});
		}
		// Sort the tree initially incase the JSON isn't in a sorted order.
self.sortTreeee();

		// TODO: Pan function, can be better implemented.

		   self.pan=function(domNode, direction) {
			var speed = panSpeed;
			if (panTimer) {
				clearTimeout(panTimer);
				translateCoords = d3.transform(svgGroup.attr("transform"));
				if (direction == 'left' || direction == 'right') {
					translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
					translateY = translateCoords.translate[1];
				} else if (direction == 'up' || direction == 'down') {
					translateX = translateCoords.translate[0];
					translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
				}
				scaleX = translateCoords.scale[0];
				scaleY = translateCoords.scale[1];
				scale = zoomListener.scale();
				svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
				d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
				zoomListener.scale(zoomListener.scale());
				zoomListener.translate([ translateX, translateY ]);
				panTimer = setTimeout(function() {
self.pan(domNode, speed, direction);
				}, 50);
			}
		}

		// Define the zoom function for the zoomable tree

		function zoom() {
			svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}

		// define the zoomListener which calls the zoom function on the "zoom"
		// event constrained within the scaleExtents
		var zoomListener = d3.behavior.zoom().scaleExtent([ 0.1, 3 ]).on("zoom", zoom);

		   self.initiateDrag=function(d, domNode) {
			draggingNode = d;
			d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
			d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
			d3.select(domNode).attr('class', 'node activeDrag');

			svgGroup.selectAll("g.node").sort(function(a, b) { // select the
																// parent and
																// sort the
																// path's
				if (a.id != draggingNode.id)
					return 1; // a is not the hovered element, send "a" to the
								// back
				else
					return -1; // a is the hovered element, bring "a" to the
								// front
			});
			// if nodes has children, remove the links and nodes
			if (nodes.length > 1) {
				// remove link paths
				links = tree.links(nodes);
				nodePaths = svgGroup.selectAll("path.link").data(links, function(d) {
					return d.target.id;
				}).remove();
				// remove child nodes
				nodesExit = svgGroup.selectAll("g.node").data(nodes, function(d) {
					return d.id;
				}).filter(function(d, i) {
					if (d.id == draggingNode.id) {
						return false;
					}
					return true;
				}).remove();
			}

			// remove parent link
			parentLink = tree.links(tree.nodes(draggingNode.parent));
			svgGroup.selectAll('path.link').filter(function(d, i) {
				if (d.target.id == draggingNode.id) {
					return true;
				}
				return false;
			}).remove();

			dragStarted = null;
		}

		// define the baseSvg, attaching a class for styling and the
		// zoomListener
		var baseSvg = d3.select("#d3TreeDiv_" + thesaurusName).append("svg").attr("width", viewerWidth).attr("height", viewerHeight).attr("class", "overlay").call(zoomListener);

		// Define the drag listeners for drag/drop behaviour of nodes.
		dragListener = d3.behavior.drag().on("dragstart", function(d) {
			if (d == root) {
				return;
			}
			dragStarted = true;
			nodes = tree.nodes(d);
			d3.event.sourceEvent.stopPropagation();
			// it's important that we suppress the mouseover event on the node
			// being dragged. Otherwise it will absorb the mouseover event and
			// the underlying node will not detect it
			// d3.select(this).attr('pointer-events', 'none');
		}).on("drag", function(d) {
			if (d == root) {
				return;
			}
			if (dragStarted) {
				domNode = this;
self.initiateDragDrag(d, domNode);
			}

			// get coords of mouseEvent relative to svg container to allow for
			// panning
			relCoords = d3.mouse($('svg').get(0));
			if (relCoords[0] < panBoundary) {
				panTimer = true;
self.pan(this, 'left');
			} else if (relCoords[0] > ($('svg').width() - panBoundary)) {

				panTimer = true;
self.pan(this, 'right');
			} else if (relCoords[1] < panBoundary) {
				panTimer = true;
self.pan(this, 'up');
			} else if (relCoords[1] > ($('svg').height() - panBoundary)) {
				panTimer = true;
self.pan(this, 'down');
			} else {
				try {
					clearTimeout(panTimer);
				} catch (e) {

				}
			}

			d.x0 += d3.event.dy;
			d.y0 += d3.event.dx;
			var node = d3.select(this);
			node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
			updateTempConnector();
		}).on("dragend", function(d) {
			if (d == root) {
				return;
			}
			domNode = this;
			if (selectedNode) {
				// now remove the element from the parent, and insert it into
				// the new elements children
				var index = draggingNode.parent.children.indexOf(draggingNode);
				if (index > -1) {
					draggingNode.parent.children.splice(index, 1);
				}
				if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
					if (typeof selectedNode.children !== 'undefined') {
						selectedNode.children.push(draggingNode);
					} else {
						selectedNode._children.push(draggingNode);
					}
				} else {
					selectedNode.children = [];
					selectedNode.children.push(draggingNode);
				}
				// Make sure that the node being added to is expanded so user
				// can see added node is correctly moved
self.expandpand(selectedNode);
self.sortTreeTree();
self.endDragDrag();
			} else {
self.endDragDrag();
			}
		});

		   self.endDrag=function() {
			selectedNode = null;
			d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
			d3.select(domNode).attr('class', 'node');
			// now restore the mouseover event or we won't be able to drag a 2nd
			// time
			d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
			updateTempConnector();
			if (draggingNode !== null) {
				// this.update(root);
				centerNode(draggingNode);
				draggingNode = null;
			}
		}

		// Helper functions for collapsing and expanding nodes.

		   self.collapse=function(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}

		   self.expand=function(d) {
			if (d._children) {
				d.children = d._children;
				d.children.forEach(expand);
				d._children = null;
			}
		}

		var overCircle = function(d) {
			selectedNode = d;
			updateTempConnector();
		};
		var outCircle = function(d) {
			selectedNode = null;
			updateTempConnector();
		};

		// Function to update the temporary connector indicating dragging
		// affiliation
		var updateTempConnector = function() {
			var data = [];
			if (draggingNode !== null && selectedNode !== null) {
				// have to flip the source coordinates since we did this for the
				// existing connectors on the original tree
				data = [ {
					source : {
						x : selectedNode.y0,
						y : selectedNode.x0
					},
					target : {
						x : draggingNode.y0,
						y : draggingNode.x0
					}
				} ];
			}
			var link = svgGroup.selectAll(".templink").data(data);

			link.enter().append("path").attr("class", "templink").attr("d", d3.svg.diagonal()).attr('pointer-events', 'none');

			link.attr("d", d3.svg.diagonal());

			link.exit().remove();
		};

		// Function to center node when clicked/dropped so node doesn't get lost
		// when collapsing/moving with large amount of children.

		centerNode = function(source) {
			scale = zoomListener.scale();
			x = -source.y0;
			y = -source.x0;
			x = x * scale + viewerWidth / 2;
			y = y * scale + viewerHeight / 2;
			d3.select('g').transition().duration(duration).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
			zoomListener.scale(scale);
			zoomListener.translate([ x, y ]);

		}

		// Toggle children function

		   self.toggleChildren=function(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else if (d._children) {
				d.children = d._children;
				d._children = null;
			}
			return d;
		}

		// Toggle children on click.

		   self.click=function(d) {
			if (d3.event.defaultPrevented)
				return; // click suppressed
			// // d = toggleChildren(d);

			var e = d3.event;

			if (e.ctrlKey) {
				eventFactory.showNodeInfo(d);

			} else {
				// this.update(d);
				centerNode(d);
				rootNode = root;
			}
		}

		this.update = function(source) {
			// Compute the new height, function counts total children of root
			// node and sets tree height accordingly.
			// This prevents the layout looking squashed when new nodes are made
			// visible or looking sparse when nodes are removed
			// This makes the layout more consistent.
			var levelWidth = [ 1 ];
			var childCount = function(level, n) {

				if (n.children && n.children.length > 0) {
					if (levelWidth.length <= level + 1)
						levelWidth.push(0);

					levelWidth[level + 1] += n.children.length;
					n.children.forEach(function(d) {
						childCount(level + 1, d);
					});
				}
			};
			childCount(0, root);
			var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line

			// viewerWidth=viewerWidth/3;

			tree = tree.size([ newHeight, viewerWidth ]);

			// Compute the new tree layout.
			var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);

			// Set widths between levels based on maxLabelLength.
			nodes.forEach(function(d) {
				d.y = (d.depth * (maxLabelLength * 10)); // maxLabelLength *
															// 10px
				// alternatively to keep a fixed scale one can set a fixed depth
				// per level
				// Normalize for fixed-depth by commenting out below line
				d.y = (d.depth * HorNodesSpacing); // 500px per level.
			});

			// Update the nodes…
			node = svgGroup.selectAll("g.node").data(nodes, function(d) {
				return d.id || (d.id = ++i);
			});

			// Enter any new nodes at the parent's previous position.
			var nodeEnter = node.enter().append("g").call(dragListener).attr("class", "node").attr("transform", function(d) {
				return "translate(" + source.y0 + "," + source.x0 + ")";
			}).on('click', click);

			nodeEnter.append("circle").attr('class', 'nodeCircle').attr("r", 0).style("fill", function(d) {
				return d._children ? "lightsteelblue" : "#fff";
			});

			nodeEnter.append("text").attr("x", function(d) {
				return d.children || d._children ? -10 : 10;
			}).attr("dy", ".35em").attr('class', 'nodeText').attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			}).text(function(d) {
				return d.name;
			}).style("fill-opacity", 0);

			// phantom node to give us mouseover in a radius around it
			nodeEnter.append("circle").attr('class', 'ghostCircle').attr("r", 30).attr("opacity", 0.2) // change
																										// this
																										// to
																										// zero
																										// to
																										// hide
																										// the
																										// target
																										// area
			.style("fill", "red").attr('pointer-events', 'mouseover').on("mouseover", function(node) {
radarController.overCirclercle(node);
			}).on("mouseout", function(node) {
radarController.outCirclercle(node);
			});

			// Update the text to reflect whether node has children or not.
			node.select('text').attr("x", function(d) {
				return d.children || d._children ? -10 : 10;
			}).attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			}).text(function(d) {
				return d.name;
			});

			// Change the circle fill depending on whether it has children and
			// is collapsed
			node.select("circle.nodeCircle")
			// .attr("r", 4.5)
			.attr("r", 6).style("fill", function(d) {
self.getTreeNodeColoreeNodeColor(d)
				// return d._children ? "lightsteelblue" : "#fff";
			});

			// Transition nodes to their new position.
			var nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

			// Fade the text in
			nodeUpdate.select("text").style("fill-opacity", 1);

			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
				return "translate(" + source.y + "," + source.x + ")";
			}).remove();

			nodeExit.select("circle").attr("r", 0);

			nodeExit.select("text").style("fill-opacity", 0);

			// Update the links…
			var link = svgGroup.selectAll("path.link").data(links, function(d) {
				return d.target.id;
			});

			// Enter any new links at the parent's previous position.
			link.enter().insert("path", "g").attr("class", "link").attr("d", function(d) {
				var o = {
					x : source.x0,
					y : source.y0
				};
				return diagonal({
					source : o,
					target : o
				});
			});

			// Transition links to their new position.
			link.transition().duration(duration).attr("d", diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition().duration(duration).attr("d", function(d) {
				var o = {
					x : source.x,
					y : source.y
				};
				return diagonal({
					source : o,
					target : o
				});
			}).remove();

			// Stash the old positions for transition.
			nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});
		}

		// Append a group which holds all nodes and which the zoom Listener can
		// act upon.
		var svgGroup = baseSvg.append("g");

		// Define the root
		root = treeData;
		root.x0 = viewerHeight / 2;
		root.y0 = 0;

		// Layout the tree initially and center on the root node.
		this.update(root);
		centerNode(root);

	}

	   self.getTreeNodeColor=function(d) {
		var type = d;
		return nodeColors[d.type];
		// return d._children ? "lightsteelblue" : "#fff";

	}

	this.deleteNode = function(d) {

		for (i = 0; i < d.parent.children.length; i++) {
			if (d.parent.children[i].name === d.name)
				d.parent.children.splice(i, 1);
		}
		this.update(root);

	}

	this.addExternalNode = function(node) {
		var xxx = maxId;
		var yyy = maxId.root;
		node.parent = root;
		maxId += 1;
		node.id = maxId;
		if (root.children)
			root.children = [];
		root.children.push(node);
		this.update(root);
	}

	this.updateScreenView = function(d) {
		var count = 0;

		var timer = setInterval(function() {
			this.update(d);
			count++;
			if (count = 5) {
				clearInterval(timer);
			}
		}, 100);

	}

	this.getNewId = function() {
		return ++this.maxId;
	}

	this.showSearchedNode = function(node) {
		centerNode(node);
		var wwww = d3.select("#" + node.id_)// ;.select('.nodeCircle').style("fill",
											// "#f00");
		var xxxxx = wwww;
	}

	this.getTreNodeByNameRecursive = function(parentTreeNode, name) {

		if (!parentTreeNode)
			parentTreeNode = this.root;
		if (!parentTreeNode.children)
			// console.log("-**-" + parentTreeNode.name);
			if (!parentTreeNode.children) {
				return true;
			}
		for (var i = 0; i < parentTreeNode.children.length; i++) {
			var childTreeNode = parentTreeNode.children[i];
			// console.log(parentTreeNode.name + "----------" +
			// childTreeNode.name);
			if (childTreeNode.name.toLowerCase().indexOf(name) > -1) {
				centerNode(childTreeNode);
				var xxx = d3.selectAll(".node");
				var nodes = d3.selectAll(".node")[0];
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].__data__.id_ == childTreeNode.id_) {

					}
				}

				return true;
			}

			else {
				getTreNodeByNameRecursive(childTreeNode, name);

			}

		}

	}
	this.getRadarImg = function() {
		var html = d3.select("svg").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg").node().parentNode.innerHTML;
		// d3.select("#testIMG").html(html);

		// injection des styles (à revoir pas propre !!!)
		var style = ".radarPointLabel {fill: #fff;font: Consolas, verdana, sans-serif;font-size: 12px;font-weight: normal;pointer-events: none;}";
		style += ".radarAxisTitle {font-size: 28, text-anchor: start, fill: #00f}";
		style += ".title {position: relative;top: 5px;left: 10px;font-size: 18px;font-family: serif;font-weight: bold;}";
		var styleDef = '<defs><style type="text/css"><![CDATA[' + style + ']]></style></defs>';
		var p = html.indexOf(">");
		html = html.substring(0, p + 1) + styleDef + html.substring(p);
		return html;
		var imgSrc = 'data:image/svg+xml;base64,' + btoa(html);
		return imgSrc;

	}
}

 return self;
})()