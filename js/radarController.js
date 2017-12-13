var radarController = (function () {
    var self = {};
    self.showExcludedRadarPoints = false;
    self.joinedData = [];
//moved  var version = "";
//moved  var dataArray;
//moved  var currentObject;
//moved  var radarPaper;
//moved  var legendPaper;
//moved  var imgWidth;
//moved  var imgHeight;
//moved  var mode;
//moved  var drawArc;
//moved  var radarDiv;

//moved  var year = "2014";
//moved  var version = "general";
//moved  var bu = "Groupe";
//moved  var testDeCharge = false;
//moved  var multiValuedFieldSep = ",";
//moved  var currentRadarItemData;
//moved  var radarModelName;
//moved  var xmlFilePath;
//moved  var collectionName;
//moved  var currentBC = null;

//moved  var technoDisplayMode = "technologies";
//moved  var currentObjectId;

//moved  var srcIsLoaded = false;
// technoDisplayMode = "pack";
// technoDisplayMode = "tree";

    radarXmls = {};

    self.reloadRadar = function () {
        self.Radar_loadRadar(xmlFilePath, radarModelName, {})
    }


    self.Radar_loadRadar = function (_xmlFilePath, _radarModelName, jsonQuery) {

        radarModelName = _radarModelName;
        if (radarModelName == "Technologies")
            var xx = "aa"

        var aRadarXml = new RadarXml(_xmlFilePath, radarModelName);
        if (!aRadarXml) {
            common.setMessage("cannot load XML model " + _xmlFileName, "red");
            return;
        }
        radarXmls[radarModelName] = aRadarXml;
        xmlFilePath = _xmlFilePath;
        collectionName = radarXmls[radarModelName].collectionName;
        type = radarXmls[radarModelName].type;

        if (!jsonQuery)
            jsonQuery = {};

        if (queryParams.year)
            jsonQuery.year = parseInt(queryParams.year);
        if (queryParams.bu)
            jsonQuery.bu = queryParams.bu;
        if (queryParams.version)
            jsonQuery.version = queryParams.version;
        if (queryParams.type)
            jsonQuery.type = queryParams.type;
        if (queryParams.graph)
            technoDisplayMode = queryParams.graph;
        if (queryParams.graph)
            treeFistLevel = queryParams.treeFistLevel;

        devisuProxy.getRadarPoints(dbName, radarModelName, collectionName, jsonQuery,
            self.initRadar);
        radarLoaded = true;

    }

    self.initRadar = function (d) {

   //     console.log("----result " + d[0].points.length);


        if (true) {
            if (collectionName == "use_cases") {
                var r_UC_T_DC_Data = devisuProxy.loadData(dbName, "r_UC_T_DC", {});
                var ucData = d[0].points;
                var joinData = util.joinData(ucData, "id", r_UC_T_DC_Data, "UC_id");
                if (joinData)
                    self.joinedData = joinData;

            }

        }

    /*    for(var i=0;i<d[0].points.length;i++){
            var point=d[0].points[i]
            if( point.name=="Formation operateurs sur tablette"){
                xxx="aa";
            }
        }*/


        radarFilterController.buildFilters("radarFiltersTree", collectionName, infosGenericParams.filters[collectionName]);
        if (!d[0]) {
            common.setMessage("No radar data loaded", "red");
            return;
        }

        dataArray = d[0].points;
        if (processDataBeforeDrawingCallback) {
            processDataBeforeDrawingCallback(dataArray);
        }

        if (d[0].shouldSetItemsCoordinates
            && d[0].shouldSetItemsCoordinates == "yes") {
            //  $(resetItemsCoordinates).prop("checked", "checked");
        }
        //    radarFilters.setEnumIdsAndInitFilters();

        self.drawPoints();
        //   radarFilters.drawFilters();
        /*   $("#radarFilterOperatorsDiv").dialog({
         autoOpen: false,
         modal: true,
         show: "blind",
         hide: "blind"
         });*/


    }


    self.displayInfos = function (id, name) {
        if (radarModelName == "UseCases") {
            $(attrsIFrame).prop('contentWindow').infosUseCase.execute(null, name);
        }
        else if (radarModelName == "Technologies") {
            $(attrsIFrame).prop('contentWindow').infosTechno.execute(null, name);
        }

        else if (radarModelName == "ScenariosArch") {
            ; // $(attrsIFrame).prop('contentWindow').infosScenarioArch.execute(null);
        }

        else if (radarModelName == "ScenariosRadar") {
            $(attrsIFrame).prop('contentWindow').infosScenarioRadar.execute(null, name);
        }

    }


    self.resetCoordinates = function () {
        resetItemsCoordinates
    }
    self.drawPoints = function () {


        if (technoDisplayMode == "technologies") {
            self.drawRadar(radarDiv);
            self.drawLegend(radarDiv);
        } else if (technoDisplayMode == "pack") {
            $("#legend").css("visibility", "hidden");
            $("#paramsDiv").css("visibility", "hidden");
            $("#radar").css("width", "1020px");
            $("#radar").css("height", "580px");
            d3packTechnos.drawD3PackGraph();
        } else if (technoDisplayMode == "tree") {
            $("#legend").css("visibility", "hidden");
            $("#paramsDiv").css("visibility", "hidden");
            $("#radar").css("width", "1020px");
            $("#radar").css("height", "580px");
            d3packTechnos.drawD3TreeGraph();
        }
    }

    self.loadBCs = function () {
        var bcs = devisuProxy.loadData(dbName, "BC_HD", {});
        var names = [""];
        for (var i = 0; i < bcs.length; i++) {
            var str = bcs[i].Processus;
            if (str.length > 20)
                str = str.substring(0, 30) + "...";
            names.push(str);
        }
        names.sort();
        common.fillSelectOptions(radarBCselect, names);

    }

    self.getRadarDescription = function () {

        var detailsData = devisuProxy.loadData(dbName, "radarDetails", {
            id: currentRadarNode.id
        });
        if (detailsData.length > 0 && detailsData[0])
            return detailsData[0].inf_corps
        else
            return "";
    }

    self.getOtherRadarPopupInfo = function (data) {
        var str = "<button onclick='hoverHide()'>X</button><br>";
        var fields = self.getFieldsArray(data);
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];

            for (var key in field) {
                if (key == "type")
                    continue;
                if (field.type == "B") {
                    str += "<B>";
                } else if (field.type == "I") {
                    str += "<I>";
                }
                str += "<u>" + key + "</u>" + " : " + field[key] + "<br>";
                if (field.type == "B") {
                    str += "</B>";
                }
                if (field.type == "I") {
                    str += "</I>";
                }
            }

        }

        return str;
    }

    self.getFieldsArray = function (data) {
        var data = devisuProxy.loadData(dbName, "technologies", {
            id: data.id
        });
        if (data.length == 0)
            return;
        data = data[0];
        var fields = [];
        var blackList = ["color", "x", "y", "size", "enumIds", "enumIds",
            "visible", "previousState", "size2"];

        for (var key in data) {
            if (blackList.indexOf(key) > -1)
                continue;
            var value = data[key];
            var obj = {};
            obj[key] = value;

            if (key == "name") {
                obj.type = "B";
                fields.splice("0", 0, obj);
            } else if (key == "id") {
                obj.type = "I";
                fields.splice("1", 0, obj);
            } else {
                fields.push(obj);
            }

        }
        return fields;
    }

    self.getFormHTML = function (data) {
        var str = "<button onclick='hoverHide()'>X</button>&nbsp;";
        self.getFieldsArrayieldsArray(data);
        for (var i = 0; i < fields.length; i++) {
            common.getInputFieldgetInputField(radarXmlUrl, key, val, isTextArea, className);
            str += fieldStr + "<BR>";
        }

        return str;

    }

    self.getDCPopupText = function (withDcCbx, existingUseCases) {

        var dcData = devisuProxy.loadData(dbName, "DC_technos", {
            radar_id: currentRadarNode.id
        });

        var str = "<button onclick='hoverHide()'>X</button>&nbsp;<b>&nbsp;&nbsp;"
            + currentRadarNode.label + "<BR></b>" + self.getTechoModifiableAttrs()
            + "</b>&nbsp;id=" + currentRadarNode.id
            + "<hr> digital capabilities :<ul>";
        for (var i = 0; i < dcData.length; i++) {
            varCbxText = "";
            if (withDcCbx) {
                varCbxText = "<input class='cbx-dc' type='checkBox' label='"
                    + dcData[i].DC + "' id='dc_cbx_" + dcData[i].dc_id + "'>";
            }
            existingTechnosForBC = [];
            if (existingUseCases) {
                for (var j = 0; j < existingUseCases.length; j++) {
                    for (var k = 0; k < existingUseCases[j].DCs.length; k++) {
                        if (existingUseCases[j].DCs[k].id == dcData[i].dc_id) {
                            existingTechnosForBC.push(existingUseCases[j].techno)
                        }
                    }
                }

            }
            str += "</b>";
            if (existingTechnosForBC.length > 0) {
                var techsSrtr = "<ul>";
                for (var j = 0; j < existingTechnosForBC.length; j++) {
                    techsSrtr += "<li>" + existingTechnosForBC[j] + "</li>";
                }
                techsSrtr += "</ul>";
                str += "<li><font color='blue'><B>" + varCbxText + dcData[i].DC
                    + "</B>" + techsSrtr + "</font>" + "</li>";
            } else
                str += "<li>" + varCbxText + dcData[i].DC + "</li>";
        }
        str += "</ul>";
        str += "<hr><font color='blue'><i>" + self.getRadarDescription() + "</i></font>";
        return str;
    }

    self.closeIFrameTechnosInfo = function (node) {
        if (node) {
            radarController.updateRadarPoint(node);
        }

        $("#technosInfoIframe").remove();
        radarController.popupHidee();

    }

    self.getTechoModifiableAttrs = function () {

        var str = "&nbsp;Maturity <select id='techoModifiableAttrMaturity' onchange='modifyCurrentNodeAttr(this)'>"
            + "<option>no interest</option>"
            + "<option>emerging</option>"
            + "<option>adolescent</option>"
            + "<option>first rollout</option>"
            + "<option>mainstream</option>" + "</select>"
        str += "&nbsp;Priority <select id='techoModifiableAttrPriority' onchange='modifyCurrentNodeAttr(this)'>"
            +

            "<option>low</option>"
            + "<option>medium</option>"
            + "<option>high</option>" + "</select>";

        str += "<script>setTechoModifiableAttrs();</script>";
        return str;
    }

    self.setTechoModifiableAttrs = function () {
        $("#techoModifiableAttrPriority").val(currentRadarNode.priority);
        $("#techoModifiableAttrMaturity").val(currentRadarNode.maturity);
    }

    self.modifyCurrentNodeAttr = function (select) {
        var fieldJson = null;
        var val = "";
        if (mode != "write")
            return;
        if (select.id == "techoModifiableAttrPriority") {
            val = $("#techoModifiableAttrPriority option:selected").text();
            currentRadarNode.priority = val;
            currentRadarNode.size = val;
            fieldJson = {
                priority: val,
                size: val
            };
        } else if (select.id == "techoModifiableAttrMaturity") {
            val = $("#techoModifiableAttrMaturity option:selected").text();
            currentRadarNode.maturity = val;
            currentRadarNode.color = val;
            fieldJson = {
                maturity: val,
                color: val
            };
        }

        if (fieldJson) {
            devisuProxy.updateItemFields(dbName, collectionName, {
                id: currentRadarNode.id
            }, fieldJson);
            radarController.updateRadarPoint(currentRadarNode);
        }

    }

    self.addItem = function () {
        var json = devisuProxy.addNewRadarItem(dbName);

        self.Radar_loadRadarr();

    }

    self.Radar_updateCoordinates = function (id, dx, dy) {
        if (dx == 0 && dy == 0)
            return;
        var obj = self.getObjectById(id);
        if (obj) {
            obj.x = 0 + Number(obj.x) + dx;
            obj.y = 0 + Number(obj.y) + dy;
            devisuProxy.updateRadarCoordinates(dbName, collectionName, id, obj.x, obj.y);

        }

    }

    self.Radar_updateComment = function () {
        if (!currentObject)
            return;
        var comment = document.getElementById("CF_details_textArea").value;
        var id = currentObject.id;
        var p = comment.indexOf("[");
        var q = comment.indexOf("]");
        if (p > -1 && q > -1) {
            var link = comment.substring(p + 1, q);
            var comment2 = comment.replace("[" + link + "]", "");
            currentObject.comment = comment2;
            currentObject.link = link;

        } else {
            currentObject.comment = comment;
        }

        var p = comment.indexOf("<");
        var q = comment.indexOf(">");
        if (p > -1 && q > -1) {
            var symbol = comment.substring(p + 1, q);
            var comment2 = comment.replace("<" + symbol + ">", "");
            currentObject.comment = comment2;
            currentObject.symbol = symbol;
            // updatePoint(id);

        } else {
            currentObject.comment = comment;
        }
        comment = encodeURIComponent(comment);
        devisuProxy.updateRadarComment(dbName, collectionName, id, comment);

    }

    self.getObjectById = function (id) {
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].id == id) {
                currentObject = dataArray[i];
                return dataArray[i];
            }
        }
        return;
    }
    self.getObjectDetailsId = function (id) {
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].id == id) {
                currentObject = dataArray[i];
                return dataArray[i];
            }
        }
        return;
    }

    self.complete3Attrs = function (data) {
        // return data;
        for (var i = 0; i < data.length; i++) {


            var point = data[i];





            if (!point.x || !point.y || point.x < 15) {
                var point = radarBackground.getZoneCenter(point[radarBackground.xfield], point[radarBackground.rfield]);

                if (!point) {
                    point = radarBackground.randomizePosition({x: 10, y: 100}, 20);
                }
                data[i].x = point.x;
                data[i].y = point.y;
            }
        }

        return data;

    }


    self.drawRadar = function (radarDiv) {
        /*
         * if (resetItemsCoordinates!=null &&
         * $(resetItemsCoordinates).prop("checked")) {
         * $(resetItemsCoordinates).removeAttr("checked"); if (confirm("CONFIRM :
         * Reset points positions")) setItemsCoordinates(dataArray); }
         */
        radarBackground.drawBackground(radarDiv);
        dataArray = self.complete3Attrs(dataArray);

     //   console.log("--------dataArray" + dataArray.length)
        d3radar.drawRadarD3(dataArray, radarDiv);


    }


    self.drawLegend = function (radarDiv) {
        var emumDomElements = radarXmls[radarModelName].Xml_getLegendElements();
        var data = [];
        var currentType = "XXXXX";
        for (var i = 0; i < emumDomElements.length; i++) {
            var obj = {
                type: emumDomElements[i].getAttribute("type"),
                label: emumDomElements[i].getAttribute("label"),
                color: emumDomElements[i].getAttribute("color"),
                size: emumDomElements[i].getAttribute("size"),
            }

            data.push(obj);
        }

        d3radar.drawLegendD3(data);

    }

    self.drawLegendOld = function () {
        var emumDomElements = radarXmls[radarModelName].Xml_getLegendElements();
        var data = []
        for (var i = 0; i < emumDomElements.length; i++) {
            var aType = emumDomElements[i].getAttribute("type");
            if (aType != currentType) {
                if (data.length > 0)
                    radarController.drawLegendD3nd3(data);
                radarController.drawLegendType(aType);
                currentType = aType;

                data = [];
                data.push(emumDomElements[i].attributes);

            } else {
                data.push(emumDomElements[i].attributes);
            }
        }
        if (data.length > 0)
            radarController.drawLegendD3(data);

    }

    self.setPositionControMode = function (cb) {
        d3radar.positionControMode = $('input[name=positionControlMode]:checked').val();


    }
    self.toogleShowExcluded = function (cb) {
        self.showExcludedRadarPoints = ($(cb).is(':checked'));
        d3radar.setRadarPointsVisbility();

    }

    self.Radar_setModifyMode = function () {
        var elt = document.getElementById("fieldsInput");
        radarXmls[radarModelName].XML_buildFieldsTable(elt, currentObject, true);
        document.getElementById("editButtonsFormModify").style.visibility = "hidden";
        document.getElementById("editButtonsFormOK").style.visibility = "visible";
    }

    /*
     * function Radar_updateFields() {
     *
     * var form = document.forms["editForm"]; var id = form.elements["id"].value;
     * var obj = getItemById(id); var id = -1; for (var i = 0; i <
     * form.elements.length; i++) { var key = form.elements[i].name; var value =
     * form.elements[i].value;
     *
     * if (key == "id") { if (value == "") // bug du browser (Chrome et IE) id =
     * value; } if (value != "" + obj[key]) {
     *
     *
     * obj[key] = value; var role = XML_getFieldRole(key); if (role) { obj[role] =
     * value; } } } updateItemJsonFromRadar(dbName,collectionName, id, obj);
     *
     * hideInfoPopup('fieldDetails');
     * document.getElementById("editButtonsFormOK").style.visibility = "hidden";
     * document.getElementById("editButtonsFormModify").style.visibility = "hidden";
     * drawRadar(); }
     */

    self.hideRadarPopup = function () {
        $("#details").css("visibility", "hidden");
        $("#radarHoverPopup").css("visibility", "hidden");
        currentRadarNode = null;
//	hideRadarDetailsSpreadSheetDiv(true);
    }
    self.showRadarData = function (data) {
        currentJoin = null;
        currentRadarItemData = data;
        $("#details").css("visibility", "visible");
        //setLinkedObjectButtons("technologies", "linkedObjectButtons");
        //importSvg("#radarDetailsDiv", "radarBase");
        //showData("technologies", data.id);
    }

    /*
     * function showRadarDetailsData(){ $("#details").css("visibility","visible");
     * importSvg("#radarDetailsDiv","radarDetails");
     * setLinkedObjectButtons("technologies","linkedObjectButtons");
     * showData("radarDetails",currentDetailsItem.id ); }
     */

    self.validateRadarData = function () {
//	devisuProxy.saveDetailsData();
        self.hideRadarPopup();
    }

    self.getPrintRadarImage = function () {
        var svgSrc = radarController.getRadarImg();
        console.log(svgSrc);
        canvg('canvas', svgSrc);
        var canvasDiv = document.getElementById("canvas");
        var img = canvasDiv.toDataURL("image/png");
        img = img.replace(/^data:image\/png;base64,/, "");
        img += img.replace('+', ' ');
        // img=img.replace('image/png','image/octet-stream');
        // var imgBinaryArray=base64DecToArr(img);
        var imgBinaryArray = window.atob(img);
        // $("#imgBin").html(imgBinaryArray);
        // document.write('<img src="'+img+'"/>');
        var txt = "<button onclick='printRadarImage()'>print</button><br><div id='imgPrintDiv'><img id='radarImage' src='data:image/png;base64,"
            + imgBinaryArray + "'/></div>";

        $("#details").html(txt);
        $("#details").css("visibility", "visible");

    }
    self.printRadarImage = function () {
        var www = $('#imgPrintDiv');
        $('#imgPrintDiv').printElement();

    }

    self.removePoint = function (id) {
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].id == id) {
                dataArray[i].deleted = true;
            }
        }
        self.drawRadar();

    }

    self.onClickPointInRadar = function (obj) {
        $('#tabs-radarLeft').tabs({
            active: 2
        });
        self.onCtlClickPointInRadar(obj);


    }

    self.onCtlClickPointInRadar = function (obj) {

        if (radarModelName == "UseCases") {
            $(attrsIFrame).prop('contentWindow').infosUseCase.execute(obj.id);
        }
        else if (radarModelName == "Technologies") {
            $(attrsIFrame).prop('contentWindow').infosTechno.execute(obj.id);
        }

        else if (radarModelName == "ScenariosArch") {
            $(attrsIFrame).prop('contentWindow').infosScenarioArch.execute(obj.id);
        }

        else if (radarModelName == "ScenariosRadar") {
            $(attrsIFrame).prop('contentWindow').infosScenario.execute(obj.id);
        }


    }
    self.onAltClickPointInRadar = function (obj) {
        // $(attrsIFrame).prop('contentWindow').execute(obj);

    }

    self.generateSVG = function () {
        $(attrsIFrame).prop('contentWindow').generateSVG();
    }

    self.showDialog = function () {
        $("#dialogGlobal").dialog("open");//.parent();//.position({my: 'center', at: 'center', of: '#tabs-radarRight'});
    }

    self.exportCsv = function (format) {
        if (!format)
            format = "csv";
        if (format == "screen") {
            var strTable = '<table id="dataTableTable"></table>'
            $("#dialogGlobalContent").html(strTable);
            $("#dialogGlobalContent").css("width", "600px")
            $("#dialogGlobal").dialog('option', 'title', 'Technology Digital Capabilities');
            $("#dialogGlobal").dialog("open");
        }

        ImportExport.exportCollection(dbName, collectionName, false, format, null)

    }

    return self;
})()