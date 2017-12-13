/**
 * Created by claud on 26/08/2017.
 */
var mongoToNeoSynchronizer = (function () {
    var self = {};
    var neoUrl = "http://localhost:3002";


    var schemaLoaded = false;
    self.pushToNeo = function (operation, payload, obj, callback) {

        function execute() {
            var relations = Schema.getRelations(null, null, payload.collection);

            if (relations.length > 0) {//relation
                pushRelation(operation, payload, obj, relations[0], callback);
            }
            else {//entities
                pushObject(operation, payload, obj, callback);
            }


        }

        if (!schemaLoaded) {
            var subGraph = payload.dbName;
            subGraph = "POT2019";
            Schema.serverUrl = neoUrl;
            Schema.load(subGraph, function (error, json) {
                if (error) {
                    console.log(error)
                    return;
                }
                schemaLoaded = true;

                execute();

            });
        }
        else {
            execute();
        }

    }


    var pushObject = function (operation, payload, obj, callback) {
        var label = payload.collection;
        var subGraph = payload.dbName;
        var mongoCollectionMappings = Schema.schema.mongoCollectionMapping;
        for (var key in mongoCollectionMappings) {
            if (mongoCollectionMappings[key] == payload.collection)
                label = key;
        }

        if (obj.name)


            if (operation == "create") {
                var neoObj = {}
                for (var key in obj) {
                    if (typeof obj[key] === "object")
                        ;
                    else if (obj[key] && obj[key] != "")
                        neoObj[key] = obj[key]

                }

                neoObj.mongoId = obj._id.$oid;
                var neoPayload = {
                    nodeAttrs: neoObj,
                    nodeLabel: label,
                    nodeSubGraph: subGraph,
                }

                callNeo("createNode", neoPayload, callback);

            }


            else if (operation == "update") {

                var neoSetObj = {}
                for (var key in obj) {
                    if (typeof obj[key] === "object")
                        ;
                    else if (obj[key] && obj[key] != "")
                        neoSetObj[key] = obj[key]

                }
                delete neoSetObj.mongoId
                var neoAttrObj = {
                    mongoId: obj.mongoId
                }

                var neoPayload = {
                    nodeSet: neoSetObj,
                    nodeLabel: label,
                    nodeAttrs: neoAttrObj,
                    nodeSubGraph: subGraph
                }
                callNeo("updateNode", neoPayload,callback);


            }
            else if (operation == "delete") {
                var neoPayload = {
                    nodeAttrs: {mongoId: obj.mongoId},
                }
                callNeo("deleteNode", neoPayload,callback);

            }
    }


    var pushRelation = function (operation, payload, obj, relation, callback) {
        var subGraph = payload.dbName;
        var startField = relation.mongoMapping.start.mongoId;
        var endField = relation.mongoMapping.end.mongoId;
        var neoPayload = {

            sourceNodeQuery: {id: obj[startField]},
            sourceNodeLabel: relation.startLabel,
            relType: relation.type,
        }
        if (obj[endField]) {
            neoPayload.targetNodeQuery = {id: obj[endField]};
            neoPayload.targetNodeLabel = relation.endLabel;
        }
        if (operation == "create") {
            callNeo("createRelation", neoPayload,callback);
        } else if (operation == "delete") {
            callNeo("deleteRelation", neoPayload,callback);
        }


    }

    var callNeo = function (operation, payload, callback) {
        $.ajax(neoUrl + '/rest?' + operation + '=1', {
            data: payload,
            dataType: "json",
            type: 'POST',
            error: function (error) {
                console.log(error.toString);
                // $("#message").html("ERROR " + error.responseText);
                if (callback)
                    return callback(error.toString());

            }
            ,
            success: function (data) {
                if (callback)
                    return callback(null, data);

            }
        });


    }


    return self;
})()