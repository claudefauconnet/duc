"properties": {
    "technology": {"properties": {
        "technology": {

            name: {
                type: "text",
                    title:name,
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
                    title:"ease of implementation",
                    desc:"discribe the..sdfgdfgfh"
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
        }

        "BU": {
            mongoCollection: "BU",
                fields: {
                name:{
                    type:"text"
                },
                description:{
                    type: "text",
                        cols: 80,
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
                        cols: 80,
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

        name: {
            type: "text",
                title:name,
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
            desc: "add links toward informative pages and contents"
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
            desc: "Innovative technologies are currently in the POT. Mainstream technologies can be use for scenario but are not studied by the innovation team anymore"
        },
        category: {
            type: "select"
            desc: "Category to regroup technologies in larger themes"
        },
        availability: {
            type: "select",
                desc: "To what extent is the technology available for industrialization? "
        },
        companySkills: {
            type: "select",
                title: "Company skills"
            desc: "are there internal resources that are knowledgeable, experts..."
        },
        digitalPolarity: {
            type: "select",
                title: "Digital polarity"
            desc:"How digital is this technology?"
        },
        priority: {
            type: "select",
        },
        marketSkills: {
            type: "select",
                title:"Market Skills"
            desc:"how easy will it be to find freelancers, experts, consulting firms with expertise on the technology"

        },
        maturity: {
            type: "select",
                desc: "is the technology implementable? 3 means mature"
        },
        year: {
            type: "select",
        },

        isBB: {
            type: "select",
                title:"Building Block ?"
            desc:"Technologies that are building block  can be used to represent architectures associated to a given scenario"
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
            title: "Activity"
            desc:"What set of tasks/missions is the use case related to"
        },

        description: {
            type: "text",
                cols: 80,
                rows: 7
            title:"Description"
        },
        currentSituation: {
            type: "text",
                cols: 80,
                rows: 6
            title:"Comments"
        },
        businessValue: {
            type: "select",
                validation: {mandatory: 1}
            title:"Business Value"
            desc:"How valuable is the use case perceived by the practitioners"
        },
        horizon: {
            type: "select",
                validation: {mandatory: 1}
            desc:"some use cases can be implemented very soon while others cannot realistically before a while. 1 means soon."
        },
        /*   priority: {
         type: "select",
         list: "priority"
         desc:"Relative to other use case, how fast should this one be implemented"
         },*/
        technical_cat: {
            type: "select",
                label: "technical category"
            title: "technical category"
            desc:"What is the technology that characterizes this use case"
        },

        status: {
            type: "select",
                list: "status"
            title:"Project status",
                desc:" Indicates where the project stand in the innovation process "

        },
        business_cat: {
            type: "select",
                label: "business category"
            title:"Business category",
                desc:" In what of type of business oriented activity could this use case be classified "

        },
        riskLevel: {
            type: "select",
                list: "level",
                title:"Risk Level",
                desc:" How uncertain would the implementation be in terms of duration, costs, success... "
        },
        easeOfImpl: {
            type: "select",
                list: "level",
                title:"ease of implementation",
                desc:" Indicates to what extent a use case can be easily implemented. 1 is very hard, 3 is easy "
        },


    }
,

    "scenario": {

        name: {
            type: "text",
        },

        business: {
            type: "text",
                cols: 30,
                validation: {mandatory: 1}
            title: "Activity"
            desc:"What set of tasks/missions is the use case related to"
        },

        description: {
            type: "text",
                cols: 80,
                rows: 7
            title:"Description"
        },
        currentSituation: {
            type: "text",
                cols: 80,
                rows: 6
            title:"Comments"
        },
        businessValue: {
            type: "select",
                validation: {mandatory: 1}
            title:"Business Value"
            desc:"How valuable is the use case perceived by the practitioners"
        },
        horizon: {
            type: "select",
                validation: {mandatory: 1}
            desc:"some use cases can be implemented very soon while others cannot realistically before a while. 1 means soon."
        },
        /*   priority: {
         type: "select",
         list: "priority"
         desc:"Relative to other use case, how fast should this one be implemented"
         },*/
        technical_cat: {
            type: "select",
                label: "technical category"
            title: "technical category"
            desc:"What is the technology that characterizes this use case"
        },

        status: {
            type: "select",
                list: "status"
            title:"Project status",
                desc:" Indicates where the project stand in the innovation process "

        },
        business_cat: {
            type: "select",
                label: "business category"
            title:"Business category",
                desc:" In what of type of business oriented activity could this use case be classified "

        },
        riskLevel: {
            type: "select",
                list: "level",
                title:"Risk Level",
                desc:" How uncertain would the implementation be in terms of duration, costs, success... "
        },
        easeOfImpl: {
            type: "select",
                list: "level",
                title:"ease of implementation",
                desc:" Indicates to what extent a use case can be easily implemented. 1 is very hard, 3 is easy "
        },



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
    }

    "BU": {
        mongoCollection: "BU",
            fields: {
            name:{
                type:"text"
            },
            description:{
                type: "text",
                    cols: 80,
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
                    cols: 80,
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
