/**
 * Created by claud on 09/06/2017.
 */
var infoGenericDisplay = (function () {
    var self = {};
    var currentTreeModel;
    var currentEditCollection;
    var currentDoc;
    var currentTreeObj;


    self.saveDoc = function () {
        var newId = infosGeneric.save(dbName, currentEditCollection, currentDoc);
        self.synchronizeTreeModelData("updateName", currentTreeObj.type, currentDoc);

    }
    self.deleteDoc = function () {

        var newId = infosGeneric.save(dbName, currentEditCollection, currentDoc);
        self.synchronizeTreeModelData("delete", currentTreeObj.type, currentDoc);


    }

    self.buildJoinTreeModel = function (joinTreeModel) {
        var newTreeModel = {types: [], sources: []};
        for (var i = 0; i < joinTreeModel.join.length; i++) {
            var modelName = joinTreeModel.join[i].model;
            var subtree = infosGenericParams.treeModels[modelName];
            var model = subtree.model;
            for (var j = 0; j < model.length; j++) {

                newTreeModel.types.push(model[j])
            }

            var collection = subtree.mongoCollection;
            var key = joinTreeModel.join[i].key;
            newTreeModel.sources.push({
                collection: collection,
                key: key
            })

        }
        var data = []
        for (var i = 0; i < newTreeModel.sources.length; i++) {
            var data1 = devisuProxy.loadData(dbName, newTreeModel.sources[i].collection, {});
            if (i == 0)
                data = data1;
            else
                data = util.joinData(data, newTreeModel.sources[i - 1].key, data1, newTreeModel.sources[i].key)
        }
        newTreeModel.data = data;
        return newTreeModel;
    }


    self.loadTree = function (name, _query) {
        var treeModel = infosGenericParams.treeModels[name];

        if (treeModel.join)
            treeModel = self.buildJoinTreeModel(treeModel);
        else
            treeModel.model.name = name;
        currentTreeModel = treeModel;
        var query = {};
        var modelQuery = treeModel.mongoQuery;
        if (modelQuery)
            query = modelQuery;

        if (_query) {
            for (var key in _query) {
                query[key] = _query[key];
            }
        }

        devisuProxy.loadData(dbName, treeModel.mongoCollection, query, function (result) {
            result= self.addEntitiesWithoutRelationsToTreeData(name,result);
            common.setMessage(result.length + " items loaded", "blue", "messageSpan")
            treeController.load("genericTree", result, treeModel.model, false, infoGenericDisplay.onTreeAction);
            $("#treeHeader").css("visibility", "visible");
          //  $("#treeContainer").css("height", "500px");
        });

    }


    self.onTreeAction = function (action, obj) {
        $("#nodeType").html(obj.type);


        for (var key in obj.node) {
            if ($.isPlainObject(obj.node[key]))
                delete obj.node[key]
        }


        if (action == "infos") {
            currentTreeObj = obj;
            var fieldModel = infosGenericParams.fieldModels[obj.type];
            if(!fieldModel){
                self.clearEntityDiv();
                return;
            }
            currentEditCollection = fieldModel.mongoCollection;
            var id = obj.id;
            id = common.convertNumStringToNumber(id);

            var query = {}
            query.id = id;
            var data = devisuProxy.loadDataFields(dbName, fieldModel.mongoCollection, query);
            var doc = {}
            if (data.length > 0) {
                var doc = data[0];
                currentDoc = doc;
            }
            infosGeneric.setAttributesValue(fieldModel.mongoCollection, doc, fieldModel.fields);
            infosGeneric.drawAttributes(fieldModel.fields, "infosDiv");
            infosGenericSpecific.onAfterLoadInfosDiv(obj.type);
            $("#infosHeader").css("visibility", "visible");


        }
        if (action == "create") {
            if (obj.node && obj.node.password)
                obj.node.password = "";
            // ajout dans la collection de relation

            var relationCollection = currentTreeModel.mongoCollection;
            var fieldModel = infosGenericParams.fieldModels[obj.type];
            var objCollection = null;
            if (fieldModel)
                objCollection = fieldModel.mongoCollection;
            var treeModelElement = infosGenericParams.getTreeModelElement(currentTreeModel.model.name, obj.type);
            var newObj = {
                name: obj.node[treeModelElement.text]
            }

            if(treeModelElement.chooseInList) {
                var newRelObj = obj.node;

                delete newRelObj.$findIndexes;
                devisuProxy.addItem(dbName, relationCollection, newRelObj, false, function (result) {
                    self.clearEntityDiv();
                //    self.reloadTree();
                    common.setMessage("relation created", "green")
                });

            }
            else if (objCollection && objCollection != relationCollection  ) {
                devisuProxy.addItem(dbName, objCollection, newObj, false, function (result) {
                    newObj.id = result.id;
                    newObj.type = obj.type;


                    if (objCollection == relationCollection) {
                        self.clearEntityDiv()
                        $("#infosHeader").css("visibility","hidden");
                      // self.onTreeAction("infos", newObj);
                        common.setMessage("relation created", "green")
                    } else {
                        var newRelObj = obj.node;
                        newRelObj[treeModelElement.id] = result.id;
                        delete newRelObj.id;
                        delete newRelObj.$findIndexes;
                        devisuProxy.addItem(dbName, relationCollection, newRelObj, false, function (result) {
                            var obj2;

                            obj2 = {
                                type: obj.type,
                                id: result.id
                            }
                            self.onTreeAction("infos", obj2);
                            // self.reloadTree()
                            common.setMessage("node and relation created", "green")
                        })
                    }

                });
            }
            else {
                var newRelObj = obj.node;
                //    newRelObj[treeModelElement.id] = result.id;

                devisuProxy.addItem(dbName, relationCollection, newRelObj, false, function (result) {
                    var obj2;

                    obj2 = {
                        type: obj.type,
                        id: result.id
                    }

                        self.onTreeAction("infos", obj2);

                   // self.reloadTree();
                    common.setMessage("relation created", "green")
                })
            }


        }

        if (action == "delete") {
            if (!confirm("delete node and its relation"))
                return;
            var relationCollection = currentTreeModel.mongoCollection;
            var fieldModel = infosGenericParams.fieldModels[obj.type];
            var objCollection = fieldModel.mongoCollection;
            var treeModelElement = infosGenericParams.getTreeModelElement(currentTreeModel.model.name, obj.type);
            var relQuery = {}
            relQuery[treeModelElement.id] = obj.node[treeModelElement.id];
            devisuProxy.deleteItemByQuery(dbName, relationCollection, relQuery, true, function (result) {
                if (objCollection == relationCollection) {
                  self.clearEntityDiv();
                    common.setMessage("node deleted", "green")
                }
                else {
                    if(treeModelElement.chooseInList)// si uniquement relation on ne détruit pas l'entité
                        return;


                    var objQuery = {id: obj.node[treeModelElement.id]}
                    devisuProxy.deleteItemByQuery(dbName, fieldModel.mongoCollection, objQuery, true, function (result) {
                        delete obj.node[treeModelElement.id];
                       self.clearEntityDiv()
                        common.setMessage("node and relation deleted", "green")
                    })
                }

            });
        } else if (action == "chooseInList") {
            var fieldModel = infosGenericParams.fieldModels[obj.type];
            var objCollection = fieldModel.mongoCollection;
            currentTreeObj = obj;
            devisuProxy.loadDataFields(dbName, objCollection, {}, {name: 1, id: 1}, function (data) {
                util.sortByField(data, "name");
                var str = infosGeneric.getSelectFromData(data, "id", "name", null, "infoGenericDisplay.createRelationFromList");

                self.setEntityDiv(str);
            });
        }

        else if (action == "update") {

        }


    }


    self.createRelationFromList = function (listSelect) {
        var option = listSelect.options[listSelect.selectedIndex];
        var value = option.value;
        var text = option.text;


        $('#genericTree').jstree(true).create_node(currentTreeObj.parent, {
            text: text,
            type: currentTreeObj.type,
            listId:value
            //   }, "first", infoGenericDisplay.clearEntityDiv());
       }, "first", treeController.onRename);


    }
    self.setEntityDiv=function(str){
        $("#infosHeader").css("visibility","visible");
        $("#infosDiv").html(str);
    }
    self.clearEntityDiv=function(){
        $("#infosHeader").css("visibility","hidden");
        $("#infosDiv").html("");
    }

    self.synchronizeTreeModelData = function (action, type, currentDoc) {//update Name in relation
        for (var key in infosGenericParams.treeModels) {
            var relationCollection = infosGenericParams.treeModels[key].mongoCollection;
            var model = infosGenericParams.treeModels[key].model;
            if (!model)
                continue;
            for (var i = 0; i < model.length; i++) {
                if (model[i].type == type) {

                    if (action == "updateName") {
                        var fields = {};
                        fields[model[i].text] = currentDoc.name;
                        var query = {};
                        query[model[i].id] = currentDoc.id;
                        devisuProxy.updateItemFields(dbName, relationCollection, query, fields, function (result) {

                        })
                    }
                    else if (action == "delete") {
                        var query = {};
                        query[model[i].id] = currentDoc.id;
                        devisuProxy.deleteItemByQuery(dbName, relationCollection, query, true)
                    }
                }
            }
        }
        self.reloadTree();
    }


    /*


     complete la collection de relation du modele avec les records de la collection d'objets de premier niveauqui n'ont pas encore de relation
     */
    self.addEntitiesWithoutRelationsToTreeData = function (modelName, relationData) {
        var model = infosGenericParams.treeModels[modelName];
        var relationCollection = model.mongoCollection;

        modelItems = model.model;
        for (var i = 0; i < 1; i++) {
            var entityItem = modelItems[i];

            var entityCollection = infosGenericParams.fieldModels[entityItem.type].mongoCollection;
            var entityData = devisuProxy.loadData(dbName, entityCollection, {});
            for (var j = 0; j < entityData.length; j++) {
                var exists = false;
                for (var k = 0; k < relationData.length; k++) {
                    if (relationData[k][entityItem.id] == entityData[j].id)
                        exists = true;
                }
                if (!exists) {
                    var newRelObj= {}
                    newRelObj[entityItem.id]=entityData[j].id;
                    newRelObj[entityItem.text]=entityData[j].name;

                    relationData.push(newRelObj);
                }
            }
        }

        util.sortByField(relationData,"name");
        return relationData;

    }

    self.reloadTree = function (name) {
        if (!name)
            var name = $("#viewSelect").val();
        self.loadTree(name);
    }


    return self;
})
()