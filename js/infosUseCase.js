var infosUseCase = (function () {
    var self = {};

    self.useCaseDoc;
    self.bu;
    self.useCaseTechnoDcs = [];


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

        var queryParams = common.getQueryParams(document.location.search);
        var queryParams = common.getQueryParams(document.location.search);
        if (!queryParams.dbName) {
           // alert("no database parameter in URL : enter ?dbName=xxx")
            return;
        }
        dbName = queryParams.dbName;

        if (currentObjectId)
            self.execute(currentObjectId)


    });


    self.execute = function (objId, name) {
        if (infosGeneric.isModifying > 0) {
            if (confirm("save previous item data"))
                self.save();
            infosGeneric.isModifying = 0;

        }
        self.useCaseDoc = {}
        if (name)
            self.useCaseDoc.name = name;
        currentObjectId = objId;
        $("#attrsTabMessage", window.parent.document).html("");
        $("#idSpan").html(objId)
        self.fillAccordion(objId);
        $("#accordion").accordion();
    }


    self.setUseCaseTechnosAndDcs = function () {
        if (currentObjectId) {
            $("#modifyUC_TechnosDCsButton").css("visibility", "visible");
            var useCaseTechnosDCs = devisuProxy.loadData(dbName, "r_UC_T_DC", {UC_id: currentObjectId}, function (result) {
                result = util.sortByField(result, "techno_name");
                self.useCaseTechnoDcs = result;

                var treeModel = [{
                    type: "technology",
                    text: "techno_name",
                    id: "techno_id",
                    icon: iconPath + Gparams.customIcons["POT"]["technology"]
                },
                    {
                        type: "DC",
                        text: "DC_name",
                        id: "DC_id",
                        icon: iconPath + Gparams.customIcons["POT"]["useCase"],
                    }]


                //  $('#technoDCtree').jstree("destroy").empty();
                treeController.load("technoDCtree", result, treeModel, true, null,null,true);

            });
        }
        else {
            $("#modifyUC_TechnosDCsButton").css("visibility", "hidden");
        }


    }
    self.modifyUC_TechnosDCs = function (reverse) {
        var reverseStr = "";
        if (reverse)
            reverseStr = "true";
        var str = " <span id='title'></span>" +
            "<button id='saveTreeDataButton' onclick='treeController.getTreeSelectedData()'>Save</button>" +
            "<div id='jsTree'></div>"
            + "<script> infosUseCase.loadAllTechnosDCsTree(" + reverseStr + ")</script>";
        window.parent.$("#dialogGlobalContent").html(str);
        window.parent.$("#dialogGlobal").dialog('option', 'title', 'Technology  and Digital Capabilities');
        window.parent.$("#dialogGlobal").dialog("open");
    }

    self.modifyBCs = function (reverse) {
        var reverseStr = "";
        if (reverse)
            reverseStr = "true";
        var str = " <span id='title'></span>" +
            /*   "search <input id='searchTree'>" +
             "<button onclick=\"treeController.openAll('genericTree')\">Open all</button>" +
             " <button onclick=\"treeController.closeAll('genericTree')\">Close all</button>" +*/
            "<div id='jsTree'></div>"
            + "<script> infosUseCase.loadAllBCs(" + reverseStr + ")</script>";
            if( window.parent.$("#dialogGlobalContent")){
                window.parent.$("#dialogGlobalContent").html(str);
                window.parent.$("#dialogGlobal").dialog('option', 'title', 'UseCase organisation');
                window.parent.$("#dialogGlobal").dialog("open");
            }
            return str;
    }

    self.loadAllBCs = function (treeId) {
        if(!treeId)
            treeId="jsTree";
        devisuProxy.loadData(dbName, "BCs", {}, function (result) {

            result = util.sortByField(result, "BU_name");
            var checkedNodes = null;
            treeController.load(treeId, result, infosGenericParams.treeModels["business"].model, true, infosUseCase.setBC, checkedNodes, true);


        });
    }
    self.setBC = function (action, obj) {
        //  if(obj.type=="BC"){
        var query = {};
        query[obj.idField] = common.convertNumStringToNumber(obj.id)
        devisuProxy.loadData(dbName, "BCs", query, function (result) {
            var obj2 = result[0];
            var str = "";
            str += obj2.company_name + "/";
            if (obj2.BU_name)
                str += obj2.BU_name + "/";
            if (obj2.BD_name)
                str += obj2.BD_name + "/";
            if (obj2.BC_name)
                str += obj2.BC_name + "/";

            var str2 = "<select id='attr_business' > <option>" + str + "</option></select>"
            //   var xxx= $(attrsIFrame).contents().find('#attr_business');
            if ($(attrsIFrame).contents()) {

            $(attrsIFrame).contents().find('#attr_business').val(str)
            //   $(attrsIFrame).contents().find('#attr_business').on("click",infosUseCase.modifyBCs());
            /*    $(attrsIFrame).contents().find('input#attr_business').append($('<option>', {
             value:str,
             text: str,
             checked:"checked"
             }));*/
            //   $(attrsIFrame).contents().find('input#attr_business').val(str);
            //$(attrsIFrame).prop('contentWindow').$("#attr_business").val(str);
            $("#dialogGlobal").dialog("close");
        }
        return str;
        })
        // }
    }
    self.loadAllTechnosDCsTree = function (reverse) {
        var useCaseTechnosDCs = devisuProxy.loadData(dbName, "r_T_DC", {}, function (result) {
            result = util.sortByField(result, "techno_name");

            var treeModel;
            if (!reverse) {
                treeModel = [{
                    type: "technologies",
                    text: "techno_name",
                    id: "techno_id",
                    icon: iconPath + Gparams.customIcons["POT"]["technology"]

                },
                    {
                        type: "DC",
                        text: "DC_name",
                        id: "DC_id",
                        icon: iconPath + Gparams.customIcons["POT"]["useCase"],
                        cbx: true
                    }]
            }
            else {
                treeModel = [
                    {
                        type: "DC",
                        text: "DC_name",
                        id: "DC_id",
                        icon: iconPath + Gparams.customIcons["POT"]["useCase"],
                        cbx: true
                    }, {
                        type: "technologies",
                        text: "techno_name",
                        id: "techno_id",
                        icon: iconPath + Gparams.customIcons["POT"]["technology"]

                    }]
            }


            var checkedNodes = $(attrsIFrame).prop('contentWindow').infosUseCase.useCaseTechnoDcs;
            treeController.load("jsTree", result, treeModel, false, infosUseCase.saveUCtechnosDCs, checkedNodes, true);

        });
    }
    self.saveUCtechnosDCs = function (action, objs) {


        if (action == "infos") {

            return;
        }


        if (action == "checkedNodes") {
            self.useCaseDoc = $(attrsIFrame).prop('contentWindow').infosUseCase.useCaseDoc;
            devisuProxy.deleteItemByQuery(dbName, "r_UC_T_DC", {UC_id: self.useCaseDoc.id}, true, function (result) {
                if(Gparams.synchronizeMongoToNeo){
                    mongoToNeoSynchronizer.pushToNeo("delete",{dbName:dbName,collection:"r_SC_UC"},result.object);
                }




                for (var i = 0; i < objs.length; i++) {
                    objs[i].UC_id = self.useCaseDoc.id;
                    objs[i].UC_name = self.useCaseDoc.name;

                }
                devisuProxy.addItems(dbName, "r_UC_T_DC", objs)

            });
            $("#dialogGlobal").dialog("close");
            $(attrsIFrame).prop('contentWindow').infosUseCase.setUseCaseTechnosAndDcs();
        }
    }

    self.save = function () {

        var result = infosGeneric.validateInput()

        if (infosGeneric.isFieldModified(self.useCaseDoc, "horizon") || infosGeneric.isFieldModified(self.useCaseDoc, "businessValue")) {
            var point = window.parent.radarBackground.getZoneCenter(infosGeneric.getFormFieldValue("horizon"), infosGeneric.getFormFieldValue("businessValue"));

            // console.log(JSON.stringify(point));
            if (point) {
                self.useCaseDoc.x = point.x;
                self.useCaseDoc.y = point.y;
            }


        }

        window.parent.d3radar.updateRadarPoint(self.useCaseDoc);
        var result = infosGeneric.save(dbName, "use_cases", self.useCaseDoc, self.display);
        if (result.status == "validationError") {
            window.parent.$("#dialogGlobalContent").html(result.data);
            window.parent.$("#dialogGlobal").dialog('option', 'title', 'Validation errors');
            window.parent.$("#dialogGlobal").dialog("open");

            return false;
        }

        self.updateSC_UCrelation();


        if (result.status == "created") {
            //  window.parent.radarController.reloadRadar();
            self.useCaseDoc._id=result.data._id;
            result.data.label = result.data.name;
            result.data.isNew = true;
            window.parent.dataArray.push(result.data)
            window.parent.d3radar.drawRadarD3(window.parent.dataArray)
            window.parent.radarController.reloadRadar();

        }
        if (result.status == "modified") {
            window.parent.d3radar.drawRadarD3(window.parent.dataArray)
            //    window.parent.radarController.reloadRadar();
        }
        infosGeneric.isModifying = 0;
        return true;




    }
    self.updateSC_UCrelation=function (){
        var query={UC_id: self.useCaseDoc.id};
        var fields={
            UC_id: self.useCaseDoc.id,
            UC_name: self.useCaseDoc.name,
            SC_id: infosGeneric.allDynamicSelectValues["scenario"][self.useCaseDoc.scenario],
            SC_name: self.useCaseDoc.scenario,
        }

        infosGeneric.replaceRelations(dbName,"r_SC_UC",query,fields,function(err,result)
        {
        });


    }


    self.delete = function () {
        if (confirm("delete technology" + self.useCaseDoc)) {
            var index = util.find(window.parent.dataArray, "id", self.useCaseDoc.id, true).$findIndexes[0];
            window.parent.dataArray[index].hide = 1;
            window.parent.dataArray[index].deleted = 1;
            window.parent.d3radar.setPointsVisibility(window.parent.dataArray);
            window.parent.d3radar.drawRadarD3(window.parent.dataArray)
            window.parent.dataArray.splice(index, 1);

            devisuProxy.deleteItem(dbName, "use_cases", self.useCaseDoc.id, function (result) {

                devisuProxy.deleteItemByQuery(dbName, "r_UC_T_DC", {UC_id: self.useCaseDoc.id}, true, function (result) {
                    devisuProxy.deleteItemByQuery(dbName, "r_SC_UC", {UC_id: self.useCaseDoc.id}, true, function (result) {
                        common.setMessage("item deleted", "green");
                    });
                });
            });
        }
    }


    self.display = {

        useCaseBusinessDesc: {
            business: {
                type: "text",
                cols: 30,
                validation: {mandatory: 1}
            },
            scenario: {
                type: "select",


            },
            /*  bu: {
             type: "readOnly",
             validation: {mandatory:1}
             },*/
        }
        ,
        useCaseDesc: {
            description: {
                type: "text",
                cols: 40,
                rows: 7,
                title: "Description"
            },
            currentSituation: {
                type: "text",
                cols: 40,
                rows: 6,
                title: "Comments"
            },
        }, useCaseAttrs: {


            businessValue: {
                type: "select",
                validation: {mandatory: 1},
                title: "Business Value",
                desc: "How valuable is the use case perceived by the practitioners"
            },
            horizon: {
                type: "select",
                validation: {mandatory: 1},
                desc: "some use cases can be implemented very soon while others cannot realistically before a while. 1 means soon."

            },
            priority: {
                type: "select",
                list: "priority"
            },
            business_cat: {
                type: "select",
                label: "business category",
                title: "Activity",
                desc: "What set of tasks/missions is the use case related to"
            },
            technical_cat: {
                type: "select",
                label: "technical category",
                title: "technical category",
                desc: "What is the technology that characterizes this use case"
            },


            status: {
                type: "select",
                title: "Project status",
                desc: " Indicates where the project stand in the innovation process "

            },
            business_cat: {
                type: "text",
                title: "Business category",
                desc: " In what of type of business oriented activity could this use case be classified "


            },

            riskLevel: {
                type: "select",
                list: "level",
                title: "Risk Level",
                desc: " How uncertain would the implementation be in terms of duration, costs, success... "

            },

            easeOfImpl: {
                type: "select",
                list: "level",
                title: "Risk Level",
                desc: " How uncertain would the implementation be in terms of duration, costs, success... "

            },

        }
    };


    self.fillAccordion = function () {


        if (currentObjectId) {
            var useCaseData = devisuProxy.loadData(dbName, "use_cases", {
                id: currentObjectId
            });
            self.useCaseDoc = useCaseData[0];

        } else {
            self.useCaseDoc.bu = window.parent.currentBU;
        }

        infosGeneric.setAttributesValue("use_cases", self.useCaseDoc, self.display.useCaseBusinessDesc);
        infosGeneric.drawAttributes(self.display.useCaseBusinessDesc, "businessSpan");
        // $('#attr_business').on("click",infosUseCase.modifyBCs());

        infosGeneric.setAttributesValue("use_cases", self.useCaseDoc, self.display.useCaseDesc);
        infosGeneric.drawAttributes(self.display.useCaseDesc, "descriptionDiv");


        infosGeneric.setAttributesValue("use_cases", self.useCaseDoc, self.display.useCaseAttrs);
        infosGeneric.drawAttributes(self.display.useCaseAttrs, "AttrsSpan");
        self.setUseCaseTechnosAndDcs();

        if (self.useCaseDoc) {
            $("#nameRead").html(self.useCaseDoc.name);
            $("#idSpan").html(self.useCaseDoc.id);
        }
    }


    return self;
})()
