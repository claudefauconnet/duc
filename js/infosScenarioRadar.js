var infosScenario = (function () {
    var self = {};
    var scenarioDoc;
    var bbsData;
    var scenariosBBIds = [];

    $(function () {

        var queryParams = common.getQueryParams(document.location.search);

        if (!queryParams.dbName) {
            alert("no database parameter in URL : enter ?dbName=xxx")
            return;
        }
        dbName = queryParams.dbName;
        if (currentObjectId)
            self.execute(currentObjectId)
        else
            $("#scenarioContent").css("visibility", "hidden");
    });


    self.execute = function (objId, name) {

        if (infosGeneric.isModifying > 0) {
            if (confirm("save previous item data"))
                self.save();
            infosGeneric.isModifying = 0;

        }

        if (name)
            scenarioDoc = {
                name: name,

            }
        $("#scenarioContent").css("visibility", "visible");

        currentObjectId = objId;
        fillAccordion(objId);
    }


    self.display = {
        scenarioDesc: {


            description: {
                type: "text",
                cols: 50,
                rows: 5
            }
        },
//"scenarios": ["businessValue", "maturity", "name", "riskLevel", "easeOfImpl", "category", "costLevel", "priority", "companySkills", "marketSkills", "year"],

        scenarioAttrs: {

            businessValue: {

                type: "select",
                title: "Description",
                title: "Business Value",
                desc: "How valuable is the scenario perceived by the practitioners"

            },
            easeOfImpl: {
                type: "select",
                title: "ease of implementation",
                desc: " Indicates to what extent a use case can be easily implemented. 1 is very hard, 3 is easy "

            },
            maturity: {
                type: "select",

            },

            category: {
                type: "select",

            },


            costLevel: {
                type: "select",
            },

            marketSkills: {
                type: "select",
                title: "Market Skills",
                desc: "how easy will it be to find freelancers, experts, consulting firms with expertise on the technology"


            },
            companySkills: {
                type: "select",
                title: "Company skills",
                desc: "are there internal resources that are knowledgeable, experts..."
            },
            riskLevel: {
                type: "select",
            },
            priority: {
                "value": "",
                type: "select",
            },
            year: {
                type: "select",
            },

            horizon: {
                type: "select",
                desc: "some scenarii can be implemented very soon while others cannot realistically before a while. 1 means soon."

            },


        }


    };


    self.saveBBs = function (scenarioName, scenarioId) {

        var bbCBXs = $(".bbCBX");
        var newscenarioBBs = []
        for (var i = 0; i < bbCBXs.length; i++) {
            if (bbCBXs[i].checked) {
                var id = parseInt(bbCBXs[i].id.substring(6));
                newscenarioBBs.push({
                        techno_id: id,
                        techno_name: bbCBXs[i].name,
                        SC_name: scenarioName,
                        SC_id: scenarioId
                    }
                );
            }
        }

        devisuProxy.deleteItemByQuery(dbName, "r_SC_T", {SC_id: scenarioId}, true, function (result) {
            devisuProxy.addItems(dbName, "r_SC_T", newscenarioBBs, function (result) {
                common.setMessage("BBs updated " + newscenarioBBs.length, "attrsTabMessage");
                $("#dialogGlobal").dialog("close");
                $(attrsIFrame).prop('contentWindow').infosScenario.execute(scenarioId);

            })
        })

    }
    self.modifyBBs = function () {
        var allBBsData = devisuProxy.loadData(dbName, "technologies", {});
        allBBsData.sort(function (a, b) {
            if (a.name > b.name)
                return 1;
            if (a.name < b.name)
                return -1;
            return 0;
        })

        var strBBs = "<button onclick='infosScenario.saveBBs(\"" + scenarioDoc.name + "\"," + scenarioDoc.id + ")'>save</button><br> <ul>";

        for (var i = 0; i < allBBsData.length; i++) {
            var checked = "";
            if (scenariosBBIds.indexOf(allBBsData[i].id) > -1)
                checked = "checked='checked'";

            strBBs += "<li><input type='checkbox' id='bbCBX_" + allBBsData[i].id + "' name='" + allBBsData[i].name + "' class ='bbCBX' " + checked + " >" + allBBsData[i].name + "</li>";
        }
        strBBs += "</ul>";
        window.parent.$("#dialogGlobalContent").html(strBBs);
        window.parent.$("#dialogGlobal").dialog('option', 'title', 'scenario Building blocks');
        window.parent.$("#dialogGlobal").dialog("open");
    }
    self.setBBs=function(){
        var allBBsData = devisuProxy.loadData(dbName, "r_SC_T", {SC_id:scenarioDoc.id});
        scenariosBBIds = [];
            var strBBs = "<ul>";
            for (var i = 0; i < allBBsData.length; i++) {
                strBBs += "<li>" + allBBsData[i].techno_name + "</li>"
                scenariosBBIds.push(allBBsData[i].techno_id);
            }
            strBBs += "</ul><button onclick='infosScenario.modifyBBs()'>modify</button> ";
            $("#BBsSpan").html(strBBs)


    }
        self.setUCs=function(){
            devisuProxy.loadData(dbName, "r_SC_UC", {SC_id:scenarioDoc.id},function(result) {
                ;
                result = util.sortByField(result, "UC_name");
                self.useCaseTechnoDcs = result;

                var treeModel = infosGenericParams.treeModels["scenarios"].model;

                treeController.load("SC_UCtree", result, treeModel, true,null,null, true);

            })
            // scenariosBBsIds = [];

        }



    function fillAccordion() {
        if (currentObjectId != null) {


            var scenarioData = devisuProxy.loadData(dbName, "scenarios", {
                id: currentObjectId
            });

            scenarioDoc = scenarioData[0];
            /*   var linkedscenariosData = devisuProxy.loadData(dbName, "linkedscenarios", {
             scenario_id: currentObjectId
             });

             var linkedscenariosData = devisuProxy.loadData(dbName, "linkedscenarios", {
             scenario_id: currentObjectId
             });

             if (bbsData)
             scenarioDoc.bbs = bbsData;
             if (linkedscenariosData)
             scenarioDoc.linkedscenarios = linkedscenariosData;*/
        } else {

            //  scenarioDoc = {};

        }




        if (currentObjectId != null) {
            self.setBBs();
            self.setUCs()
            $("#idSpan").html(currentObjectId);
        }

        $("#nameSpan").html(scenarioDoc.name);





        infosGeneric.setAttributesValue("scenarios", scenarioDoc, self.display.scenarioDesc);
        infosGeneric.drawAttributes(self.display.scenarioDesc, "descSpan");


        infosGeneric.setAttributesValue("scenarios", scenarioDoc, self.display.scenarioAttrs);
        infosGeneric.drawAttributes(self.display.scenarioAttrs, "attrsSpan");

        infosGeneric.setAttributesValue("scenarios", scenarioDoc, self.display.scenarioResources);
        infosGeneric.drawAttributes(self.display.scenarioResources, "resourcesSpan");

        $("#accordion").accordion();

    }
        self.save = function () {
            if (infosGeneric.isFieldModified(scenarioDoc, "businessValue") || infosGeneric.isFieldModified(scenarioDoc, "easeOfImpl")) {
                var point = window.parent.radarBackground.getZoneCenter(infosGeneric.getFormFieldValue("easeOfImpl"), infosGeneric.getFormFieldValue("businessValue"));
                if (point) {
                    scenarioDoc.x = point.x;
                    scenarioDoc.y = point.y;
                }


            }
            window.parent.d3radar.updateRadarPoint(scenarioDoc);
            var result = infosGeneric.save(dbName, "scenarios", scenarioDoc, self.display);
            if (result.status == "validationError") {
                window.parent.$("#dialogGlobalContent").html(result.data);
                window.parent.$("#dialogGlobal").dialog('option', 'title', 'Validation errors');
                window.parent.$("#dialogGlobal").dialog("open");

                return false;
            }
            if (result.status == "created") {
                window.parent.radarController.reloadRadar();
            }
            if (result.status == "modified") {
                window.parent.radarController.reloadRadar();
            }

            infosGeneric.isModifying = 0;
            return true;


        }

        return self;
    }

    )
()
