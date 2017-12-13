var radarFilters = (function () {
    var self = {};
// **************************************FILTERS***************************************
//moved  var filterDiv ;
//moved  var filters;
//moved  var nRightFilters = 0;
//moved  var oldEnumFieldName;
//moved  var oldLeftFilterName = "";
//moved  var currentfilterType;
//moved  var leftFilterParams;
//moved  var rightFilterParams;
//moved  var currentFilters=[];
    self.getFilterLogicMode = function () {
        /*var mode = "only";
         var operators = $('[name="filterOperator"]');
         for (var i = 0; i < operators.length; i++) {
         if (operators[i].checked)
         mode = operators[i].value;

         }
         return mode;*/


        var index = 0;
        var cbx_filters = $('[name="cbx_filters"]');
        for (var i = 0; i < cbx_filters.length; i++) {
            if (cbx_filters[i].checked)
                index++;

        }
        var mode = "only";

        if (index > 1)
            mode = "and";
        return mode;

    }


    self.getFiltersJSon = function () {

    }

    self.showLeftFilterDialog = function (field, currentVal, isMultiValuedData, dontDraw) {
        leftFilterParams = {
            field: field,
            currentVal: currentVal,
            isMultiValuedData: isMultiValuedData,
            dontDraw: dontDraw
        }

        var filterOperators = $("input[name=filterOperator]");
        for (var i = 0; i < filterOperators.length; i++) {
            $(filterOperators[i]).prop("checked", false);
        }

        /*
         * $("#filterOperator").find("input:radio").prop("checked", false).end();
         * try{$("#filterOperator").buttonset("refresh");} catch(e){
         *  }
         */
        //
        $("#radarFilterOperatorsDiv").dialog("open");
    }

    self.showRightFilterDialog = function (enumId) {
        rightFilterParams = {
            enumId: enumId,
        }
        $("#radarFilterOperatorsDiv").dialog("open");

    }

    self.applyFilter = function () {

        if (leftFilterParams)
            self.applyLeftFilter();
        if (rightFilterParams)
            self.applyRightFilter();
        //$("#radarFilterOperatorsDiv").dialog("close");

        if (technoDisplayMode == "tree") {
            d3packTechnos.filterGraph(currentFilters);
        }
    }

// filtres cumulatifs de droite (symboles...)
    self.applyRightFilter = function () {
        var enumId = rightFilterParams.enumId;
        rightFilterParams = null;
        var currentEnum = radarXmls[radarModelName].Xml_getEnumeration(enumId);
        var newEnumFieldName = currentEnum.fieldRealName + "." + currentEnum.label;
        currentEnum.checked = !currentEnum.checked;
        var setFilterOn = currentEnum.checked;

        var mode = self.getFilterLogicMode();
        //setBreadcrumb(currentEnum.fieldRealName, currentEnum.label, mode);

        if (mode == "and") {
            if (!setFilterOn) {// on desactive le filtre simplement
                self.backToPreviousState();
                self.saveCurrentState();
                self.changeLegendItemAppearence(setFilterOn, enumId);
                oldEnumFieldName = "xxxx";
                d3radar.setRadarPointsVisbility();
                return;
            } else {

                // on change de filtre
                if (newEnumFieldName == oldEnumFieldName) {

                    // backToPreviousState();

                } else {
                    if (oldEnumFieldName) {
                        var setAlert = oldEnumFieldName.indexOf(currentEnum.fieldRealName) == 0 && oldEnumFieldName != newEnumFieldName;
                        if (setAlert) {
                            oldEnumFieldName = "xxxx";
                            alert("unset " + oldEnumFieldName + "before click this item");
                            currentEnum.checked = !currentEnum.checked;
                            return;
                        }
                    }
                }
                self.saveCurrentState();
            }
            oldEnumFieldName = newEnumFieldName;

        }

        for (var i = 0; i < dataArray.length; i++) {
            var enumIds2 = dataArray[i].enumIds;
            var p = enumIds2.indexOf(parseInt(enumId));
            if (i == 2) {
                var q = enumIds2.indexOf(parseInt(enumId));
            }

            if (p > -1) {// il faut que le champ recherch� soit en premier
                var temp = enumIds2[p];
                enumIds2.splice(p, 1);
                enumIds2.unshift(temp);

            }

            for (var j = 0; j < enumIds2.length; j++) {

                if (mode == "only") {
                    if (enumIds2[j] == enumId) {
                        dataArray[i].visible = setFilterOn;
                        break;
                    } else {
                        dataArray[i].visible = !setFilterOn;
                    }
                } else if (mode == "or") {
                    if (enumIds2[j] == enumId) {
                        dataArray[i].visible = setFilterOn;
                    }// on ne touche pas aux autre
                } else if (mode == "and") {
                    if (enumIds2[j] == enumId) {
                        if (dataArray[i].visible) {
                            dataArray[i].visible = setFilterOn;
                            break;
                        }
                    } else {
                        dataArray[i].visible = !setFilterOn;

                    }
                }
            }

        }

        self.changeLegendItemAppearence(setFilterOn, enumId);
        d3radar.setRadarPointsVisbility();
    }

    self.applyLeftFilter = function () {

        var field = leftFilterParams.field;
        var currentVal = leftFilterParams.currentVal;
        var isMultiValuedData = leftFilterParams.isMultiValuedData;
        var dontDraw = leftFilterParams.dontDraw;
        leftFilterParams = null;

        var mode = self.getFilterLogicMode();
        if (mode == "only")
            self.resetLeftFilterSelects(filters.indexOf(field));
//	setBreadcrumb(field, currentVal, mode);

        var setFilterOn = true;
        if (currentVal == "all")
            setFilterOn = false;

        if (mode == "and") {
            if (!setFilterOn) {// on desactive le filtre simplement
                self.backToPreviousState();
                radarController.drawRadar();
                return;
            } else
            // saveCurrentState();

            // on change de filtre
            if (oldLeftFilterName != field) {
                self.saveCurrentState();
                oldLeftFilterName = field;
            }

        }

        for (var i = 0; i < dataArray.length; i++) {
            //	var enumIds2 = dataArray[i].enumIds;

            var ok;
            if (false)//} (isMultiValuedData && dataArray[i][field])//  A  corriger !!!!!!!!!!!!!!!!!!!
                ok = (dataArray[i][field]).indexOf(currentVal) > -1;
            else
                ok = (dataArray[i][field] == currentVal || dataArray[i][field] == "*");

            if (dataArray[i][field] != "0-0" && ok) {
                console.log("AAA");
            }


            //	for (var j = 0; j < enumIds2.length; j++) {
            if (mode == "only") {
                if (ok) {
                    dataArray[i].visible = setFilterOn;
                } else {
                    dataArray[i].visible = !setFilterOn;
                }
            } else if (mode == "or") {
                if (ok) {
                    dataArray[i].visible = setFilterOn;
                }// on ne touche pas aux autre
            } else if (mode == "and") {
                if (ok) {
                    if (dataArray[i].visible) {
                        dataArray[i].visible = setFilterOn;
                        break;
                    }
                } else {
                    dataArray[i].visible = !setFilterOn;
                }
            }


            /*	if(dataArray[i][field]=="1-1" && dataArray[i].visible==true){
             console.log("---"+JSON.stringify(dataArray[i]));
             }*/

            //}


        }
        d3radar.setRadarPointsVisbility();
        /*
         * if (!dontDraw) drawRadar();
         */
    }

    self.setBreadcrumb = function (filterName, filterValue, mode) {


        if (mode == "clear") {
            str = "";
            $("#breadcrumb").html("");
            currentFilters = [];
            return;
        }
        var oldStr = $("#breadcrumb").html();
        if (!oldStr)
            oldStr = "";
        var str = "";


        if (mode == "only") {
            str = filterName + "=" + filterValue;
            currentFilters = [];
        }
        if (mode == "and") {
            if (oldStr == "")
                str = filterName + "=" + filterValue;
            else
                str = " and " + filterName + "=" + filterValue;
        } else if (mode == "or") {
            if (oldStr == "")
                str = filterName + "=" + filterValue;
            else
                str = " or " + filterName + "=" + filterValue;
        }
        var p = oldStr.indexOf(str);
        if (p > -1 && str.length > 0)
            str = oldStr.replace(str, "");
        else
            str = oldStr + str;
        self.countVisibleItems() + " items";
        $("#breadcrumb").html(str);
        var obj = {};
        obj.key = filterName;
        obj.value = filterValue;
        obj.mode = mode;
        currentFilters.push(obj);

    }

    self.countVisibleItems = function () {
        var count = 0;
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].visible)
                count++;
        }
        return count;

    }

    self.saveCurrentState = function () {

        for (var i = 0; i < dataArray.length; i++) {
            dataArray[i].previousState = dataArray[i].visible;
        }
    }
    self.backToPreviousState = function () {

        for (var i = 0; i < dataArray.length; i++) {
            dataArray[i].visible = dataArray[i].previousState;
        }
    }

    self.isVisible = function (radarItem) {

        return radarItem.visible;

    }
    self.replayAllFilters = function () {// A AMELIORER
        self.resetEnumFilters();
    }

    self.changeLegendItemAppearence = function (isVisible, id) {
        return;
        /*	legendPaper.forEach(function(el) {
         var e = el;
         var x = e.node.id;
         var stop = false;
         if (mode == "only")
         self.resetLeftFilterSelects();
         if (e.group && e.group.length > 3) {// on ne modifie que le rectangle
         // sup�rieur du groupe
         var el = e.group[3];
         var strokeOpacity = 0;
         if (x == id) {
         if (isVisible)
         strokeOpacity = 1;
         else
         strokeOpacity = 0;
         } else {// autre enum

         if (mode == "only") {

         if (!isVisible)
         strokeOpacity = 0;

         } else if (mode == "or") {
         stop = true;
         } else if (mode == "and") {
         stop = true;
         }
         }
         if (!stop) {
         el.animate({
         "stroke" : "#F00",
         "stroke-width" : 2,
         "stroke-opacity" : strokeOpacity
         }, 10);
         }
         }

         // el.attr({ stroke: "blue" });
         });*/
    }
    self.drawFilters = function () {

        var filters = radarXmls[radarModelName].Xml_getfilterNames();
        for (var i = 0; i < filters.length; i++) {

            if (filters[i] == "Layer") {


            }
            self.getFilter(filters[i]);
        }
        if (filter && filterValue) {// url params
            self.applyFilter(filter, filterValue);
            var select = document.getElementById("filter_" + filter);
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].value == filterValue) {
                    select.options[i].selected = "selected";
                    return;
                }

            }
        }
    }
// pour les filtres remplit un tableau enumIds pour chaque objet de dataArray
    self.setEnumIdsAndInitFilters = function () {
        var Xml_enumerations = radarXmls[radarModelName].Xml_enumerations
        if (document.getElementById("radarFilters"))
            document.getElementById("radarFilters").innerHTML = "";
        if (document.getElementById("legend"))
            document.getElementById("legend").innerHTML = "";
        for (var i = 0; i < dataArray.length; i++) {

            dataArray[i].enumIds = new Array();

            dataArray[i].visible = true;
            dataArray[i].previousState = true;

            for (var j = 0; j < Xml_enumerations.length; j++) {
                Xml_enumerations[j].checked = false;
                var str = dataArray[i][Xml_enumerations[j].fieldName];
                // console.log("---"+str);
                if (!str) {
                    // console.log("!!!"+str);
                    continue;
                }

                if (Xml_enumerations[j].fieldName == "Perimetremutualisation")
                    var x = "x";
                str = "" + str;

                if (Xml_enumerations[j].isMultiValued == "true") {
                    // var vals=str.split(multiValuedFieldSep);
                    // for(var k=0;k<vals.length;k++){
                    if (str.indexOf(Xml_enumerations[j].label) > -1) {
                        dataArray[i].enumIds.push(Xml_enumerations[j].id);
                    } else {
                        dataArray[i].enumIds.push(-1);
                    }
                    // }
                } else {

                    if (str == Xml_enumerations[j].label) {
                        dataArray[i].enumIds.push(Xml_enumerations[j].id);
                    } else {
                        dataArray[i].enumIds.push(-1);
                    }
                }

            }

        }
        filters = radarXmls[radarModelName].Xml_getfilterNames();

    }

    self.getFilter = function (field) {


        var text = document.createTextNode(field);
        // text.style = "{color :red;}";

        document.getElementById(filterDiv).appendChild(text);
        var br = document.createElement('br');
        document.getElementById(filterDiv).appendChild(br);
        var select = document.createElement("SELECT");
        var id = "filter_" + field;
        select.setAttribute("name", "mySelect");
        select.setAttribute("id", id);
        select.style.width = "200px";
        select.style.fontSize = "16px";
        select.style.fontStyle = "bold";
        select.style.textAnchor = "start";

        var option = document.createElement("option");
        option.setAttribute("value", "all");
        option.innerHTML = "";
        select.appendChild(option);
        var isMultivalued = common.isMultiValuedData(dataArray, field, multiValuedFieldSep);
        var distinctValues = common.getDistinctValues(dataArray, field, multiValuedFieldSep);
        for (var i = 0; i < distinctValues.length; i++) {
            var value = distinctValues[i];
            if (!value || value == "null")
                continue;
            var option = document.createElement("option");
            option.setAttribute("value", value);
            option.innerHTML = value;
            select.appendChild(option);
        }

        select.onchange = function () {
            var currentVal = this.options[this.selectedIndex].value;
            var selectId = "#cbx_" + $(this).attr("id");
            $(selectId).prop('checked', true);
            leftFilterParams = {
                field: field,
                currentVal: currentVal,
                isMultiValuedData: common.isMultiValuedData,
                dontDraw: false
            }
            self.applyFilter();
            //showLeftFilterDialog(field, currentVal, isMultivalued);

        };


        document.getElementById(filterDiv).appendChild(select);
//	$(filterDiv).append("<input type='checkbox' id=filterCbx_'"+field+"'>" )
        var cbx = document.createElement('input');
        cbx.type = "checkbox";
        cbx.name = "cbx_filters";
        cbx.id = "cbx_filter_" + field;
        document.getElementById(filterDiv).appendChild(cbx);
        cbx.onchange = function () {
            select.selectedIndex = -1;
            var currentVal = $("#filter_" + field).val();
            leftFilterParams = {
                field: field,
                currentVal: "all",
                isMultiValuedData: isMultiValuedData,
                dontDraw: false
            }
            self.applyFilter();
        }
        var br = document.createElement('br');
        document.getElementById(filterDiv).appendChild(br);

    }

    self.resetEnumFilters = function () {
        var Xml_enumerations = radarXmls[radarModelName].Xml_enumerations;
        for (var i = 0; i < dataArray.length; i++) {

            dataArray[i].visible = true;
            dataArray[i].previousState = true;

        }
        for (var j = 0; j < Xml_enumerations.length; j++) {
            self.changeLegendItemAppearence(false, Xml_enumerations[j].id);

        }

        self.resetLeftFilterSelects();
        var operators = $('[name="filterOperator"]');
        operators[1].checked = "checked";
        // document.forms["filterOperatorForm"].filterOperator[1].checked =
        // "checked";
        self.setBreadcrumb("", "", "clear");
        // drawRadar();
        var currentFilters = [];
        d3radar.setRadarPointsVisbility();
    }

    self.resetLeftFilterSelects = function (exceptFilterIndex) {
        for (var j = 0; j < filters.length; j++) {
            if (exceptFilterIndex && exceptFilterIndex == j)
                continue;
            var filter = document.getElementById("filter_" + filters[j]);

            filter.selectedIndex = 0;

        }
    }

    return self;
})()