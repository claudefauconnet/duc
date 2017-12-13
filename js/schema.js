/**
 * Created by claud on 07/08/2017.
 */
var Schema = (function () {
    var serverDir = "./schemas/";
    self = {};
    self.subGraph;
    self.serverUrl="";

    self.schema = {
        labels: {},
        relations: {},
        properties: {},
        mongoCollectionMapping: {},
        fieldsSelectValues: {}
    }


    self.load = function (subGraph, callback) {
        self.subGraph = subGraph;
        var payload = {
            retrieve: 1,
            path: serverDir + subGraph + ".json",

        }
        $.ajax(Schema.serverUrl+'/jsonFileStorage', {
            data: payload,
            dataType: "json",
            type: 'POST',
            error: function (error, ajaxOptions, thrownError) {
                console.log(error);
                self.schema = {
                    labels: {},
                    relations: {},
                    properties: {},
                    mongoCollectionMapping: {},
                    fieldsSelectValues: {}
                }
                if (callback)
                    callback(error);

            }
            ,
            success: function (data) {
                if (data.result)
                    data = data.result;
                if (data) {
                    if (typeof data !== "object")
                        data = JSON.parse(data);

                    for (var key in self.schema) {// pour completer le champs vides non enregistrés par Jquery
                        if (!data[key])
                            data[key] = {};
                    }


                    self.schema = data;

                    //name  used in UI but not stored
                    for (var key in self.schema.relations) {
                        self.schema.relations[key].name = key
                    }

                    if (callback)
                        callback(null, self.schema);

                }

            }
        })
    }

    self.save = function (subGraph, json, callback) {
        if (!json)
            json = self.schema;

        //name  used in UI but not stored
        for (var key in self.schema.relations) {
            delete self.schema.relations[key].name
        }
        var payload = {
            store: 1,
            path: serverDir + subGraph + ".json",
            data: json///JSON.stringify(json)
        }
        $.ajax(Schema.serverUrl+'/jsonFileStorage', {
            data: payload,
            dataType: "json",
            type: 'POST',
            error: function (error, ajaxOptions, thrownError) {
                console.log(error);
                if (callback)
                    return callback("error " + error)

            }
            ,
            success: function (data) {
                self.schema = json;
                return callback(null, data);

            }
        })

    }


    self.getPermittedRelations = function (label, direction) {
        if (!direction)
            direction = "normal";
        var relationsPermitted = [];
        var relations = self.schema.relations;
        for (var key in relations) {
            var relation = relations[key];

            relation.type = key;
            if (relation.startLabel == label && (direction == "normal" || direction == "both"))
                relationsPermitted.push(relation);
            if (relation.endLabel == label && (direction == "inverse" || direction == "both")) {
                relation.inverse = 1;
                relationsPermitted.push(relation);
            }


        }
        return relationsPermitted;

    }


    self.getPermittedRelTypes = function (startLabel, endLabel) {
        relTypes = [];
        var relations = self.schema.relations;
        for (var key in relations) {
            var relations = relations[key];

            if (relation.startLabel == startLabel && relation.endLabel == endLabel)
                relTypes.push(key);
        }
        return relTypes;
    }


    self.getRelations = function (startLabel, endLabel,mongoCollection) {
        var matchingRels = []
        var relations = self.schema.relations;
        for (var key in relations) {
            var relation = relations[key];

            if (relation.startLabel == startLabel && relation.endLabel == endLabel)
                matchingRels.push(relation);
            if (relation.startLabel == startLabel && endLabel == null)
                matchingRels.push(relation);
            if (relation.endLabel == endLabel && startLabel == null)
                matchingRels.push(relation);
            if(relation.mongoMapping && relation.mongoMapping.collection==mongoCollection)
                matchingRels.push(relation);

        }
        return matchingRels;
    }


    /*
     get the node property used as name  in UI (default "name")


     */
    self.getNameProperty = function (label) {
        if (!self.schema)
            return "name";
        var properties = self.schema.properties[label];
        for (var field in properties) {
            if (properties[field].isName)
                return field

        }
        return "name";
    }


    self.updateRelationsModel = function (save) {
        var relationsNewModel = {}
        var relationss = self.schema.relations;
        for (var key in relationss) {
            var relations = relationss[key];
            for (var i = 0; i < relations.length; i++) {
                var relation = relations[i];
                if (relation.direction == "inverse")
                    continue;
                delete relation.direction;
                var name = key;
                if (i > 0)
                    var name = key + "_" + 1;

                relation.type = name;
                relationsNewModel[name] = relation;

            }
        }

        console.log(JSON.stringify(self.schema, undefined, 4));
        if (save) {
            self.schema.relations = relationsNewModel;
            self.save(self.subGraph, self.schema)

        }
        return relationsNewModel;

    }

    self.generateNeoImplicitSchema = function (subGraph, force) {
        if (self.schema && !force)
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
            relations: self.updateRelationsModel(dataModel.allRelations),
            properties: properties,
            fieldsSelectValues: {}

        }
        if (force)
            console.log(JSON.stringify(implShema, undefined, 4));
    }


    self.generateMongoImplicitSchema = function (subGraph, force) {
        if (self.schema && !force)
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
                            console.log(JSON.stringify(implShema, undefined, 4));
                    }

                });


            }
        })


    }


    /***********************************************************************************************************************/


    self.subShemas = {


        "POT2019": {
            "labels": {
                "BC": {icon: "BC.png"},
                "BD": {icon: "BU.png"},
                "BU": {icon: "BU.png"},
                "DC": {icon: "DC.png"},
                "company": {icon: "Company.png"},
                "scenario": {icon: "scenario.png"},
                "technology": {icon: "techno.png"},
                "useCase": {icon: "useCase.png"},
                "user": {},
                "role": {},

            },

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
                        title: name,
                    }
                    ,
                    id: {
                        type: "readOnly",
                    },
                    description: {
                        type: "text",
                        cols: 80,
                        rows: 5
                    },

                    examples: {
                        type: "text",
                        cols: 80,
                        rows: 5
                    },
                    resources: {
                        type: "text",
                        cols: 80,
                        rows: 5
                    },
                    advantages: {
                        type: "text",
                        cols: 80,
                        rows: 3
                    },
                    limitations: {
                        type: "text",
                        cols: 80,
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
                        cols: 80,
                        rows: 5
                    }


                }
                ,

                "useCase": {
                    name: {
                        type: "text",
                    },

                    business: {
                        type: "text",
                        cols: 30,
                        validation: {mandatory: 1}
                    },

                    description: {
                        type: "text",
                        cols: 80,
                        rows: 7
                    },
                    currentSituation: {
                        type: "text",
                        cols: 80,
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
                        list: "level",
                        title: "ease of implementation",
                        desc: "discribe the..sdfgdfgfh"
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
                        cols: 80,
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
                },

                "BU": {
                    mongoCollection: "BU",
                    fields: {
                        name: {
                            type: "text"
                        },
                        description: {
                            type: "text",
                            cols: 80,
                            rows: 6
                        }

                    }

                },
                "BD": {
                    mongoCollection: "BD",
                    fields: {
                        name: {
                            type: "text"
                        },
                        description: {
                            type: "text",
                            cols: 80,
                            rows: 6
                        }

                    }

                },
                "BC": {
                    mongoCollection: "BC",
                    fields: {
                        name: {
                            type: "text"
                        },
                        description: {
                            type: "text",
                            cols: 80,
                            rows: 6
                        }

                    }

                },


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


        /*********************************************************************************************************************************************************************/


        "jemsIOT": {

            "labels": {
                "provider": {},
                "solution": {},
                "technology": {icon: "techno.png"},
                "technologyFamily": {icon: "techno.png"},
                "architecturalLayer": {},
                "useCase": {icon: "useCase.png"},
                "scenario": {icon: "scenario.png"},
                "useCaseStage": {},
                "need": {},
                "domain": {},
                "sector": {},
                "offerFamily": {},
                "people": {},
                "company": {},

                "user": {},
                "role": {},

            },

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


        "hist-antiq": {
            "labels": ["", "Art", "Civilisation", "Dieu", "Evenement", "Groupe", "Heros", "Lieu", "Materiau", "Monstre", "MotCle", "Musee", "Oeuvre", "Periode", "Personne"],
            "relations": {
                "OU_PRESENCE": [{
                    "startLabel": "Evenement",
                    "endLabel": "Lieu",
                    "direction": "normal"
                }, {"startLabel": "Personne", "endLabel": "Lieu", "direction": "normal"}, {
                    "startLabel": "Lieu",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Oeuvre", "endLabel": "Musee", "direction": "normal"}, {
                    "startLabel": "Personne",
                    "endLabel": "MotCle",
                    "direction": "normal"
                }, {"startLabel": "Oeuvre", "endLabel": "Lieu", "direction": "normal"}, {
                    "startLabel": "Musee",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "Lieu", "endLabel": "Personne", "direction": "inverse"}, {
                    "startLabel": "Lieu",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "MotCle", "endLabel": "Personne", "direction": "inverse"}],
                "PARTIEDE": [{
                    "startLabel": "Evenement",
                    "endLabel": "Groupe",
                    "direction": "normal"
                }, {"startLabel": "Oeuvre", "endLabel": "Groupe", "direction": "normal"}, {
                    "startLabel": "Personne",
                    "endLabel": "Groupe",
                    "direction": "normal"
                }, {"startLabel": "Dieu", "endLabel": "Groupe", "direction": "normal"}, {
                    "startLabel": "Groupe",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "Groupe", "endLabel": "Dieu", "direction": "inverse"}, {
                    "startLabel": "Groupe",
                    "endLabel": "Personne",
                    "direction": "inverse"
                }, {"startLabel": "Groupe", "endLabel": "MotCle", "direction": "inverse"}, {
                    "startLabel": "MotCle",
                    "endLabel": "Groupe",
                    "direction": "normal"
                }, {"startLabel": "Groupe", "endLabel": "Evenement", "direction": "inverse"}, {
                    "startLabel": "Groupe",
                    "endLabel": "Monstre",
                    "direction": "inverse"
                }, {"startLabel": "Monstre", "endLabel": "Groupe", "direction": "normal"}, {
                    "startLabel": "Heros",
                    "endLabel": "Groupe",
                    "direction": "normal"
                }, {"startLabel": "Groupe", "endLabel": "Heros", "direction": "inverse"}],
                "QUOI_REPRESENTATION": [{
                    "startLabel": "Periode",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "MotCle", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Oeuvre",
                    "endLabel": "Lieu",
                    "direction": "normal"
                }, {"startLabel": "Oeuvre", "endLabel": "Heros", "direction": "normal"}, {
                    "startLabel": "Personne",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Oeuvre", "endLabel": "MotCle", "direction": "normal"}, {
                    "startLabel": "Oeuvre",
                    "endLabel": "Monstre",
                    "direction": "normal"
                }, {"startLabel": "Heros", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Lieu",
                    "endLabel": "MotCle",
                    "direction": "normal"
                }, {"startLabel": "Oeuvre", "endLabel": "Groupe", "direction": "normal"}, {
                    "startLabel": "Monstre",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "Oeuvre", "endLabel": "Dieu", "direction": "normal"}, {
                    "startLabel": "Evenement",
                    "endLabel": "MotCle",
                    "direction": "normal"
                }, {"startLabel": "Oeuvre", "endLabel": "Oeuvre", "direction": "normal"}, {
                    "startLabel": "MotCle",
                    "endLabel": "Lieu",
                    "direction": "inverse"
                }, {"startLabel": "Lieu", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Evenement",
                    "endLabel": "Personne",
                    "direction": "normal"
                }, {"startLabel": "Oeuvre", "endLabel": "Evenement", "direction": "normal"}, {
                    "startLabel": "Oeuvre",
                    "endLabel": "Periode",
                    "direction": "normal"
                }, {"startLabel": "Dieu", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Personne",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "Oeuvre", "endLabel": "Personne", "direction": "normal"}, {
                    "startLabel": "Groupe",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {
                    "startLabel": "MotCle",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Evenement", "endLabel": "Oeuvre", "direction": "inverse"}],
                "QUOI_MATERIAU": [{
                    "startLabel": "Oeuvre",
                    "endLabel": "Materiau",
                    "direction": "normal"
                }, {"startLabel": "Materiau", "endLabel": "Oeuvre", "direction": "inverse"}],
                "QUOI_CIVILISATION": [{
                    "startLabel": "Civilisation",
                    "endLabel": "Periode",
                    "direction": "inverse"
                }, {
                    "startLabel": "Lieu",
                    "endLabel": "Civilisation",
                    "direction": "normal"
                }, {
                    "startLabel": "Civilisation",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {
                    "startLabel": "Civilisation",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {
                    "startLabel": "Periode",
                    "endLabel": "Civilisation",
                    "direction": "normal"
                }, {"startLabel": "Civilisation", "endLabel": "Lieu", "direction": "inverse"}, {
                    "startLabel": "Oeuvre",
                    "endLabel": "Civilisation",
                    "direction": "normal"
                }, {"startLabel": "Evenement", "endLabel": "Civilisation", "direction": "normal"}],
                "QUI_REPRESENTATION": [{
                    "startLabel": "Evenement",
                    "endLabel": "Personne",
                    "direction": "normal"
                }, {
                    "startLabel": "MotCle",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Evenement", "endLabel": "MotCle", "direction": "normal"}, {
                    "startLabel": "Personne",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }],
                "QUAND_PERIODE": [{
                    "startLabel": "Oeuvre",
                    "endLabel": "Periode",
                    "direction": "normal"
                }, {"startLabel": "Periode", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Periode",
                    "endLabel": "Personne",
                    "direction": "inverse"
                }, {
                    "startLabel": "Periode",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Personne", "endLabel": "Periode", "direction": "normal"}, {
                    "startLabel": "Evenement",
                    "endLabel": "Periode",
                    "direction": "normal"
                }],
                "OU_DECOUVERTE": [{
                    "startLabel": "Oeuvre",
                    "endLabel": "Lieu",
                    "direction": "normal"
                }, {"startLabel": "Lieu", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Lieu",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Evenement", "endLabel": "Lieu", "direction": "normal"}],
                "PRESENTE": [{
                    "startLabel": "Civilisation",
                    "endLabel": "Musee",
                    "direction": "inverse"
                }, {"startLabel": "Musee", "endLabel": "Civilisation", "direction": "normal"}],
                "QUI_DISCIPLEDE": [{"startLabel": "Personne", "endLabel": "Personne", "direction": "normal"}],
                "QUI_AUTEUR": [{
                    "startLabel": "Personne",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Personne", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Lieu",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Evenement", "endLabel": "Personne", "direction": "normal"}, {
                    "startLabel": "MotCle",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Evenement", "endLabel": "Lieu", "direction": "normal"}, {
                    "startLabel": "Oeuvre",
                    "endLabel": "Personne",
                    "direction": "normal"
                }, {"startLabel": "Evenement", "endLabel": "MotCle", "direction": "normal"}, {
                    "startLabel": "Lieu",
                    "endLabel": "MotCle",
                    "direction": "normal"
                }, {"startLabel": "MotCle", "endLabel": "Lieu", "direction": "inverse"}],
                "EQUIVALENTA": [{
                    "startLabel": "Personne",
                    "endLabel": "Personne",
                    "direction": "normal"
                }, {"startLabel": "Heros", "endLabel": "Heros", "direction": "normal"}, {
                    "startLabel": "Dieu",
                    "endLabel": "Dieu",
                    "direction": "normal"
                }],
                "QUOI_ART": [{"startLabel": "Oeuvre", "endLabel": "Art", "direction": "normal"}, {
                    "startLabel": "Art",
                    "endLabel": "Personne",
                    "direction": "inverse"
                }, {"startLabel": "Art", "endLabel": "Oeuvre", "direction": "inverse"}, {
                    "startLabel": "Personne",
                    "endLabel": "Art",
                    "direction": "normal"
                }],
                "QUI_COMMANDITAIRE": [{
                    "startLabel": "Personne",
                    "endLabel": "Oeuvre",
                    "direction": "inverse"
                }, {"startLabel": "Lieu", "endLabel": "Evenement", "direction": "inverse"}, {
                    "startLabel": "Oeuvre",
                    "endLabel": "Personne",
                    "direction": "normal"
                }, {
                    "startLabel": "Evenement",
                    "endLabel": "Personne",
                    "direction": "normal"
                }, {
                    "startLabel": "Personne",
                    "endLabel": "Evenement",
                    "direction": "inverse"
                }, {"startLabel": "Evenement", "endLabel": "Lieu", "direction": "normal"}],
                "test": [{"startLabel": "Groupe", "endLabel": "Groupe", "direction": "normal"}],
                "QUI_FILSDE": [{"startLabel": "Personne", "endLabel": "Personne", "direction": "normal"}]
            },
            "properties": {
                "Oeuvre": {
                    "hauteur": {"type": "text"},
                    "subGraph": {"type": "text"},
                    "datedebut": {"type": "text"},
                    "datefin": {"type": "text"},
                    "nom": {"isName": true, "isName": true, "type": "text"},
                    "note": {"type": "text"},
                    "imageBlog": {"type": "text"},
                    "largeur": {"type": "text"},
                    "longueur": {"type": "text"},
                    "nombreelements": {"type": "text"}
                },
                "Evenement": {
                    "datefin": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"},
                    "datedebut": {"type": "text"},
                    "urlDbpedia": {"type": "text"}
                },
                "Periode": {
                    "subGraph": {"type": "text"},
                    "datedebut": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "datefin": {"type": "text"}
                },
                "Personne": {
                    "datefin": {"type": "text"},
                    "motifDuDeces": {"type": "text"},
                    "type": {"type": "text"},
                    "datedebut": {"type": "text"},
                    "fonction": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"},
                    "uri_DbPedia": {"type": "text"}
                },
                "Groupe": {"nom": {"isName": true, "type": "text"}, "subGraph": {"type": "text"}},
                "MotCle": {
                    "nom": {"isName": true, "type": "text"},
                    "subGraph": {"type": "text"},
                    "fonction": {"type": "text"}
                },
                "Musee": {"subGraph": {"type": "text"}, "nom": {"isName": true, "type": "text"}},
                "Dieu": {
                    "subGraph": {"type": "text"},
                    "nom": {"isName": true, "type": "text"},
                    "name": {"type": "text"},
                    "uri_BNF": {"type": "text"},
                    "fonction": {"type": "text"},
                    "uri_DbPedia": {"type": "text"}
                },
                "Monstre": {"nom": {"isName": true, "type": "text"}, "subGraph": {"type": "text"}},
                "Civilisation": {"subGraph": {"type": "text"}, "nom": {"isName": true, "type": "text"}},
                "Art": {"nom": {"isName": true, "type": "text"}, "subGraph": {"type": "text"}},
                "Lieu": {"nom": {"isName": true, "type": "text"}, "subGraph": {"type": "text"}},
                "Materiau": {"nom": {"isName": true, "type": "text"}, "subGraph": {"type": "text"}},
                "Heros": {"nom": {"isName": true, "type": "text"}, "subGraph": {"type": "text"}}
            }
            , fieldsSelectValues: {}
        }
    }

    return self;
})
()
