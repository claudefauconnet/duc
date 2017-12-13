var infosUseCase = (function () {
    var self = {};
    var dbName;

// depends on infosGeneric.js

//moved  var CURRENT_YEAR=2017
//moved  var queryParams = getQueryParams(document.location.search);
//moved  var dbName = queryParams.dbName;

//moved  var useCaseId = parseInt(queryParams.objectId);
//moved  var technoId = parseInt(queryParams.technoId);
//moved  var bcId = parseInt(queryParams.bcId);

//moved  var currentUseCase;
//moved  var currentTechno;
//moved  var currentBC;

//moved  var currentYear = CURRENT_YEAR;

    /*
     * var currentBC; var currentBD; var currentBU;
     */

//moved  var dcsToCopy = "";
//moved  var cbxTechnos = [];
    var cbxTechnos = {};

    $(function () {
    	  var  queryParams = common.getQueryParams(document.location.search);
    	if (!queryParams.dbName)
    	    dbName = "POT"+Gparams.CURRENT_YEAR;
    	dbName = queryParams.dbName;
        if (!useCaseId)
            useCaseId = -1;
        self.execute(useCaseId)


    });



    self.execute = function (objId) {
        useCaseId = objId;
        $("#attrsTabMessage", window.parent.document).html("");
        $("#idSpan").html(objId)
        self.fillAccordion(objId);
        $("#accordion").accordion();
    }


    self.useCaseDesc = {
        name: {
            "value": "",
            type: "text",
            cols: 50,
            rows: 2

        },

        description: {
            "value": "",
            type: "text",
            cols: 50,
            rows: 5
        },
        currentSituation: {
            "value": "",
            type: "text",
            cols: 50,
            rows: 4
        },
    }

  self.useCaseAttrs= {

        businessValue: {
            "value": "",
            type: "readOnly",
        },
        horizon: {
            "value": "",
            type: "readOnly",
        },
        priority: {
            "value": "",
            type: "select",
            list: "priority"
        },

        riskLevel: {
            "value": "",
            type: "select",
            list: "level",
        },

        easeOfImpl: {
            "value": "",
            type: "select",
            list: "level"
        },

    };



  /*  self.selectOptionValues = {
        level: [{
            value: 1,
            text: "low"
        }, {
            value: 2,
            text: "medium"
        }, {
            value: 3,
            text: "high"
        }],
        TLR: [{
            value: 1,
            text: "TLR1"
        }, {
            value: 2,
            text: "TLR2"
        }, {
            value: 3,
            text: "TLR3"
        }, {
            value: 4,
            text: "TLR4"
        }, {
            value: 5,
            text: "TLR5"
        }, {
            value: 6,
            text: "TLR6"
        }, {
            value: 7,
            text: "TLR7"
        },],
        priority: [{
            value: 1,
            text: "would"
        }, {
            value: 2,
            text: "could"
        }, {
            value: 3,
            text: "should"
        }, {
            value: 4,
            text: "must"
        },]

    }*/


    self.fillAccordion = function () {

        if (typeof infosGeneric == 'undefined')
            return;

        if (technoId) {
            var technoData = devisuProxy.loadData(dbName, "technologies", {
                id: technoId
            });
            currentTechno = technoData[0];
        }

        if (useCaseId) {
            var useCaseData = devisuProxy.loadData(dbName, "use_cases", {
                id: useCaseId
            });
            currentUseCase = useCaseData[0];

        }

        if (bcId) {

            var bcData = devisuProxy.loadData(dbName, "use_cases_tree", {
                type: "BC", id: bcId
            });

            var obj = bcData[0];
            currentBC = {
                //	bu_id:obj.id,
                bu: obj.data.obj.bu,
                BD: obj.data.obj.BD,
                BC: obj.data.obj.BC,
                BC_id: obj.data.obj.BC_id,
                BD_id: obj.data.obj.BD_id

            }
            console.log(bcId, currentBC)
        }



        infosGeneric.setAttributesValue("use_cases",currentUseCase,self.useCaseDesc);
        infosGeneric.drawAttributes(self.useCaseDesc,"descriptionDiv");


        infosGeneric.setAttributesValue("use_cases",currentUseCase,self.useCaseAttrs);
        infosGeneric.drawAttributes(self.useCaseAttrs,"AttrsSpan");


     //   self.drawDescription();
        if (currentUseCase) {
            self.setOldUseCaseDCsAndTeshnos();
            self.setUseCaseTechnosSelect();
            $("#idSpan").html(currentUseCase.id);

            $("#nameRead").html(currentUseCase.name);
        }


    }


   /* self.drawDescription = function () {
        var str = "<table>"
        for (var key in self.useCaseDesc) {
            strVal = self.useCaseDesc[key].value;
            str += "<tr><td>" + key + "</td></tr><tr><td>" + strVal + "</td></tr>";
        }
        str += "</table>";
        $("#descriptionDiv").html(str);
    }*/

    self.setUseCaseTechnosSelect = function () {
      if (typeof useCaseTechnologiesSelect == 'undefined')
            return;
        var useCasesTechnos = {};
        var technos = devisuProxy.loadData(dbName, "technologies", {});

        technos2 = [];
        for (var i = 0; i < technos.length; i++) {
            if (!technos[i].id) {
                technos[i].id = technos[i].id;

            }

            if (!useCasesTechnos["_" + technos[i].id]) {
                technos2.push(technos[i]);
                useCasesTechnos["_" + technos[i].id] = technos[i];
            }

        }
        technos2.sort(function (a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        technos2.splice(0, 0, "");

        common.fillSelectOptions(useCaseTechnologiesSelect, technos2, "name", "id");
        if (technoId) {

            for (var i = 0; i < technos2.length; i++) {
                if (technos2[i].id == technoId) {
                    useCaseTechnologiesSelect.options.selectedIndex = i;
                    break;
                }

            }
            // onUseCaseTechnologiesSelected(useCaseTechnologiesSelect);
        }
    }
    self.setNewUseCaseDCsAndTechnos = function () {
        var technoId = parseInt($("#useCaseTechnologiesSelect").val());
        var dcData = devisuProxy.loadData(dbName, "r_T_DC", {
            techno_id: technoId
        });

        var DCtext = "<ul>";
        var checked = "";
        var techsSrtr = "";
        var technoObjs = [];
        var techIds = [];
        for (var i = 0; i < dcData.length; i++) {
            if ($.inArray(dcData[i].techno_id, techIds) < 0) {
                technoObjs.push({
                    name: dcData[i].techno_name,
                    id: dcData[i].techno_id
                });
                techIds.push(dcData[i].techno_id);
                techsSrtr += dcData[i].techno_name;
            }


            var cbxid = "dc_cbx_" + dcData[i].dc_id;
            var li_id = "dc_cbx_" + dcData[i].dc_id;
            cbxTechnos[cbxid] = technoObjs;
            var cbxEvt = "onclick='infosUseCase.onNewCbxClicked(this)'";
            var CbxText = "<input class='cbx-dc cbx-dc-new' type='checkBox' "
                + cbxEvt + "  " + checked + "label='" + dcData[i].dc_name
                + "' id='" + cbxid + "'>";

            DCtext += "<li id='li_" + cbxid + "' class='liNew'><font color='blue'>"
                + CbxText + dcData[i].dc_name + "</font><font color='green'>["
                + techsSrtr + "]</font>" + "</li>";

        }
        DCtext += "</ul>";

        $("#ulNewDcs").html(DCtext);

    }

     self.setOldUseCaseDCsAndTeshnos=function() {
        if (!currentUseCase)//|| !currentUseCase.dcs)
            return;
        $("#ulOldDcs").html(dcsToCopy);
        dcsToCopy = "";

        var DCtext = "";


        var UCtechnosDCs = devisuProxy.loadData(dbName, "r_UC_T_DC", {
            UC_id: currentUseCase.id
        });

        var technoObjs = [];
        var techIds = [];

        var checked = "checked='checked'";

        for (var i = 0; i < UCtechnosDCs.length; i++) {
            var techsSrtr = "";


            if ($.inArray(UCtechnosDCs[i].techno_id, techIds) < 0) {
                technoObjs.push({
                    name: UCtechnosDCs[i].techno_name,
                    id: UCtechnosDCs[i].techno_id
                });
                techIds.push(UCtechnosDCs[i].techno_id);
                techsSrtr += UCtechnosDCs[i].techno_name + ",";
            }


            if (techsSrtr.length > 0)
                techsSrtr = techsSrtr.substring(0, techsSrtr.length - 1);

            var cbxid = "dc_cbx_" + UCtechnosDCs[i].DC_id;

            cbxTechnos[cbxid] = technoObjs;
            var cbxEvt = "";

            var CbxText = "<input class='cbx-dc'  type='checkBox' " + checked
                + "label='" + UCtechnosDCs[i].DC_name + "' id='" + cbxid
                + "'>";

            DCtext += "<li><font color='blue'>" + CbxText
                + UCtechnosDCs[i].DC_name
                + "</font><font color='green'><B>[" + techsSrtr
                + "]</B></font>" + "</li>";

        }



        $("#ulOldDcs").append(DCtext);

    }

    self.onNewCbxClicked=function(cbx) {
        var liCbx = $("#li_" + cbx.id);
        $(cbx).attr("class", "cbx-dc");
        var xxx = liCbx;
        jQuery(liCbx).detach().prependTo('#ulOldDcs')

    }


    self.saveUseCase=function() {
        if (!currentUseCase)
            currentUseCase = {};
        // var currentBC = currentBC;

        var cbxDcs = $(".cbx-dc");

        var radarUsecaseName = $("#attr_name").val();
        if (radarUsecaseName == "") {
            alert("name is mandatory");
            return;
        }

        infosGeneric.setModifiedValues(currentUseCase, ".useCaseDesc");
        infosGeneric.setModifiedValues(currentUseCase, ".objAttr");

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

        if (currentUseCase.BC_id) {// update
            currentUseCase.dcs = dcs;
            devisuProxy.updateItemem(dbName, "use_cases", currentUseCase);

        } else {// new.
            //currentUseCase.bu_id = currentBC.bu_id;
            currentUseCase.bu = currentBC.bu;
            currentUseCase.year = currentYear;
            currentUseCase.BD = currentBC.BD;
            currentUseCase.BC = currentBC.BC;
            currentUseCase.BC_id = currentBC.BC_id;
            currentUseCase.BD_id = currentBC.BD_id;
            currentUseCase.dcs = dcs;

            var newObj = devisuProxy.addItem(dbName, "use_cases", currentUseCase);
            /*
             * var childTreeNode2 = jQuery.extend(true, {}, childTreeNode);
             * addChildToTree(null, childTreeNode, 1);
             * treeData.push(childTreeNode2); saveUseCasesTree(treeData);
             */

            currentUseCase.id = newObj.id;
            newUseCase = currentUseCase;
            window.parent.addItemToTree(window.parent.parentTreeNode,
                currentUseCase, "UC");

            // addItemToTree(currentTreeNode, useCase, "UC");

        }
        window.parent.reloadRadar();
        // hoverHide();
        parent.closeIFrameTechnosInfo(currentUseCase);
        $("#attrsTabMessage", window.parent.document).html("uses case saved");
        // parent.updateRadarPoint(currentUseCase);
        // window.parent.hideUseCaseDetails();

    }

    self.deleteUseCase = function () {
        if (confirm("do you want to delete use case " + currentUseCase.name)) {
            devisuProxy.deleteItemem(dbName, "use_cases", currentUseCase.id);
        }
        window.parent.reloadRadar();
        $("body").html("");
        $("#attrsTabMessage", window.parent.document).html("Click a point to see its data");

    }

    self.processTexts = function (technoDoc) {

        if (technoDoc.dcs) {
            var str = "";
            for (var i = 0; i < technoDoc.dcs.length; i++) {
                str += technoDoc.dcs[i].dc_name + ";";
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

        for (var key in technoDoc) {// pour tous les champs
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


    return self;
})()
