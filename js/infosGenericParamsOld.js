
var infosGenericParams = (function () {
var iconPath="./icons/"
    var self = {};
    var fieldModels = {
        "technology": {
            mongoCollection: "technologies",
            fields: {
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


        }

        ,
        "DC": {
            mongoCollection: "DCs",
            fields: {
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
        }
        ,

        "useCase": {
            mongoCollection: "use_cases",
            fields: {

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
        }
        ,

        "scenario": {
            mongoCollection: "scenarios",
            fields: {
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
            }

        },

         "company": {
            mongoCollection: "company",
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

        "role": {
            mongoCollection: "users",
            fields: {
                role:{
                    type:"text"
                },

            }

        },
        "user": {
            mongoCollection: "users",
            fields: {
                login:{
                    type:"text"
                },
                password:{
                    type:"password"
                },

            }

        }





    }



    var treeModels = {
        "scenarioXX": {
            join:[{model:"scenarios",key:"UC_id"},{model:"technology",key:"UC_id"}]
        }
        ,

        "users": {
            mongoCollection: "users",
            model: [{
                type: "role",
                text: "role",
                id: "role",
                icon: iconPath + Gparams.customIcons["POT"]["role"]

            }, {

                type: "user",
                text: "login",
                id: "id",
                icon: iconPath + Gparams.customIcons["POT"]["user"]

            }]
        },
        "business": {
            mongoCollection: "BCs",
            model: [{
                type: "company",
                text: "company_name",
                id: "company_id",
                icon: iconPath + Gparams.customIcons["POT"]["company"]

            }, {

                type: "BU",
                text: "BU_name",
                id: "BU_id",
                icon: iconPath + Gparams.customIcons["POT"]["BU"]

            },
                {
                    type: "BD",
                    text: "BD_name",
                    id: "BD_id",
                    icon: iconPath + Gparams.customIcons["POT"]["BD"],

                },
                {
                    type: "BCs",
                    text: "BC_name",
                    id: "BC_id",
                    icon: iconPath + Gparams.customIcons["POT"]["BC"],

                }, /* {
                 type: "useCase",
                 text: "UC_name",
                 id: "UC_id",
                 icon: iconPath + Gparams.customIcons["POT"]["useCase"],
                 }*/]
        }
        ,


        "technology": {
            mongoCollection: "r_T_DC",
            //   mongoQuery:{ "type" : "innovative"},
            model: [{
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

                }
            ]
        },

        "use_case": {
            mongoCollection: "r_UC_T_DC",
            //   mongoQuery:{ "type" : "innovative"},
            model: [
                {
                    type: "useCase",
                    text: "UC_name",
                    id: "UC_id",
                    icon: iconPath + Gparams.customIcons["POT"]["useCase"]

                },
                {
                    chooseInList: 1,
                    type: "technology",
                    text: "techno_name",
                    id: "techno_id",
                    icon: iconPath + Gparams.customIcons["POT"]["technology"]

                },
                {
                    chooseInList: 1,
                    type: "DC",
                    text: "DC_name",
                    id: "DC_id",
                    icon: iconPath + Gparams.customIcons["POT"]["DC"],

                }
            ]
        },
        "architecture": {
            mongoCollection: "r_SC_T",
            model: [{
                type: "scenario",
                text: "SC_name",
                id: "SC_id",
                icon: iconPath + Gparams.customIcons["POT"]["scenario"]

            },
                {
                    type: "technology",
                    text: "techno_name",
                    id: "techno_id",
                    icon: iconPath + Gparams.customIcons["POT"]["technology"],

                }
            ]
        },
        "scenarios": {
            mongoCollection: "r_SC_UC",
            model: [{
                type: "scenario",
                text: "SC_name",
                id: "SC_id",
                icon: iconPath + Gparams.customIcons["POT"]["scenario"]

            },
                {
                    type: "useCase",
                    text: "UC_name",
                    id: "UC_id",
                    icon: iconPath + Gparams.customIcons["POT"]["useCase"],

                }
                ,

            ]
        },

    }


    var fieldsSelectValues = {
        "technologies": {

            "type": ["innovative", "Main Stream"],
            "category": ["Physical world", "Physical world representation", "Data/info valorization", "IT means", "Communication / social","Security","Human computer interaction"],
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
            "layer": ["Store Distribute and Process Data","Delivery Channel","Devices Producing or Consuming Data","Applications and Business Insight","IT Data Sources","Data Capture and Integration","Manage IT","Analyze Data","Data Transport"]

        }

        , "use_cases": {
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
            "technical_cat": ["Geolocation","3D practices","Robotics & Drones","Wearables","RFID","Media analytics","Mobile payment","Collaboration","Mobility","Internet Of things","Digital workplace","Open innovation","Text - Speech translation","Elearning","Data management","Electronic signature","Business apps","CRM"],
            "scenario": {source: {collection: "scenarios"}},
            "Innovation_value": ["Increase productivity", "Reduce cost", "Improve agility", "Increase quality", "Maximize value", "Symplify business/process", "N/A"],
            "status": ["0-hold","1-discovery", "2-POC", "3-prototype", "4-industrialization","5-deployed"]
        }
        , "buildingBlocks": {
            "type": ["layer", "innovative", "Main Stream"],
            "category": ["*", "Physical world", "Physical world representation", "Data/info valorization", "IT means", "Communication / social"]
        }
        , "scenarios": {
            "businessValue": [1, 2],
            "easeOfImpl": [1, 2],
            "maturity": [1,2,3,4],
            "priority": ["Must", "Could", "Would", "Should"],
            "name": {source: {collection: "scenarios", distinct: "name"}},
            "riskLevel": ["low", "medium", "high"],
            "category": ["Data valorization", "Digital workplace", "Field Operations", "Business Relationship Management", "Facility Management", "Process Improvement", "Digital Infrastructure", "Open innovation"],
            "costLevel": [1,2,3],
            "companySkills": [1,2,3,4],
            "marketSkills": [1,2,3,4],
            "horizon": [1,2,3],
            "year": [2016, 2017, 2018, 2019, 2020, 2021],
        }

    }


    var filters = {
        "technologies": ["year", "category", "layer", "digitalPolarity", "maturity", "name"],
        "use_cases": ["businessValue", "horizon", "scenario","techno_name","DC_name" ,"riskLevel", "easeOfImpl", "business", "name", "priority", "business_cat", "technical_cat", "status", "year"],
        "scenarios": ["businessValue", "maturity", "name", "riskLevel", "easeOfImpl", "category", "priority", "companySkills", "marketSkills", "year"],

    }


    self.fieldModels = fieldModels;
    self.treeModels = treeModels;
    self.fieldsSelectValues = fieldsSelectValues;
    self.filters = filters;

    self.getTreeModelElement = function (name, type) {
        var treeModel = self.treeModels[name].model;
        for (var i = 0; i < treeModel.length; i++) {
            if (treeModel[i].type == type)
                return treeModel[i];
        }
        return null;

    }


    return self;


})()





