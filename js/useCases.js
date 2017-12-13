var useCases = (function () {
    var self = {};
//moved  var currentUseCase = null;
//moved  var parentTreeNode_ = null;
//moved  var cbxTechnos = [];
//moved  var useCaseCurrentTechno = null
//moved  var currentBC = null;
//moved  var dcsLinkedDcsAndTechnos = [];
//moved  var dcsToCopy = ""
//moved  var currentTreeNode;
//moved  var useCasesTechnos;
//moved  var maxTreeId = -1000000;
//moved  var newUseCase;

//moved  var cbxTechnos = {};

//moved  var currentYear;
//moved  var bcsTreeDiv;
    /*
     *
     * function initUseCases(currentBC) { if (currentRadarNode == null) {http://localhost:8080/deVisu2a/?dbName=POT2016&bu=GP#tabs-radarLeft-BC
     * alert("choose a radar Item first"); return; } loadUseCaseInputHtml();
     *
     *
     *
     * var useCaseData = loadData(dbName, "use_cases", { BC_id :
     * currentBC.BC_id });
     *
     * $("#currentBCandTechno").html("Business capability : " + currentBC.text + "
     * <-> technology : " + currentRadarNode.techno);
     * $("#useCaseDiv").css("visibility", "hidden"); if (useCaseData.length > 0) {//
     * existing use case $("#useCaseDiv0").css("visibility", "visible");
     * useCaseData.splice(0, 0, { name : "create new use case", id : -1 });
     * useCaseData.splice(0, 0, { name : "...", id : -999 });
     * fillSelectOptions(useCaseExistingUseCases, useCaseData, "name", "id"); } else
     * {// new
     *
     * loadSelectedUseCase(); } }
     */

    /*
     * $(document).keypress(function(e) { if(e.which == 13) { alert('You pressed
     * enter!'); } });
     */
    self.loadSelectedUseCase = function (BC, useCase) {
        cbxTechnos = {};
        $("#ulOldDcs").html("");
        currentUseCase = useCase;

        currentBC = BC;
        dcsLinkedDcsAndTechnos = [];
        loadUseCaseInputHtml();

        if (currentRadarNode == null) {
            useCaseCurrentTechno = "?";
            self.setUseCaseTechnosSelect();
        } else {
            useCaseCurrentTechno = currentRadarNode.techno;
            self.setUseCaseTechnosSelect();
        }
        $("#currentBCandTechno").html("Business capability : " + currentBC.bu + "/" + currentBC.BD + "/" + currentBC.BC);// + "
        // <->
        // technology
        // : "
        // +
        // useCaseCurrentTechno);

        if (currentUseCase) {
            $("#useCasIdSpan").html(currentUseCase.id);
            $("#useCaseName").val(currentUseCase.name);
            $("#useCaseDescription").val(currentUseCase.description);
            $("#useCaseEmergency").val(currentUseCase.emergency);
            $("#useCaseImpact").val(currentUseCase.impact);
            $("#useCaseMaturity").val(currentUseCase.maturity);
            // $("#useCaseValue").val(currentUseCase.value);

            /*
             * var DCtext = "<ul>"; for (var j = 0; j <
             * dcsLinkedDcsAndTechnos.length; j++) { DCtext += "<li>" +
             * dcsLinkedDcsAndTechnos[j].dc + "["; for (var k = 0; k <
             * dcsLinkedDcsAndTechnos[j].technos.length; k++) { DCtext +=
             * dcsLinkedDcsAndTechnos[j].technos[k].name + ","; } DCtext += "]</li>"; }
             * DCtext += "</ul>" $("#useCaseDsAndTechnos").html(DCtext);
             */
            if (!currentUseCase.dcs)
                return;
            currentUseCase.dcs.sort(function (a, b) {
                if (a.dc > b.dc)
                    return 1;
                if (a.dc < b.dc)
                    return -1;
                return 0;
            });
            self.setOldUseCaseDCsAndTeshnos(currentUseCase.dcs);
        }

    }

    self.setNewUseCaseDCsAndTeshnos = function () {
        if (!currentRadarNode)
            return;
        var dcData;
        if (dbName == "POT") {
            devisuProxy.loadData(dbName, "DC_technos", {
                radar_id: currentRadarNode.id
            })
        }
        else {//POT>2015
            devisuProxy.loadData(dbName, "r_T_DC", {
                techno_id: currentRadarNode.id
            });
        }
        //cbxTechnos = [];
        var DCtext = "";// "<ul>";
        var checked = "";
        var techsSrtr = "";
        var technoObjs = [];

        var techIds = [];
        for (var i = 0; i < dcData.length; i++) {
            if ($.inArray(dcData[i].radar_id, techIds) < 0) {
                technoObjs.push({
                    name: dcData[i].techno_name,
                    id: dcData[i].techno_id
                });
                techIds.push(dcData[i].techno_id);
                techsSrtr += dcData[i].techno_name;
            }

            /*
             * if (techsSrtr.length > 0) techsSrtr = techsSrtr.substring(0,
             * techsSrtr.length - 1);
             */
            var cbxid = "dc_cbx_" + dcData[i].dc_id;
            var li_id = "dc_cbx_" + dcData[i].dc_id;
            cbxTechnos[cbxid] = technoObjs;
            var cbxEvt = "onclick='onNewCbxClicked(this)'";
            var CbxText = "<input class='cbx-dc cbx-dc-new' type='checkBox' " + cbxEvt + "  " + checked + "label='" + dcData[i].dc_name + "' id='" + cbxid + "'>";

            DCtext += "<li id='li_" + cbxid + "' class='liNew'><font color='blue'>" + CbxText + dcData[i].dc_name + "</font><font color='green'>[" + techsSrtr + "]</font>" + "</li>";

        }
        // /DCtext += "</ul>";

        $("#ulNewDcs").html(DCtext);
        // if(currentUseCase){//} && ($("#oldUseCaseDsAndTechnos").html()==""))
        if (currentUseCase)
            self.setOldUseCaseDCsAndTeshnos(currentUseCase.dcs);
        // }
    }

    self.copyNewCheckedDCsToOldDCs = function () {

        $("#newUseCaseDsAndTechnos").html()
        var newCbxs = $(".cbx-dc-new");
        var str = "<ul>";
        for (var i = 0; i < newCbxs.length; i++) {
            if ($(newCbxs[i]).prop('checked')) {

                str += $(newCbxs[i]).parentsUntil("ul").html();

            }
        }
        str += "<ul>";
        dcsToCopy = str;

        // var obj=$("#newUseCaseDsAndTechnos").get();

    }

    self.setOldUseCaseDCsAndTeshnos = function (oldLinkedDcsAndTechnos) {
        $("#ulOldDcs").html(dcsToCopy);
        dcsToCopy = "";
        // var DCtext = "<ul>";
        var DCtext = "";

        if (!oldLinkedDcsAndTechnos)
            return;
        for (var i = 0; i < oldLinkedDcsAndTechnos.length; i++) {
            var checked = "checked='checked'";
            var techsSrtr = "";
            var technoObjs = [];
            var techIds = [];

            var techs = oldLinkedDcsAndTechnos[i].technos;
            for (var k = 0; k < techs.length; k++) {
                if ($.inArray(techs[k].id, techIds) < 0) {
                    technoObjs.push({
                        name: techs[k].name,
                        id: techs[k].id
                    });
                    techIds.push(techs[k].id);
                    techsSrtr += techs[k].name + ",";
                }

            }
            if (techsSrtr.length > 0)
                techsSrtr = techsSrtr.substring(0, techsSrtr.length - 1);

            var cbxid = "dc_cbx_" + oldLinkedDcsAndTechnos[i].dc_id;

            cbxTechnos[cbxid] = technoObjs;
            var cbxEvt = "";

            var CbxText = "<input class='cbx-dc'  type='checkBox' " + checked + "label='" + oldLinkedDcsAndTechnos[i].dc + "' id='" + cbxid + "'>";

            DCtext += "<li><font color='blue'>" + CbxText + oldLinkedDcsAndTechnos[i].dc + "</font><font color='green'><B>[" + techsSrtr + "]</B></font>" + "</li>";

        }
        // DCtext += "</ul>";

        // $("#oldUseCaseDsAndTechnos").append(DCtext);
        $("#ulOldDcs").append(DCtext);

    }

    self.onNewCbxClicked = function (cbx) {
        var liCbx = $("#li_" + cbx.id);
        $(cbx).attr("class", "cbx-dc");
        var xxx = liCbx;
        jQuery(liCbx).detach().prependTo('#ulOldDcs')

    }
    self.saveUseCase = function () {
        if (!currentBC)
            return;
        // var currentBC = currentBC;

        var cbxDcs = $(".cbx-dc");

        var businessCapability = currentBC.BC;
        var bcId = currentBC.BC_id;
        var radarUsecaseName = $("#useCaseName").val();
        var radarUsecaseDesc = $("#useCaseDescription").val();
        var useCaseMaturity = $("#useCaseMaturity").val();
        var useCaseImpact = $("#useCaseImpact").val();

        // var useCaseValue = $("#useCaseValue").val();

        if (radarUsecaseName == "") {
            alert("name is mandatory");
            return;
        }

        var dcs = [];
        var saveOK = false;
        for (var i = 0; i < cbxDcs.length; i++) {
            if (cbxDcs[i].checked) {// ajout des technos à chaque dc
                saveOK = true;
                var technos = cbxTechnos[cbxDcs[i].id];
                // console.log(JSON.stringify(technos));
                var addTechnoToDc = true;

                dcs.push({
                    dc_id: parseInt(cbxDcs[i].id.substring(7)),
                    dc: cbxDcs[i].attributes.label.value,
                    technos: technos,

                });

            }
        }
        if (saveOK == false) {
            // alert("cannot save if no digital capabililty selected");
            // return;
        }

        if (currentUseCase) {// update
            var oldDcIds = [];

            currentUseCase.bu = currentBC.bu;
            if (currentRadarNode)
                currentUseCase.year = currentRadarNode.year;
            currentUseCase.BD = currentBC.BD;
            currentUseCase.BC = currentBC.BC;
            currentUseCase.BC_id = currentBC.BC_id;
            currentUseCase.BD_id = currentBC.BD_id;
            currentUseCase.description = radarUsecaseDesc;
            currentUseCase.name = radarUsecaseName;
            currentUseCase.dcs = dcs;
            // currentUseCase.emergency = useCaseEmergency;
            // currentUseCase.value = useCaseValue;
            currentUseCase.impact = useCaseImpact;
            currentUseCase.maturity = useCaseMaturity;
            devisuProxy.updateItem(dbName, "use_cases", currentUseCase);

        } else {// new.
            var useCase = {
                bu: currentBC.bu,
                year: currentYear,
                BD: currentBC.BD,
                BC: currentBC.BC,
                BC_id: currentBC.BC_id,
                BC: businessCapability,
                BD_id: currentBC.BD_id,
                name: radarUsecaseName,
                description: radarUsecaseDesc,
                emergency: 1,
                value: 1,
                impact: useCaseImpact,
                maturity: useCaseMaturity,
                dcs: dcs,

            }
            var newObj = devisuProxy.addItem(dbName, "use_cases", useCase);
            /*
             * var childTreeNode2 = jQuery.extend(true, {}, childTreeNode);
             * addChildToTree(null, childTreeNode, 1);
             * treeData.push(childTreeNode2); saveUseCasesTree(treeData);
             */

            useCase.id = newObj.id;
            newUseCase = useCase;
            self.addItemToTree(parentTreeNode, useCase, "UC");
            // addItemToTree(currentTreeNode, useCase, "UC");

        }
        d3radar.hoverHide();
        self.hideUseCaseDetails();

    }

    self.loadUseCaseInputHtml = function () {
        var _url = "htmlFragments/useCaseInput.html";
        $.ajax({
            url: _url,
            async: false,
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
                setMessage("errorThrown", "red");
            },
            complete: function (jqXHR, textStatus) {
                var html = jqXHR.responseText;
                $("#details").html(html);
                $("#details").css("visibility", "visible");

            }

        });

    }

    self.hideUseCaseDetails = function () {
        $("#details").css("visibility", "hidden");
        $("#useCaseDiv0").css("visibility", "hidden");
        $("#useCaseDiv").css("visibility", "hidden");
        $("#useCaseDsAndTechnos").css("visibility", "hidden");
        $("#oldUseCaseDsAndTechnos").css("visibility", "hidden");
        $("#newUseCaseDsAndTechnos").css("visibility", "hidden");

    }

    self.shallCreateUseCase = function (businessCapability) {
        if (!currentRadarNode)
            return;
        $("#radarHoverPopup").css("visibility", "hidden");
        var extingUseCases = devisuProxy.loadData(dbName, "use_cases", {
            bcId: businessCapability.id
        });
        if (extingUseCases) {

        }
        var str = radarController.getDCPopupText(true, extingUseCases);
        str += "<hr>";
        str += "<B><font color='red'> Create use case for " + businessCapability.text + "?</font></B><br>";
        str += "<br>description<br><input id='radarUsecaseNameTA'></input><br>";
        str += "<br>description<br><textArea id='radarUsecaseDescTA'></textArea><br>";
        str += "<button onclick='saveUseCase()'> OK</button>";

        $("#details").html(str);
        $("#details").css("visibility", "visible");
        // $("#radarHoverPopup").css("height", "300px");
        // $("#radarHoverPopup").html(str);

    }


    self.loadUseCaseIframe = function (bcId, useCaseId) {
        var str2 = "";
        var technoId = -1;//currentTechno.id;
        str = "<iframe id='useCaseIframe' scrolling='no' width='490px'  height='490px'; src='useCaseInfo.html?useCaseId=" + useCaseId + "&bcId=" + bcId + "&technoId=" + technoId + "&dbName=" + dbName + str2 + "'/>";
        var x = 400;
        var y = 50;
        radarController.hoverShow(x, y, str);
    }

    self.loadBCsTree = function () {
        var treeData = devisuProxy.loadData(dbName, "use_cases_tree", {})
        devisuProxy.getGroupStat(dbName, "use_cases_tree", {}, "sum", "id");


        $(bcsTreeDiv).on('changed.jstree', function (e, data) {
            // for (var i = 0; i < data.selected.length; i++) {
            // currentTreeNode = data.instance.get_node(data.selected[i]);
            var n = data.selected[data.selected.length - 1];
            if (n < 0)
                return;

            currentTreeNode = data.instance.get_node(n);
            data.selected = [];
            if (!currentTreeNode) {
                console.log("no currentTreenode!!!");
                return;
            }

            var currentTreeNodeId = currentTreeNode.id;
            if ($.isNumeric(currentTreeNode.id))
                currentTreeNodeId = parseInt("" + currentTreeNode.id);
            var parentTreeNode = data.instance.get_node(currentTreeNode.parents[0]);
            if (data.event.ctrlKey) {// ajout d'un Noeud par ctl+click
                var name;
                var parentFieldId = null;


                var parentTreeNodeId;
                var type = currentTreeNode.type;
                if (type == "default") {
                    type = "BU";

                } else if (type == "BU") {
                    type = "BD";
                    parentTreeNodeId = "BD_id";
                } else if (type == "BD") {
                    type = "BC";
                    parentTreeNodeId = "BC_id";
                } else if (type == "BC") {
                    type = null;

                }

                if (type) {
                    name = prompt("New " + type + " Name");
                    if (name && name.length > 0) {
                        var id = ++maxTreeId;
                        var childTreeNode = {
                            "text": name,
                            "id": id,
                            "type": type,
                            "parent": currentTreeNodeId
                        };

                        // childTreeNode =
                        // $(bcsTreeDiv).jstree('select_node', ""+id);

                        // data.instance.deselect_node(data.node);
                        childTreeNode.data = {};
                        // childTreeNode2.data.obj = {};
                        childTreeNode.data.obj = currentTreeNode.data.obj;
                        childTreeNode.data.BD = name;
                        if (type == "BU") {
                            childTreeNode.data.obj.bu_id = id;
                            childTreeNode.data.obj.bu = name;
                        } else if (type == "BD") {
                            childTreeNode.data.obj.BD_id = id;
                            childTreeNode.data.obj.BD = name;
                        } else if (type == "BC") {
                            childTreeNode.data.obj.BC_id = id;
                            childTreeNode.data.obj.BC = name;

                        }
                        // obligé de cloner le noeud sinon data disparait en
                        // ajoutant dans jstree
                        var childTreeNode2 = jQuery.extend(true, {}, childTreeNode);
                        self.addChildToTree(null, childTreeNode, 1);
                        treeData.push(childTreeNode2);
                        self.saveUseCasesTree(treeData);
                        return;

                    }
                }
            }

            if (currentTreeNode.type == "UC") {
                if (!currentTreeNode.data) {
                    currentTreeNode.data = newUseCase;
                    newUseCase = null;
                }
                if (true || dbName == "POT")
                    self.loadSelectedUseCase(parentTreeNode.data.obj, currentTreeNode.data);
                else {//POT>2015
                    //loadUseCaseIframe(parentTreeNode.data.obj.BC_id,currentTreeNode.data.id);
                    self.showUseCase(parentTreeNode.data.obj.BC_id, currentTreeNode.data.id);
                }

            } else if (currentTreeNode.type == "newUC") {

                if (true ||dbName == "POT")
                    self.loadSelectedUseCase(parentTreeNode.data.obj, null);
                else {//POT>2015
                    self.showUseCase(parentTreeNode.data.obj.BC_id, -1);
                    //	loadUseCaseIframe(parentTreeNode.data.obj.BC_id,-1);
                }

            } else if (currentTreeNode.type == "BC") {
                if (currentTreeNode.children.length == 0) {
                    var node = {
                        "text": "--new---",
                        "parent": currentTreeNodeId,
                        "type": "newUC",

                        "isLeaf": true
                    }
                    self.addChildToTree(null, node, 'first');

                    var useCases = devisuProxy.loadData(dbName, "use_cases", {
                        BC_id: currentTreeNodeId
                    });

                    for (var j = 0; j < useCases.length; j++) {
                        var useCase = useCases[j];
                        var node = {
                            "text": useCase.name,
                            "id": useCase.id,
                            "parent": currentTreeNodeId,
                            "type": "UC",
                            "isLeaf": true,
                            "data": useCase

                        };

                        self.addChildToTree(null, node, 'last');

                    }

                }
                self.saveUseCasesTree(treeData);
            }

            // }

        }).jstree({
            'core': {
                'check_callback': true,
                'data': treeData

            },
            'types': {
                "BU": {
                    "icon": "images/_BU.png"
                },
                "BD": {
                    "icon": "images/_BD.png"
                },
                "BC": {
                    "icon": "images/_BC.png"
                },
                "UC": {
                    "icon": "images/_UC.png"
                },
                "newUC": {
                    "icon": "images/_newUC.png"
                }
            },
            "plugins": ['theme', "types"]
        });
    }

    self.showUseCase = function (bcId, id) {
        str = "infosUseCase.html?useCaseId=" + id + "&dbName=" + dbName + "&bcId=" + bcId;
        /*	var str = "";
         if (radarModelName == "UseCases") {
         str = "useCaseInfo.html?useCaseId=" +id + "&dbName=" + dbName+"&bcId="+bcId;
         } else {
         str = "technosInfo.html?technoId=" + id + "&dbName=" + dbName;
         }*/
        $(attrsIFrame).attr("src", str);
//		 $("#main").enhsplitter("move", "450px");
        $('#tabs-radarLeft').tabs({
            active: 2
        });


    }

    self.saveUseCasesTree = function (treeData) {
        var data2 = []
        for (var i = 0; i < treeData.length < 0; i++) {
            if (treeData[i].type !== "UC")
                data2.push(treeData[i]);
        }
        devisuProxy.saveData(dbName, "use_cases_tree", treeData);
    }

    self.addItemToTree = function (parentTreeNode, childobj, type) {

        // var parentTreeNode = $(bcsTreeDiv).find("[id='" +
        // parentObj[parentFieldId] + "']");
        var childTreeNode = {
            "text": childobj.name,
            "id": childobj.id,
            "parent": parentTreeNode.id,
            "type": type,

        };
        if (false && type == 'UC') {

        } else {
            self.addChildToTree(parentTreeNode, childTreeNode, 1);
        }

    }

    self.addChildToTree = function (parentTreeNode_, childTreeNode, position) {
        if (!position) {
            position = 'last';
        }
        if (!parentTreeNode_)
            parentTreeNode = $(bcsTreeDiv).jstree('get_selected');
        if (!parentTreeNode)
            return;
        /*if (false && childTreeNode.type == 'UC') {

         parentTreeNode = $(bcsTreeDiv).jstree('select_node', parentTreeNode.parent);
         }*/
        // var position = 'inside';
        var xxx = $(bcsTreeDiv).jstree().create_node(parentTreeNode, childTreeNode, position);
        $(bcsTreeDiv).jstree("open_node", parentTreeNode);
    }

    /** ****************************************************spreadsheets************************************************** */
    self.UseCases_load = function (spreadSheetdiv) {
        var data;
        var headers;
        var colWidths;
        var columns;
        if (spreadSheetdiv.id == "useCasesSpreadsheet") {

            devisuProxy.loadData(dbName, "use_cases", null, null);

            for (var i = 0; i < data.length; i++) {
                var dcs = data[i].dcs;
                if (!dcs)
                    dcs = [];
                var _DCs = "";
                var _technos = "";
                for (var j = 0; j < dcs.length; j++) {

                    _DCs += "\n* " + dcs[j].dc;

                    for (var k = 0; k < dcs[j].technos.length; k++) {
                        var str = dcs[j].technos[k].name;
                        if (_technos.indexOf(str) < 0)
                            _technos += "\n* " + str;
                    }
                }
                data[i]._DCs = _DCs;
                data[i]._technos = _technos;
            }
            headers = ["bu", "business domain", "business capability", "name", "value", "emergency", "impact", "Digital capabilities", "technologies", "description", "id"];
            colWidths = [70, 100, 100, 200, 50, 50, 50, 150, 150, 200, 50];
            columns = [{
                data: "bu",
                readOnly: true
            }, {
                data: "BD"
            }, {
                data: "BC"
            }, {
                data: "name"
            }, {
                data: "value"
            }, {
                data: "emergency"
            }, {
                data: "impact"
            }, {
                data: "_DCs"
            }, {
                data: "_technos",

            }, {
                data: "description"
            }, {
                data: "id",
                readOnly: true
            }];

        } else if (spreadSheetdiv.id == "DCsSpreadsheet") {
            devisuProxy.loadData(dbName, "DC_technos", null, null);
            headers = ["techno", "DC", "id", "radar_id"];
            colWidths = [150, 150, 30];
            columns = [{
                data: "techno",
            }, {
                data: "DC"
            }, {
                data: "id",
                readOnly: true
            }, {
                data: "radar_id"

            }]

        } else if (spreadSheetdiv.id == "BCsSpreadsheet") {
            devisuProxy.loadData(dbName, "BCs", null, null);
            headers = ["bu", "BD", "BC", "id"];
            colWidths = [150, 150, 250, 30];
            columns = [{
                data: "bu",
            }, {
                data: "BD"
            }, {
                data: "BC"
            }, {
                data: "id",
                readOnly: true
            }

            ]

        }

        /*
         * $(spreadSheetdiv).handsontable({ data : data, minCols : 5, minRows : 10,
         * minSpareRows : 1, colHeaders : headers, rowHeaders : true, colWidths :
         * colWidths, contextMenu : [ "remove_row" ], columns : columns,
         * columnSorting : true, stretchH : "all", search : true, manualColumnResize :
         * true, beforeRemoveRow : deleteItem
         *
         * });
         */
        $(spreadSheetdiv).handsontable({
            data: data,
            minCols: 3,
            minRows: 10,
            minSpareRows: 1,
            colHeaders: headers,
            rowHeaders: true,
            colWidths: this.colWidths,
            contextMenu: ["remove_row"],
            columns: this.columns,
            columnSorting: true,
            stretchH: "all",
            search: true,
            manualColumnResize: true,
            beforeRemoveRow: deleteItem,
            renderAllRows: true
        });

    }

    self.UseCases_save = function (spreadSheetdiv) {

        var handsontable = $(spreadSheetdiv).data("handsontable");
        var data = handsontable.getData();

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var notNullline = false;
            for (var prop in item) {
                if (item[prop] != null && item[prop] != "")
                    notNullline = notNullline | true;
            }

            if (notNullline == false)
                return;

            if (spreadSheetdiv.id == "useCasesSpreadsheet") {
                return;

            } else if (spreadSheetdiv.id == "BCsSpreadsheet") {
                if (item.id) { // update
                    devisuProxy.updateItem(dbName, "BCs", item);
                } else { // add
                    devisuProxy.addItem(dbName, "BCs", item);
                }

            } else if (spreadSheetdiv.id == "DCsSpreadsheet") {
                if (item.id) { // update
                    devisuProxy.updateItem(dbName, "DC_technos", item);
                } else { // add
                    devisuProxy.addItem(dbName, "DC_technos", item);
                }

            }

        }
    }

    self.getUseCasePopupText = function () {
        var str = "<button onclick='hoverHide()'>X</button>&nbsp;<b>&nbsp;&nbsp;" + currentRadarNode.label + "</b>&nbsp;id=" + currentRadarNode.id + "<BR></b>";

        str += "&nbsp;Maturity <select id='useCaseModifiableAttrMaturity' onchange='modifyUseCaseCurrentNodeAttr(this)'>" + "<option>no interest</option>" + "<option>emerging</option>"
            + "<option>adolescent</option>" + "<option>first rollout</option>" + "<option>mainstream</option>" + "</select>";

        str += "&nbsp;Impact <select id='useCaseModifiableAttrImpact' onchange='modifyUseCaseCurrentNodeAttr(this)'>" + "<option> </option>" + "<option>traditionnal</option>"
            + "<option>disruptive</option>" + "<option>transformationnal</option>" + "</select>";

        str += "<script>setUseCaseModifiableAttrs();</script>";

        str += "<hr><font color='blue'><i>" + self.getUseCaseDescription() + "</i></font>";
        return str;
    }


    self.setUseCaseModifiableAttrs = function () {
        $("#useCaseModifiableAttrMaturity").val(currentRadarNode.maturity);
        $("#useCaseModifiableAttrImpact").val(currentRadarNode.impact);
    }

    self.modifyUseCaseCurrentNodeAttr = function (select) {
        var fieldJson = null;
        var val = "";
        if (mode != "write")
            return;
        if (select.id == "useCaseModifiableAttrMaturity") {
            val = $("#useCaseModifiableAttrMaturity option:selected").text();
            currentRadarNode.maturity = val;
            currentRadarNode.size = val;
            fieldJson = {
                maturity: val,
                size: val
            };
        } else if (select.id == "useCaseModifiableAttrImpact") {
            val = $("#useCaseModifiableAttrImpact option:selected").text();
            currentRadarNode.impact = val;
            currentRadarNode.color = val;
            fieldJson = {
                impact: val,
                color: val
            };
        }

        if (fieldJson) {
            devisuProxy.updateItemFields(dbName, currentRadarCollectionName, {
                id: currentRadarNode.id
            }, fieldJson);
            radarController.updateRadarPoint(currentRadarNode);
        }

    }

    self.getUseCaseDescription = function () {
        var detailsData = devisuProxy.loadData(dbName, "use_cases", {
            id: currentRadarNode.id
        });

        if (detailsData.length > 0 && detailsData[0]) {
            var str = "";
            str += "<B>" + detailsData[0].bu + "/" + detailsData[0].BD + "/" + detailsData[0].BC + "</B>";
            str += "<hr>";
            str += detailsData[0].description;
            str += "<hr>";

            var dcs = detailsData[0].dcs;
            var alltechnos = [];
            var strDcs = "";
            for (var i = 0; i < dcs.length; i++) {
                strDcs += "<li>";
                var strTechnos = "";
                var technos = dcs[i].technos;
                if (technos) {
                    for (var j = 0; j < technos.length; j++) {
                        if (j > 0)
                            strTechnos += ",";
                        strTechnos += technos[j].name;
                        if ($.inArray(technos[j].name, alltechnos) < 0)
                            alltechnos.push(technos[j].name);
                    }
                }

                strDcs += dcs[i].dc + "<font color='green'>[" + strTechnos + "]</font>";
                strDcs += "</li>";
            }

            str += "<B>Technologies</B>";
            str += "<ul>";
            for (var j = 0; j < alltechnos.length; j++) {
                str += "<li>";
                str += alltechnos[j];
                str += "</li>";
            }
            str += "</ul>";
            str += "<hr>";
            str += "<B>Digital capabilities</B>";
            str += "<ul>";
            str += strDcs;
            str += "</ul>";

            return str;
        } else
            return "";

    }

    self.onUseCaseTechnologiesSelected = function (select) {
        var technoId = $(select).val();
        /*
         * currentRadarNode = getObjectById(parseInt(technoId)); currentRadarNode =
         * getObjectDetailsId(parseInt(technoId));
         */
        currentRadarNode = useCasesTechnos["_" + technoId];
        self.copyNewCheckedDCsToOldDCs();
        self.setNewUseCaseDCsAndTeshnos();

    }

    self.setUseCaseTechnosSelect = function () {
        useCasesTechnos = {};
        if (false && dataArray && dataArray.length > 0 && dataArray[0].id) {// call
            // from
            // techno
            // radar
            technos = dataArray.slice();
        } else {
            currentYear = (new Date).getFullYear();

            devisuProxy.loadData(dbName, "technologies", {
                year: currentYear
            });
            if (technos.length == 0) {// on cherche l'année d'avantr si année en
                // cours vide
                currentYear = currentYear - 1;
                devisuProxy.loadData(dbName, "technologies", {
                    year: currentYear
                });
            }
        }
        technos2 = [];
        for (var i = 0; i < technos.length; i++) {
            if (!technos[i].id) {
                technos[i].id = technos[i].id;

            }
            if (!technos[i].label) {
                technos[i].label = technos[i].name;

            }
            if (!useCasesTechnos["_" + technos[i].id]) {
                technos2.push(technos[i]);
                useCasesTechnos["_" + technos[i].id] = technos[i];
            }

        }
        technos2.sort(function (a, b) {
            if (a.label < b.label)
                return -1;
            if (a.label > b.label)
                return 1;
            return 0;
        });
        technos2.splice(0, 0, "");

        common.fillSelectOptions(useCaseTechnologiesSelect, technos2, "label", "id");
        if (currentRadarNode) {

            for (var i = 0; i < technos2.length; i++) {
                if (technos2[i].label == currentRadarNode.label) {
                    useCaseTechnologiesSelect.options.selectedIndex = i;
                    break;
                }

            }
            self.onUseCaseTechnologiesSelected(useCaseTechnologiesSelect);
        }
    }

    self.generateFlattenedUseCasesCollection = function () {
        devisuProxy.deleteItemByQuery(dbName, "flattened_use_cases", {
            $where: "this.id>-1"
        });
        var detailsData = devisuProxy.loadData(dbName, "use_cases", {});
        for (var i = 0; i < detailsData.length; i++) {
            var useCase = detailsData[i];

            var dcs = useCase.dcs;
            if (!dcs)
                continue;
            for (var j = 0; j < dcs.length; j++) {
                var dc = dcs[j];
                var technos = dc.technos;
                if (!technos)
                    continue;
                for (var k = 0; k < technos.length; k++) {
                    var useCaseCloned = jQuery.extend(true, {}, useCase);
                    delete useCaseCloned.dcs;
                    delete useCaseCloned.id;
                    useCaseCloned.techno = technos[k].name;
                    useCaseCloned.dc = dc.dc;
                    devisuProxy.addItem(dbName, "flattened_use_cases", useCaseCloned);
                }
            }

        }
        console.log("-----------DONE------------")
    }

    self.getFlattenedUseCasesTechnos = function (query) {
        if (query == null)
            query = {};
        var result = [];
        var detailsData = devisuProxy.loadData(dbName, "use_cases", query);
        for (var i = 0; i < detailsData.length; i++) {
            var useCase = detailsData[i];
            var dcs = useCase.dcs;
            if (!dcs)
                continue;
            for (var j = 0; j < dcs.length; j++) {
                var dc = dcs[j];
                var technos = dc.technos;
                if (!technos)
                    continue;
                for (var k = 0; k < technos.length; k++) {
                    var useCaseCloned = jQuery.extend(true, {}, useCase);
                    delete useCaseCloned.dcs;
                    // delete useCaseCloned.id;
                    useCaseCloned.techno = technos[k].name;
                    useCaseCloned.techno_id = technos[k].id;
                    useCaseCloned.dc = dc.dc;
                    useCaseCloned.dc_id = dc.dc_id;
                    result.push(useCaseCloned);
                }
            }

        }
        return result;
    }

    self.getFlattenedUseCasesDCs = function (query) {
        if (query == null)
            query = {};
        var result = [];
        var detailsData = devisuProxy.loadData(dbName, "use_cases", query);
        for (var i = 0; i < detailsData.length; i++) {
            var useCase = detailsData[i];
            var dcs = useCase.dcs;
            if (!dcs)
                continue;
            for (var j = 0; j < dcs.length; j++) {
                var dc = dcs[j];
                var useCaseCloned = jQuery.extend(true, {}, useCase);
                delete useCaseCloned.dcs;
                // delete useCaseCloned.id;
                useCaseCloned.dc = dc.dc;
                useCaseCloned.dc_id = dc.dc_id;
                result.push(useCaseCloned);

            }

        }
        return result;
    }

    self.condensateUseCases = function (query) {
        var data = devisuProxy.loadData(dbName, "use_cases", query);
        for (var i = 0; i < data.length; i++) {
            var line = data[i];
            if (!line.BC)
                line.BC = "?";
            if (!line.dcs)
                continue;
            var newDcs = {};

            for (var j = 0; j < line.dcs.length; j++) {
                if (!newDcs[line.dcs[j].dc_id]) {
                    newDcs[line.dcs[j].dc_id] = line.dcs[j];
                } else {
                    var newTechnos = {};
                    if (!line.dcs[j].technos)
                        continue;
                    for (var k = 0; k < line.dcs[j].technos.length; k++) {
                        if (!newTechnos[line.dcs[j].technos[k].id]) {
                            newTechnos[line.dcs[j].technos[k].id] = line.dcs[j].technos[k];

                        } else {
                            // on ne fait rien la techno y est déjà
                        }
                        newDcs[line.dcs[j].dc_id].technos = []
                        for (var prop in newTechnos) {
                            newDcs[line.dcs[j].dc_id].technos.push(newTechnos[prop]);
                        }

                    }

                }

            }
            data[i].dcs = []
            for (var prop in newDcs) {
                data[i].dcs.push(newDcs[prop]);
            }
        }
        return data
    }

    self.generateUseCasesCloudCollection = function (data) {
        devisuProxy.deleteItemByQuery(dbName, "use_cases_cloud", {
            $where: "this.id>-1"
        });
        for (var i = 0; i < data.length; i++) {
            var useCase = data[i];
            devisuProxy.addItem(dbName, "use_cases_cloud", useCase);
        }

        console.log("-----------DONE------------")
    }

    self.tempUpdateTreedata = function () {

    }
    return self;
})()