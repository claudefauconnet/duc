/**
 * Created by claud on 07/08/2017.
 */
var schema = (function () {

    self = {};

    self.subShemas = {



        "POT2019": {
            "labels": ["BC", "BD", "BU", "DC", "company", "scenario", "technology", "useCase"],

            mongoCollectionMapping: {
                technology: "technologies",
                BC: "BCs",
                DC: "DCs",
                useCase: "use_cases",
                scenario: "scenarios"

            },
            "relations": {
                "hasDC": [{
                    "startLabel": "technology",
                    "endLabel": "DC",
                    "direction": "normal",
                    "mongoMapping": {
                        collection: "r_T_DC",
                        start: {"mongoId": "techno_id", "name": "techno_name"},
                        end: {"mongoId": "DC_id", "name": "DC_name"},

                    },
                }],
                "hasBD": [
                    {
                        "startLabel": "BU",
                        "endLabel": "BD",
                        "direction": "normal"
                    }
                ],
                "hasBC": [{
                    "startLabel": "BD",
                    "endLabel": "BC",
                    "direction": "normal",
                    "mongoMapping": {
                        collection: "BC",
                        start: {"BD_id": "BD_id", "BD_name": "BD_name", "BC_id": "BC_id2"},
                        endFilter: {"BC_id": "BC_id"},

                    },
                }],
                "usedIn": [{
                    "startLabel": "technology",
                    "endLabel": "scenario",
                    "direction": "normal",
                    "mongoMapping": {
                        collection: "r_SC_T",
                        start: {"mongoId": "techno_id", "name": "techno_name"},
                        end: {"mongoId": "SC_id", "name": "SC_name"},

                    },
                }],
                "usedBy": [
                    {
                        "startLabel": "DC",
                        "endLabel": "useCase",
                        "direction": "normal",
                        "mongoMapping": {
                            collection: "r_UC_T_DC",
                            end: {"mongoId": "UC_id", "name": "UC_name"},
                            start: {"mongoId": "DC_id", "name": "DC_name"},

                        },
                    }, {
                        "startLabel": "technology",
                        "endLabel": "useCase",
                        "direction": "normal",
                        "mongoMapping": {
                            collection: "r_UC_T_DC",
                            start: {"mongoId": "techno_id", "name": "techno_name"},
                            end: {"mongoId": "UC_id", "name": "UC_name"},

                        },
                    }],

                "inBC": [
                    {
                        "startLabel": "useCase",
                        "endLabel": "BC",
                        "direction": "normal",
                        "mongoMapping": {
                            collection: "useCase",
                            startFilter: {"mongoId": "id"},
                            end: {"mongoId": "BC_id", "BC_name": "BC_name"},

                        },

                    }, {
                        "startLabel": "useCase",
                        "endLabel": "scenario",
                        "direction": "normal",
                        "mongoMapping": {
                            collection: "r_SC_UC",
                            start: {"mongoId": "UC_id", "name": "UC_name"},
                            end: {"mongoId": "SC_id", "name": "SC_name"},

                        },
                    }]
              /*  "allowedBy": [{
                    "startLabel": "DC",
                    "endLabel": "technology",
                    "direction": "normal",
                    "mongoMapping": {
                        collection: "r_T_DC",
                        start: {"id": "DC_id", "name": "DC_name"},
                        end: {"id": "techno_id", "name": "techno_name"},

                    }
                },
                ]*/
                , "hasRole": [{
                    "startLabel": "user",
                    "endLabel": "role",
                    "direction": "normal",
                    "mongoMapping": {
                        collection: "user",
                        startFilter: {"login": "login"},
                        end: {"role": "role"}
                    }

                }]
            },

            "properties": {
                "technology": {

                    name: {
                        type: "text",
                    }
                    ,
                    id: {
                        type: "readOnly",
                    },
                    description: {
                        type: "text",
                        cols: 60,
                        rows: 5
                    },

                    examples: {
                        type: "text",
                        cols: 60,
                        rows: 5
                    },
                    resources: {
                        type: "text",
                        cols: 60,
                        rows: 5
                    },
                    advantages: {
                        type: "text",
                        cols: 60,
                        rows: 3
                    },
                    limitations: {
                        type: "text",
                        cols: 40,
                        rows: 3
                    }
                    ,
                    type: {
                        type: "select"
                    },
                    category: {
                        type: "select"
                    },
                    availability: {
                        type: "select",
                    },
                    companySkills: {
                        type: "select",
                    },
                    digitalPolarity: {
                        type: "select",
                    },
                    priority: {
                        type: "select",
                    },
                    marketSkills: {
                        type: "select",

                    },
                    maturity: {
                        type: "select",
                    },
                    year: {
                        type: "select",
                    },

                    isBB: {
                        type: "select",
                    },
                    layer: {
                        type: "select",
                    },
                    path: {
                        type: "text",

                    }


                }

                ,
                "DC": {

                    name: {
                        type: "text",
                    },
                    id: {
                        type: "readOnly",
                    },
                    description: {
                        type: "text",
                        cols: 60,
                        rows: 5
                    }


                }
                ,

                "useCase": {


                    business: {
                        type: "text",
                        cols: 30,
                        validation: {mandatory: 1}
                    },
                    scenario: {
                        type: "select",
                    },
                    bu: {
                        type: "select",

                    },
                    description: {
                        type: "text",
                        cols: 40,
                        rows: 7
                    },
                    currentSituation: {
                        type: "text",
                        cols: 40,
                        rows: 6
                    },
                    businessValue: {
                        type: "select",
                        validation: {mandatory: 1}
                    },
                    horizon: {
                        type: "select",
                        validation: {mandatory: 1}
                    },
                    /*   priority: {
                     type: "select",
                     list: "priority"
                     },*/
                    business_cat: {
                        type: "select",
                        label: "business category"
                    },
                    technical_cat: {
                        type: "select",
                        label: "technical category"
                    },

                    status: {
                        type: "text",

                    },
                    business_cat: {
                        type: "text",

                    },
                    riskLevel: {
                        type: "select",
                        list: "level",
                    },
                    easeOfImpl: {
                        type: "select",
                        list: "level"
                    },


                }
                ,

                "scenario": {

                    name: {
                        type: "text",
                    },
                    scenarioAttrs: {

                        businessValue: {

                            type: "select",

                        },
                        easeOfImpl: {
                            type: "select",
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

                        },
                        companySkills: {
                            type: "select",
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
                        },


                    }


                },

                "company": {

                    name: {
                        type: "text"
                    },
                    description: {
                        type: "text",
                        cols: 40,
                        rows: 6
                    }


                },


                "role": {

                    role: {
                        type: "text",
                        isName: true
                    },


                },
                "user": {

                    login: {
                        type: "text",
                        isName: true
                    },
                    password: {
                        type: "password"
                    },
                }

                /*  "BU": {
                 mongoCollection: "BU",
                 fields: {
                 name:{
                 type:"text"
                 },
                 description:{
                 type: "text",
                 cols: 40,
                 rows: 6
                 }

                 }

                 },
                 "BD": {
                 mongoCollection: "BD",
                 fields: {
                 name:{
                 type:"text"
                 },
                 description:{
                 type: "text",
                 cols: 40,
                 rows: 6
                 }

                 }

                 },
                 "BC": {
                 mongoCollection: "BC",
                 fields: {
                 name:{
                 type:"text"
                 },
                 description:{
                 type: "text",
                 cols: 40,
                 rows: 6
                 }

                 }

                 },*/





            },


            fieldsSelectValues: {
                "technology": {

                    "type": ["innovative", "Main Stream"],
                    "category": ["Physical world", "Physical world representation", "Data/info valorization", "IT means", "Communication / social", "Security", "Human computer interaction"],
                    "availability": ["> 5 yrs", "3-5 yrs", "< 3 yrs"],
                    "companySkills": [1, 2, 3, 4],
                    "digitalPolarity": [3, 4, 2, 1, 5],
                    "year": [2015, 2016, 2017, 2018, 2019, 2020, 2021],
                    "marketSkills": [1, 2, 3, 4],
                    "isBB": ["true", "false"],
                    "maturity": [1, 2, 3, 4],
                    "layer": ["Store Distribute and Process Data", "Delivery Channel", "Devices Producing or Consuming Data", "Applications and Business Insight", "IT Data Sources", "Data Capture and Integration", "Manage IT", "Analyze Data", "Data Transport"]

                }

                , "useCase": {
                    "bu": ["HD", "EP", "GP", "RC", "TS", "CORP", "MS"],
                    "year": [2016, 2017, 2018, 2019, 2020, 2021],
                    "easeOfImpl": [1, 2, 3],
                    "horizon": [1, 2, 3],
                    "businessValue": [1, 2, 3],
                    "isInnovative": ["x"],
                    "priority": ["Must", "Could", "Would", "Should"],


                    "riskLevel": ["low", "medium", "high"],
                    "business_cat": ["Asset value optimization", "Core Initiative enabling future digital developments", "Cross company collaboration & external ecosystem integration", "Customer relationship and engagement", "Customer understanding and knowledge", "Data valorization", "Digital workplace", "ELearning", "Innovation fostering", "Multichannel customer experience", "Operator enablement for better autonomy and decision making", "Process digitization improving operational efficiency", "Real time and remote monitoring / expertise / intervention", "Safety enhancement", "Simulation/modeling capabilities enhancement", "Upskilling capabilities enhancement"
                    ],
                    //"technical_cat": ["Business apps", "CRM", "Cloud", "Communication / Social", "Communication / social", "Data/info valorization", "Innovation acceleration", "Mobile App", "Mobile Apps", "Physical World", "Physical world", "Physical world representation", "Simulation & Modelling", "Web"],
                    "technical_cat": ["Geolocation", "3D practices", "Robotics & Drones", "Wearables", "RFID", "Media analytics", "Mobile payment", "Collaboration", "Mobility", "Internet Of things", "Digital workplace", "Open innovation", "Text - Speech translation", "Elearning", "Data management", "Electronic signature", "Business apps", "CRM"],
                    "Innovation_value": ["Increase productivity", "Reduce cost", "Improve agility", "Increase quality", "Maximize value", "Symplify business/process", "N/A"],
                    "status": ["0-hold", "1-discovery", "2-POC", "3-prototype", "4-industrialization", "5-deployed"]
                }
                , "buildingBlocks": {
                    "type": ["layer", "innovative", "Main Stream"],
                    "category": ["*", "Physical world", "Physical world representation", "Data/info valorization", "IT means", "Communication / social"]
                }
                , "scenario": {
                    "businessValue": [1, 2],
                    "easeOfImpl": [1, 2],
                    "maturity": [1, 2, 3, 4],
                    "priority": ["Must", "Could", "Would", "Should"],
                    "riskLevel": ["low", "medium", "high"],
                    "category": ["Data valorization", "Digital workplace", "Field Operations", "Business Relationship Management", "Facility Management", "Process Improvement", "Digital Infrastructure", "Open innovation"],
                    "costLevel": [1, 2, 3],
                    "companySkills": [1, 2, 3, 4],
                    "marketSkills": [1, 2, 3, 4],
                    "horizon": [1, 2, 3],
                    "year": [2016, 2017, 2018, 2019, 2020, 2021],
                }
            }
        }
        ,
        "jmsIOT": {
            labels: ["layer", "provider", "technology", "technologyFamily", "useCase"],
            relations: {
                "usesTechnology": [{
                    "startLabel": "useCase",
                    "endLabel": "technology",
                    "direction": "normal"
                }, {"startLabel": "technology", "endLabel": "useCase", "direction": "inverse"}],
                "belongsToLayer": [{
                    "startLabel": "layer",
                    "endLabel": "layer",
                    "direction": "normal"
                }, {
                    "startLabel": "layer",
                    "endLabel": "technologyFamily",
                    "direction": "inverse"
                }, {"startLabel": "technologyFamily", "endLabel": "layer", "direction": "normal"}],

                "belongsToFamily": [{
                    "startLabel": "technology",
                    "endLabel": "technology",
                    "direction": "normal"
                }, {
                    "startLabel": "technologyFamily",
                    "endLabel": "technology",
                    "direction": "inverse"
                }, {"startLabel": "technology", "endLabel": "technologyFamily", "direction": "normal"}],

                "offeredBy": [{
                    "startLabel": "provider",
                    "endLabel": "useCase",
                    "direction": "inverse"
                }, {"startLabel": "useCase", "endLabel": "provider", "direction": "normal"}]
            },
            "properties": {
                "useCase": {
                    "useCase": {"type": "text"},
                    "beneficeTemps": {"type": "text"},
                    "Business": {"type": "text"},
                    "Description": {"type": "text"},
                    "beneficeHSE": {"type": "text"},
                    "id": {"type": "text"},
                    "beneficeArgent": {"type": "text"},
                    "subGraph": {"type": "text"},
                    "beneficeServices": {"type": "text"},
                    "beneficeProductivite": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "businessDomain": {"type": "text"}
                },
                "layer": {
                    "layer": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"},
                    "id": {"type": "text"}
                },
                "provider": {
                    "provider": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"},
                    "id": {"type": "text"}
                },
                "technology": {
                    "technology": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"},
                    "id": {"type": "text"}
                },
                "technologyFamily": {
                    "id": {"type": "text"},
                    "technologyFamily": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"}
                }
            },
            fieldsSelectValues: {
                "technology": {

                    "type": ["innovative", "Main Stream"],
                    "category": ["Physical world", "Physical world representation", "Data/info valorization", "IT means", "Communication / social", "Security", "Human computer interaction"],
                    "availability": ["> 5 yrs", "3-5 yrs", "< 3 yrs"],
                    "companySkills": [1, 2, 3, 4],
                    "name": {
                        source: {collection: "technologies", distinct: "name", query: {"type": "innovative"}}
                    },
                    "digitalPolarity": [3, 4, 2, 1, 5],
                    "year": [2015, 2016, 2017, 2018, 2019, 2020, 2021],
                    "marketSkills": [1, 2, 3, 4],
                    "isBB": ["true", "false"],
                    "maturity": [1, 2, 3, 4],
                    "layer": ["Store Distribute and Process Data", "Delivery Channel", "Devices Producing or Consuming Data", "Applications and Business Insight", "IT Data Sources", "Data Capture and Integration", "Manage IT", "Analyze Data", "Data Transport"]

                }

                , "useCase": {
                    "bu": ["HD", "EP", "GP", "RC", "TS", "CORP", "MS"],
                    "year": [2016, 2017, 2018, 2019, 2020, 2021],
                    "easeOfImpl": [1, 2, 3],
                    "horizon": [1, 2, 3],
                    "businessValue": [1, 2, 3],
                    "isInnovative": ["x"],
                    "priority": ["Must", "Could", "Would", "Should"],
                    "techno_name": {
                        source: {collection: "r_UC_T_DC", distinct: "techno_name"}
                    },
                    "DC_name": {
                        source: {collection: "r_UC_T_DC", distinct: "DC_name"}
                    },
                    "business": {
                        source: {collection: "use_cases", distinct: "business"}
                    },
                    "name": {
                        source: {collection: "use_cases", distinct: "name", query: {"bu": "$currentBU"}}
                    },
                    "riskLevel": ["low", "medium", "high"],
                    "business_cat": ["Asset value optimization", "Core Initiative enabling future digital developments", "Cross company collaboration & external ecosystem integration", "Customer relationship and engagement", "Customer understanding and knowledge", "Data valorization", "Digital workplace", "ELearning", "Innovation fostering", "Multichannel customer experience", "Operator enablement for better autonomy and decision making", "Process digitization improving operational efficiency", "Real time and remote monitoring / expertise / intervention", "Safety enhancement", "Simulation/modeling capabilities enhancement", "Upskilling capabilities enhancement"
                    ],
                    //"technical_cat": ["Business apps", "CRM", "Cloud", "Communication / Social", "Communication / social", "Data/info valorization", "Innovation acceleration", "Mobile App", "Mobile Apps", "Physical World", "Physical world", "Physical world representation", "Simulation & Modelling", "Web"],
                    "technical_cat": ["Geolocation", "3D practices", "Robotics & Drones", "Wearables", "RFID", "Media analytics", "Mobile payment", "Collaboration", "Mobility", "Internet Of things", "Digital workplace", "Open innovation", "Text - Speech translation", "Elearning", "Data management", "Electronic signature", "Business apps", "CRM"],
                    "scenario": {source: {collection: "scenarios"}},
                    "Innovation_value": ["Increase productivity", "Reduce cost", "Improve agility", "Increase quality", "Maximize value", "Symplify business/process", "N/A"],
                    "status": ["0-hold", "1-discovery", "2-POC", "3-prototype", "4-industrialization", "5-deployed"]
                }
                , "buildingBlocks": {
                    "type": ["layer", "innovative", "Main Stream"],
                    "category": ["*", "Physical world", "Physical world representation", "Data/info valorization", "IT means", "Communication / social"]
                }
                , "scenarios": {
                    "businessValue": [1, 2],
                    "easeOfImpl": [1, 2],
                    "maturity": [1, 2, 3, 4],
                    "priority": ["Must", "Could", "Would", "Should"],
                    "name": {source: {collection: "scenarios", distinct: "name"}},
                    "riskLevel": ["low", "medium", "high"],
                    "category": ["Data valorization", "Digital workplace", "Field Operations", "Business Relationship Management", "Facility Management", "Process Improvement", "Digital Infrastructure", "Open innovation"],
                    "costLevel": [1, 2, 3],
                    "companySkills": [1, 2, 3, 4],
                    "marketSkills": [1, 2, 3, 4],
                    "horizon": [1, 2, 3],
                    "year": [2016, 2017, 2018, 2019, 2020, 2021],
                }
            }
        }
        ,



    }


    self.generateNeoImplicitSchema = function (subGraph, force) {
        if (self.subShemas[subGraph] && !force)
            return;
        var properties = {};
        for (var label in dataModel.labels) {
            if (!properties[label])
                properties[label] = {};
            var neoProps = dataModel.labels[label];
            for (var i = 0; i < neoProps.length; i++) {
                properties[label][neoProps[i]] = {
                    type: "text",
                }
            }


        }


        var implShema = {
            labels: dataModel.allLabels,
            relations: dataModel.allRelations,
            properties: properties,
            fieldsSelectValues: {}

        }
        if (force)
            console.log(JSON.stringify(implShema));
    }


    self.generateMongoImplicitSchema = function (subGraph, force) {
        if (self.subShemas[subGraph] && !force)
            return;
        var properties = {};
        var nCount = 0;
        var excludedFields = ["_id", "modifiedBy", "lastModified"];
        var payload = {listCollections: 1, dbName: subGraph}
        neoToMongo.callMongoRemote(payload, function (err, data) {
            properties[data[i]] = {}
            for (var i = 0; i < data.length; i++) {
                properties[data[i]] = {}
                var payload2 = {listFields: 1, collectionName: data[i], dbName: subGraph}
                neoToMongo.callMongoRemote(payload2, function (err, data2) {
                    nCount += 1
                    for (var j = 0; j < data2.length; j++) {
                        if (data2[j] != "" && excludedFields.indexOf(data2[j]) < 0) {
                            properties[data2.collectionName][data2[j]] = {
                                type: "text",
                                label: data2[j],
                            }
                        }
                    }
                    if (nCount == data.length - 1) {
                        var implShema = {
                            // labels: dataModel.allLabels,
                            //  relations: dataModel.allRelations,
                            properties: properties,
                            fieldsSelectValues: {}

                        }
                        if (force)
                            console.log(JSON.stringify(implShema));
                    }

                });


            }
        })


    }


    self.getPermittedRelations = function (subGraph, label, direction) {
        if (!direction)
            direction = "normal";
        var relationsPermitted = [];
        var relations = self.subShemas[subGraph].relations;
        for (var key in relations) {
            var relations2 = relations[key];
            for (var i = 0; i < relations2.length; i++) {
                var relation = relations2[i];
                relation.type = key;
                if (relation.startLabel == label && (direction == "normal" || direction == "both"))
                    relationsPermitted.push(relation);
                if (relation.endLabel == label && (direction == "inverse" || direction == "both")) {
                    relation.inverse=1;
                    relationsPermitted.push(relation);
                }


            }
        }
        return relationsPermitted;

    }


    self.getPermittedRelTypes = function (subGraph, startLabel, endLabel) {
        relTypes = [];
        var relations = self.subShemas[subGraph].relations;
        for (var key in relations) {
            var relations2 = relations[key];
            for (var i = 0; i < relations2.length; i++) {
                var relation = relations2[i];
                if (relation.startLabel == startLabel && relation.endLabel == endLabel)
                    relTypes.push(key)
            }
        }
        return relTypes;
    }
    self.getRelation = function (subGraph, startLabel, endLabel) {

        var relations = self.subShemas[subGraph].relations;
        for (var key in relations) {
            var relations2 = relations[key];
            for (var i = 0; i < relations2.length; i++) {
                var relation = relations2[i];
                if (relation.startLabel == startLabel && relation.endLabel == endLabel)
                   return relation;
            }
        }
        return null;
    }


    /*
     get the node property used as name  in UI (default "name")


     */
    self.getNameProperty = function (subGraph, label) {
        if (!self.subShemas[subGraph])
            return "name";
        var properties = self.subShemas[subGraph].properties[label];
        for (var field in properties) {
            if (properties[field].isName)
                return field

        }
        return "name";
    }


    return self;
})
()
