var zoomIn = function (event) {
    $("#technoImg").css("width", Gparams.technoIconZoomedWidth)

}

var zoomOut = function (event) {
    $("#technoImg").css("width", Gparams.technoImgIconWidth)

}


var infosTechno = (function () {
    var self = {};
    var technoDoc;
    var dcsData;
    var technosDCIds = [];

    $(function () {

        var queryParams = common.getQueryParams(document.location.search);
        if (!queryParams.dbName) {
            alert("no database parameter in URL : enter ?dbName=xxx")
            return;
        }
        dbName = queryParams.dbName;
        userRole = queryParams.userRole;
        userLogin=queryParams.userLogin;
        if (currentObjectId)
            self.execute(currentObjectId)
        else
            $("#technoContent").css("visibility", "hidden");
    });


    self.execute = function (objId, name) {

        if (infosGeneric.isModifying > 0) {
            if (confirm("save previous item data"))
                self.save();
            infosGeneric.isModifying = 0;

        }

        if (name)
            technoDoc = {
                name: name,
                type: "innovative"
            }
        $("#technoContent").css("visibility", "visible");
        /*  if (!objId)
         return;*/
        currentObjectId = objId;
        fillAccordion(objId);
    }


    self.display = {
        technoName: {
            name: {
                type: "text",
                title: name,
                type: "readOnly",
            }
        }
        , technoDesc: {
            description: {
                type: "text",
                cols: 40,
                rows: 5
            },

            examples: {
                type: "text",
                cols: 40,
                rows: 5
            },
            advantages: {
                type: "text",
                cols: 40,
                rows: 3
            },
            limitations: {
                type: "text",
                cols: 40,
                rows: 3
            }

        }
        , technoResources: {

            resources: {
                type: "text",
                cols: 40,
                rows: 10,
                desc: "add links toward informative pages and contents"
            }
        }
        , technoAttrs: {
            maturity: {
                type: "select",
                validation: {mandatory: 1},
                desc: "is the technology implementable? 3 means mature"
            },
            digitalPolarity: {
                type: "select",
                validation: {mandatory: 1},
                title: "Digital polarity",
                desc: "How digital is this technology?"

            },

            type: {
                type: "select",
                validation: {mandatory: 1},
                desc: "Innovative technologies are currently in the POT. Mainstream technologies can be use for scenario but are not studied by the innovation team anymore"

            },
            category: {
                type: "select",
                desc: "Category to regroup technologies in larger themes"
            },
            availability: {
                type: "select",
                desc: "To what extent is the technology available for industrialization? "

            },

            companySkills: {
                type: "select",
                title: "Company skills",
                desc: "are there internal resources that are knowledgeable, experts..."
            },
            marketSkills: {
                type: "select",
                title: "Market Skills",
                desc: "how easy will it be to find freelancers, experts, consulting firms with expertise on the technology"


            },
            year: {
                "value": "",
                type: "select",

            },
            isBB: {
                type: "select",
                desc: "Technologies that are building block  can be used to represent architectures associated to a given scenario"

            }, layer: {
                type: "select",
            },
            path: {
                type: "text",
            },


        }
    };

    self.saveDCs = function (technoName, technoId) {

        var dcCBXs = $(".dcCBX");
        var newTechnoDCs = []
        for (var i = 0; i < dcCBXs.length; i++) {
            if (dcCBXs[i].checked) {
                var id = parseInt(dcCBXs[i].id.substring(6));
                newTechnoDCs.push({
                        DC_id: id,
                        DC_name: dcCBXs[i].name,
                        techno_name: technoName,
                        techno_id: technoId
                    }
                );
            }
        }

        infosGeneric.replaceRelations(dbName,"r_T_DC",{techno_id: technoId},newTechnoDCs,function(err,result){
            if(err){
                return console.log(err);
            }
            common.setMessage("DCs updated " + newTechnoDCs.length, "attrsTabMessage");
            $("#dialogGlobal").dialog("close");
            $(attrsIFrame).prop('contentWindow').infosTechno.execute(technoId);

        })

      /*  devisuProxy.deleteItemByQuery(dbName, "r_T_DC", {techno_id: technoId}, true, function (result) {
            devisuProxy.addItems(dbName, "r_T_DC", newTechnoDCs, function (result) {
                if(Gparams.synchronizeMongoToNeo) {
                    for(var i=0;i<newTechnoDCs.length;i++) {
                        mongoToNeoSynchronizer.pushToNeo("create", {collection: "r_T_DC"}, newTechnoDCs[i]);
                    }
                }


            })
        })*/

    }
    self.modifyDCs = function () {
        var allDcsData = devisuProxy.loadData(dbName, "DCs", {});
        allDcsData.sort(function (a, b) {
            if (a.name > b.name)
                return 1;
            if (a.name < b.name)
                return -1;
            return 0;
        })

        var strDCs = "<button onclick='infosTechno.saveDCs(\"" + technoDoc.name + "\"," + technoDoc.id + ")'>save</button><br> <ul>";

        for (var i = 0; i < allDcsData.length; i++) {
            var checked = "";
            if (technosDCIds.indexOf(allDcsData[i].id) > -1)
                checked = "checked='checked'";

            strDCs += "<li><input type='checkbox' id='dcCBX_" + allDcsData[i].id + "' name='" + allDcsData[i].name + "' class ='dcCBX' " + checked + " >" + allDcsData[i].name + "</li>";
        }
        strDCs += "</ul>";
        window.parent.$("#dialogGlobalContent").html(strDCs);
        window.parent.$("#dialogGlobal").dialog('option', 'title', 'Technology Digital Capabilities');
        window.parent.$("#dialogGlobal").dialog("open");
    }


    function fillAccordion() {
        if (currentObjectId != null) {


            var technoData = devisuProxy.loadData(dbName, "technologies", {
                id: currentObjectId
            });

            dcsData = devisuProxy.loadData(dbName, "r_T_DC", {
                techno_id: currentObjectId
            });
            technoDoc = technoData[0];

            /*   var linkedTechnosData = devisuProxy.loadData(dbName, "linkedTechnos", {
             techno_id: currentObjectId
             });

             var linkedTechnosData = devisuProxy.loadData(dbName, "linkedTechnos", {
             techno_id: currentObjectId
             });

             if (dcsData)
             technoDoc.dcs = dcsData;
             if (linkedTechnosData)
             technoDoc.linkedTechnos = linkedTechnosData;*/
        } else {

            //  technoDoc = {};

        }


        self.setDcs = function () {
            technosDCIds = [];
            var strDCs = "<ul>";
            for (var i = 0; i < dcsData.length; i++) {
                strDCs += "<li>" + dcsData[i].DC_name + "</li>"
                technosDCIds.push(dcsData[i].DC_id);
            }
            strDCs += "</ul><button onclick='infosTechno.modifyDCs()'>modify</button> ";
            $("#DCsSpan").html(strDCs)
        }

        self.setTechnoImg = function (technoDoc) {
            var imgStr = "";
            if (technoDoc && technoDoc.path) {
                var p = technoDoc.path.lastIndexOf("/");
                if (p > -1)
                    technoDoc.path = technoDoc.path.substring(p + 1)

                imgStr = "<img id='technoImg' src='" + Gparams.imgDirPath + technoDoc.path + "'  width='" + Gparams.technoImgIconWidth + "px'  onmouseover='zoomIn();' onmouseout='zoomOut();'>";
            }
            $("#imgSpan").html(imgStr)

        }
        self.setTechnoImg(technoDoc);
        if (currentObjectId != null) {
            self.setDcs();
            $("#idSpan").html(currentObjectId);
        }


        //  $("#nameSpan").html(technoDoc.name)


        infosGeneric.setAttributesValue("technologies", technoDoc, self.display.technoName);
        infosGeneric.drawAttributes(self.display.technoName, "nameSpan");

        infosGeneric.setAttributesValue("technologies", technoDoc, self.display.technoDesc);
        infosGeneric.drawAttributes(self.display.technoDesc, "descSpan");


        infosGeneric.setAttributesValue("technologies", technoDoc, self.display.technoAttrs);
        infosGeneric.drawAttributes(self.display.technoAttrs, "attrsSpan");

        infosGeneric.setAttributesValue("technologies", technoDoc, self.display.technoResources);
        infosGeneric.drawAttributes(self.display.technoResources, "resourcesSpan");

        $("#accordion").accordion();


        self.save = function () {
            if (infosGeneric.isFieldModified(technoDoc, "maturity") || infosGeneric.isFieldModified(technoDoc, "digitalPolarity")) {
                var point = window.parent.radarBackground.getZoneCenter(infosGeneric.getFormFieldValue("digitalPolarity"), infosGeneric.getFormFieldValue("maturity"));
                if (point) {
                    technoDoc.x = point.x;
                    technoDoc.y = point.y;
                }


            }
            window.parent.d3radar.updateRadarPoint(technoDoc);
            var result = infosGeneric.save(dbName, "technologies", technoDoc, self.display);
            if (result.status == "validationError") {
                window.parent.$("#dialogGlobalContent").html(result.data);
                window.parent.$("#dialogGlobal").dialog('option', 'title', 'Validation errors');
                window.parent.$("#dialogGlobal").dialog("open");

                return false;
            }
            if (result.status == "created") {
                technoDoc._id=result.data._id;
                window.parent.radarController.reloadRadar();
            }
            if (result.status == "modified") {
                window.parent.radarController.reloadRadar();
            }

            infosGeneric.isModifying = 0;
            return true;

        }

    }

    self.delete = function () {
        if (confirm("delete technology" + technoDoc.name)) {
            var index = util.find(window.parent.dataArray, "id", technoDoc.id, true).$findIndexes[0];
            window.parent.dataArray[index].hide = 1;
            window.parent.dataArray[index].deleted = 1;
            window.parent.d3radar.setPointsVisibility(window.parent.dataArray);
            window.parent.d3radar.drawRadarD3(window.parent.dataArray)
            window.parent.dataArray.splice(index, 1);

            devisuProxy.deleteItem(dbName, "technologies", technoDoc.id, function (result) {
                if(Gparams.synchronizeMongoToNeo){
                    mongoToNeoSynchronizer.pushToNeo("delete",{dbName:dbName,collection:"technologies"},result.object);
                }
                devisuProxy.deleteItemByQuery(dbName, "r_T_DC", {techno_id: technoDoc.id}, true, function (result) {
                    if(Gparams.synchronizeMongoToNeo){
                        mongoToNeoSynchronizer.pushToNeo("delete",{dbName:dbName,collection:"r_T_DC"},result.object);
                    }

                    common.setMessage("item deleted", "green");
                })
            });
        }

    }

return self;
})
()
