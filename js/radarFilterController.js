/**
 * Created by claud on 19/06/2017.
 */
var radarFilterController = (function () {
    var self = {};
    var checkedFilters = {};


    self.buildFiltersTreeValues = function (collection, fields) {


        if (!fields)
            return null;
        var flatData = [];
        for (var i = 0; i < fields.length; i++) {
            if(fields[i]=="name")
                var www="aaa";
            var fieldsValuesObj = infosGenericParams.fieldsSelectValues[collection];
            if (!fieldsValuesObj)
                continue;
            var fieldsValues = fieldsValuesObj[fields[i]];
            if (!fieldsValues)
                continue;
            if (fieldsValues.source) {
                fieldsValues = infosGeneric.getDynamicSelectValues(fieldsValues.source);
            } else {

                fieldsValues.sort();

            }

            for (var j = 0; j < fieldsValues.length; j++) {
              //  console.log(JSON.stringify(fieldsValues));
                if (fieldsValues[j] != null) {
                    if (!fieldsValues[j].id) { // transform in object simple value
                        fieldsValues[j] = {id: fieldsValues[j], name: fieldsValues[j]};
                    }

                    fieldsValues[j].id = ("" + fieldsValues[j].id).replace(/[^a-zA-Z\d]/g, "_")
                    var obj = {
                        collection: collection,
                        field_id: i,
                        field_name: fields[i],
                        value_id: fieldsValues[j].id,
                        value_name: fieldsValues[j].name,
                        data: {field: fields[i], name: fieldsValues[j].name}
                    };
                    flatData.push(obj);
                }
            }

        }
        return flatData;


    }
    self.buildFilters = function (jsTreeDiv, collection, fields) {

        var flatData = self.buildFiltersTreeValues(collection, fields);
        if (!flatData)
            return;
        var filterTreeModel = [{
            type: "field",
            text: "field_name",
            id: "field_id",
            icon: iconPath + "filterField.png"

        }, {

            type: "value",
            text: "value_name",
            id: "value_id",
            icon: iconPath + "filterValue.png"


        }]

        $("#" + jsTreeDiv).css("font-size", "14px");
        treeController.load(jsTreeDiv, flatData, filterTreeModel, false, radarFilterController.onFilterSelect, null, true)

    }

    var setValueAppearence = function (id, checked) {
        var color = "black";
        if (checked)
            color = "red";
        $("#" + id + "_anchor").css("color", color);
    }

    self.onFilterModeSelect = function () {
        var mode = $("#filterMode2").val();
        if (mode == "reset") {
            self.resetFilters();
        }


    }


    self.resetFilters = function () {
        for (var i = 0; i < dataArray.length; i++) {
            dataArray[i].hide = 0;

        }
        d3radar.setPointsVisibility(dataArray);
        var xxx = $(".jstree_anchor");
        $(".jstree-default .jstree-anchor").css("color", "black")
        $("#filterMode2").val("only");

    }


    self.onFilterSelect = function (type, obj) {
        if (obj.type != "value")
            return;

        var mode = $("#filterMode2").val();
        if (mode == "reset" || mode == "only") {
            for (var key in checkedFilters) {
                setValueAppearence(key, false);
                delete checkedFilters[key];
            }

        }
        if (mode == "reset") {
            self.executeFilters();
            return;
        }


        var jTreeId = obj.jTreeId;

        if (!checkedFilters[jTreeId]) {

            setValueAppearence(jTreeId, true);
            checkedFilters[jTreeId] = {field: obj.data.field, value: obj.data.name};


        } else {
            delete checkedFilters[jTreeId]
            setValueAppearence(jTreeId, false);
        }
        self.executeFilters()


    }
    self.getFilterMatches = function (filter) {
        var dataArrayMatchIndexes = [];
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i][filter.field] && dataArray[i][filter.field] == filter.value)
                dataArrayMatchIndexes.push(i)
        }

       for (var j = 0; j < radarController.joinedData.length; j++) {

            if (radarController.joinedData[j][filter.field] ) {
                if (radarController.joinedData[j][filter.field] == filter.value) {


                    var index = util.find(dataArray, "id", radarController.joinedData[j][radarController.joinedData.key], true).$findIndexes[0]
                    console.log("----------------------")
                    console.log(JSON.stringify(radarController.joinedData[j]))
                    console.log("+++++++++++++++")
                    console.log(JSON.stringify(dataArray[index]))
                    dataArrayMatchIndexes.push(index)
                    /*  for (var i = 0; i < dataArray.length; i++) {
                     if (dataArray[i].id == radarController.joinedData[j].id)
                     dataArrayMatchIndexes.push(i)
                     }*/

                }
            }

        }
        return dataArrayMatchIndexes;
    }


    self.executeFilters = function () {
        var mode = $("#filterMode2").val();
        for (var key in checkedFilters) {
            var filter = checkedFilters[key];

            var dataArrayMatchIndexes = self.getFilterMatches(filter);
            for (var i = 0; i < dataArray.length; i++) {




                if (mode == "only") {
                    dataArray[i].hide = 1;
                }


                if (dataArrayMatchIndexes.indexOf(i) > -1) {

                    //     if (dataArray[dataArrayMatchIndexes[i]][filter.field] && dataArray[dataArrayMatchIndexes[i]][filter.field] == filter.value) {// le point correspond au filtre courant
                  //  console.log(filter.value);
                    console.log(dataArray[i].name);

                    if (!dataArray[i].hide)
                        dataArray[i].hide = 0;

                    if (mode == "and") {
                        if (dataArray[i].hide == 0)
                            dataArray[i].hide = 0;
                        else
                            dataArray[i].hide = 1;
                    } else {
                        dataArray[i].hide = 0;
                    }

                    /*    if (dataArray[i].hide == 0) {//not alreadychecked
                     if (mode == "and") {
                     dataArray[i].hide = 1;
                     }

                     else {
                     dataArray[i].hide = 0;
                     }
                     }

                     else {
                     ;//   dataArray[i].hide = 1;


                     }*/
                } else {
                    if (mode == "or") {// le point ne correspond pas au filtre courant
                        if (dataArray[i].hide == 0)
                            dataArray[i].hide = 0;
                        else
                            dataArray[i].hide = 1;
                    }
                    else
                        dataArray[i].hide = 1;
                }
            }


        }
        d3radar.setPointsVisibility(dataArray);

    }


    return self;
})()
