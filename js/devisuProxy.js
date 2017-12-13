var devisuProxy = (function () {
    var self = {};

//moved  var serverUrl = "../mongo";
// ************** general CRUD*********************************************
    self.callServer = function (action) {
       var  params = "action=" + action;

        return executeQuery(params, "GET", "json");

    }


    self.loadData = function (dbName, collectionName, jsonQuery, callback, jsonProcessing) {
        return self.loadDataFields(dbName, collectionName, jsonQuery, null, callback, jsonProcessing);

        /*	if (jsonQuery)
         jsonQuery = JSON.stringify(jsonQuery);
         else
         jsonQuery = "";
         if(!jsonProcessing){
         jsonProcessing="";
         }
         else{
         jsonProcessing = JSON.stringify(jsonProcessing);
         jsonProcessing = encodeURIComponent(jsonProcessing);
         }

         params = "action=loadData&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonQuery=" + jsonQuery+"&jsonProcessing="+jsonProcessing;
         return executeQuery(params, "GET", "json", callback);*/
    }


    self.loadDataFields = function (dbName, collectionName, jsonQuery, fields, callback, jsonProcessing) {
        if (jsonQuery)
            jsonQuery = JSON.stringify(jsonQuery);
        else
            jsonQuery = "";
        if (fields)
            fields = JSON.stringify(fields);
        else
            fields = "";

        if (!jsonProcessing) {
            jsonProcessing = "";
        }
        else {
            jsonProcessing = JSON.stringify(jsonProcessing);
            jsonProcessing = encodeURIComponent(jsonProcessing);
        }

        params = "action=loadDataFields&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonQuery=" + jsonQuery + "&fields=" + fields + "&jsonProcessing=" + jsonProcessing;
        return self.executeQuery(params, "GET", "json", callback);
    }

    /*
     * starTime and endTime are long

     */
    self.getDataBetweenDates = function (dbName, collectionName, dateField, startTime, endTime, jsonQuery, jsonFields, jsonProcessing) {
        jsonQuery = JSON.stringify(jsonQuery);
        jsonQuery = encodeURIComponent(jsonQuery);
        jsonFields = JSON.stringify(jsonFields);
        jsonFields = encodeURIComponent(jsonFields);
        jsonProcessing = JSON.stringify(jsonProcessing);
        jsonProcessing = encodeURIComponent(jsonProcessing);
        params = "action=getDataBetweenDates&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonProcessing=" + jsonProcessing + "&jsonFields=" + jsonFields + "&jsonQuery=" + jsonQuery + "&dateField=" + dateField + "&startTime=" + startTime + "&endTime=" + endTime;
        return self.executeQuery(params, "GET", "json", null);
    }

    self.saveData = function (dbName, collectionName, jsonData) {
        if (!$.isArray(jsonData))
            jsonData = [jsonData];
        for(var i=0;i<jsonData.length;i++){
            delete jsonData[i]._id;
        }
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=saveData&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonData=" + jsonData;
        var data = "random=" + Math.random() + "&" + params;
        self.saveDataPOST(data, null, "message");
        return "data saved";
    }

    self.addItems = function (dbName, collectionName, jsonData,callback) {
        if (!$.isArray(jsonData))
            jsonData = [jsonData];
        for (var i = 0; i < jsonData.length; i++) {
            self.addItem(dbName, collectionName, jsonData[i],true,callback);
        }
        return jsonData.length + " items added";
    }



    self.addItem = function (dbName, collectionName, jsonData, withoutModifiedBy,callback) {
        if (!withoutModifiedBy)
            jsonData.modifiedBy = userLogin;
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=addItem&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonData=" + jsonData;

        return self.executeQuery(params, "GET", "json",callback);

    }

    self.updateItem = function (dbName, collectionName, jsonData, withoutModifiedBy,callback) {
        if (!withoutModifiedBy)
            jsonData.modifiedBy = userLogin;
        delete jsonData._id;
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=updateItem&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonData=" + jsonData;
        if(!callback)
            callback=self.messageCallBackOk;

        self.executeQuery(params, "GET", "json", callback);
        return "item saved";
    }

    self.updateItemByQuery = function (dbName, collectionName, jsonQuery, jsonData, withoutModifiedBy,callback) {
        delete jsonData._id;
        if (!withoutModifiedBy)
            jsonData.modifiedBy = userLogin;
        if (jsonQuery)
            jsonQuery = JSON.stringify(jsonQuery);
        else
            jsonQuery = "";
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=updateItemByQuery&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonData=" + jsonData + "&jsonQuery=" + jsonQuery;
        if(!callback)
            callback=self.messageCallBackOk;

        self.executeQuery(params, "GET", "json", callback);
        return "item saved";
    }
    self.updateItemFields = function (dbName, collectionName, jsonQuery, jsonFields,callback) {
        if (jsonQuery)
            jsonQuery = JSON.stringify(jsonQuery);
        else
            return "query object is mandatory";
        jsonFields = JSON.stringify(jsonFields);
        jsonFields = encodeURIComponent(jsonFields);
        params = "action=updateItemFields&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonFields=" + jsonFields + "&jsonQuery=" + jsonQuery;
        if(!callback)
            callback=self.messageCallBackOk;
         self.executeQuery(params, "GET", "json",callback);
        return "item saved";
    }

    self.updateItems = function (dbName, collectionName, jsonData,callback) {
        for(var i=0;i<jsonData.length;i++){
            delete jsonData[i]._id;
        }
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=updateItems&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonData=" + jsonData;
        if(!callback)
            callback=self.messageCallBackOk;
         self.executeQuery(params, "GET", "json",callback);
        return "items saved";
    }

    self.deleteItem = function (dbName, collectionName, id,callback) {
        params = "action=deleteItem&dbName=" + dbName + "&collectionName=" + collectionName + "&id=" + id;
        if(!callback)
            callback=self.messageCallBackOk;
        self.executeQuery(params, "GET", "json", callback);
        return "item deleted";
    }

    self.deleteItemByQuery = function (dbName, collectionName, jsonQuery, withoutConfirmMessage,callback) {

        jsonQuery = JSON.stringify(jsonQuery);
        if (!withoutConfirmMessage && !confirm("Delete objects from collection " + dbName + "." + collectionName + " whith query " + jsonQuery + " ?"))
            return;
        params = "action=deleteItemByQuery&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonQuery=" + jsonQuery;
        if(!callback)
            callback=self.messageCallBackOk;
        self.executeQuery(params, "GET", "json", callback);
        return "item deleted";

    }


    self.getGroupStat = function (dbName, collectionName, jsonQuery, operator, field) {
        jsonQuery = JSON.stringify(jsonQuery);
        params = "action=getGroupStat&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonQuery=" + jsonQuery + "&operator=" + operator + "&field=" + field;
        return self.executeQuery(params, "GET", "json", null);
    }


    self.count = function (dbName, collectionName, jsonQuery) {
        jsonQuery = JSON.stringify(jsonQuery);
        params = "action=count&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonQuery=" + jsonQuery;
        return self.executeQuery(params, "GET", "json", null);

    }

    self.getDistinct = function (dbName, collectionName, jsonQuery, key) {
        jsonQuery = JSON.stringify(jsonQuery);
        key = encodeURIComponent(key);
        params = "action=getDistinct&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonQuery=" + jsonQuery + "&key=" + key;
        return self.executeQuery(params, "GET", "json", null);

    }

// ****************************** specific to
// graph*************************************
    self.getGraphAlldescendantLinksAndNodes = function (dbName, id) {
        params = "action=getGraphAlldescendantLinksAndNodes&dbName=" + dbName + "&id=" + id;
        return self.executeQuery(params, "GET", "json", null);
    }

// ****************************** specific to
// radar*************************************
    self.addNewRadarItem = function (dbName) {
        params = "action=addNewRadarItem&dbName=" + dbName;
        return self.executeQuery(params, "GET", "json", null);
    }

    /*function updateRadarCoordinates(dbName, collectionName,id, coordx, coordy) {
     params = "action=updateRadarCoordinates&dbName=" + dbName  + "&collectionName="+collectionName+"&id=" + id + "&coordx=" + coordx + "&coordy=" + coordy;
     executeQuery(params, "GET", "json", self.messageCallBackOk);
     }*/

    self.updateItemJsonFromRadar = function (dbName, collectionName, id, jsonData) {
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=updateItemJsonFromRadar&dbName=" + dbName + "&collectionName=" + collectionName + "&id=" + id + "&jsonData=" + jsonData;
        return self.executeQuery(params, "POST", "json", self.messageCallBackOk);
    }

    self.getRadarPoints = function (dbName, radarName, collectionName, jsonQuery, callback) {
        jsonQuery = JSON.stringify(jsonQuery);
        jsonQuery = encodeURIComponent(jsonQuery);
        params = "action=getRadarPoints&dbName=" + dbName + "&jsonQuery=" + jsonQuery + "&radarName=" + radarName + "&collectionName=" + collectionName;
        return self.executeQuery(params, "GET", "json", callback);

    }

    self.getRadarDetails = function (dbName, radarName, id) {
        params = "action=getRadarDetails&dbName=" + dbName + "&id=" + id + "&radarName=" + radarName;
        return self.executeQuery(params, "GET", "json", XXX);
    }

    self.updateRadarComment = function (dbName, collectionName, id, jsonData) {
        jsonData = JSON.stringify(jsonData);
        jsonData = encodeURIComponent(jsonData);
        params = "action=updateRadarComment&dbName=" + dbName + "&collectionName=" + collectionName + "&jsonData=" + jsonData;
        return self.executeQuery(params, "GET", "json", self.messageCallBackOk);
    }

    self.createAllPOTPowerpoints = function (dbName,bus,callback) {
        bus = encodeURIComponent(bus);
        params = "action=createAllPOTPowerpoints&dbName=" +dbName+"&bus=" +bus;
        return self.executeQuery(params, "GET", "json", callback);
    }

// *****************************others**************************************************

    self.saveRadarXml = function (fileName, xmlData, callback) {
        var formData = new FormData();
        formData.append("dbName", fileName);
        formData.append("xmlData", xmlData);
        $.ajax({
            url: 'radarUpload',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            error: function (response) {
                console.log(response);
                radarController.setMessage("Server Error", "red");
            },
            success: function (data) {
                if (callback)
                    callback();
                radarController.setMessage("Xml saved", "green");
            }
        });
    }

    self.tryLogin = function (dbName, login, password) {
        params = "action=tryLogin&dbName=" + dbName + "&login=" + login + "&password=" + password;
        return self.executeQuery(params, "GET", "json", null);
    }

    self.getCollectionNames = function (dbName) {
        params = "action=getCollectionNames&dbName=" + dbName;
        return self.executeQuery(params, "GET", "json", null);
    }

    self.getDBNames = function (dbName) {
        params = "action=getDBNames&dbName=" + dbName;
        return self.executeQuery(params, "GET", "json", null);

    }

// ****************************admin********************************************************

    self.createDB = function (dbName,callback) {
        params = "action=createDB&dbName=" + dbName;
        if(!callback)
            callback=self.messageCallBackOk;
        return self.executeQuery(params, "GET", "json",callback);
    }

    self.executeAction = function (action,callback) {
        params = "action=" + action;
        if(!callback)
            callback=self.messageCallBackOk;
        return self.executeQuery(params, "GET", "json",callback);
    }

// ****************************other********************************************************
    self.execSql = function (dbName, sqlConn, sqlRequest) {
        params = "action=execSql&dbName=" + dbName + "&sqlRequest=" + sqlRequest + "&sqlConn=" + sqlConn;
        return self.executeQuery(params, "GET", "json", null);
    }

    self.executeJavascript = function (dbName, script) {
        script = encodeURIComponent(jsonData);
        params = "action=executeJavascript&dbName=" + dbName + "&script=" + script;
        return self.executeQuery(params, "GET", "json", null);
    }


// *****************************RSS3D***************************************************
    /*
     * expression regexp periodType :$year $month $dayOfMonth $hour
     *
     */
    self.aggregateFeeds = function (expression, periodType, jsonQuery) {
        expression = encodeURIComponent(expression);
        jsonQuery = JSON.stringify(jsonQuery);
        jsonQuery = encodeURIComponent(jsonQuery);
        params = "action=aggregateFeeds&expression=" + expression + "&periodType=" + periodType + "&jsonQuery=" + jsonQuery;
        return self.executeQuery(params, "GET", "json", null);

    }

    self.getFeeds = function (expression, jsonQuery, limit) {
        expression = encodeURIComponent(expression);
        jsonQuery = JSON.stringify(jsonQuery);
        jsonQuery = encodeURIComponent(jsonQuery);
        params = "action=getFeeds&expression=" + expression + "&jsonQuery=" + jsonQuery + "&limit=" + limit;
        return self.executeQuery(params, "GET", "json", null);

    }


    /** *******************************calls execution********************* */

    self.messageCallBackOk = function (d) {
        // var str=JSON.stringify(d);
        common.setMessage(d.OK, "green");
    }

    self.executeQuery = function (params, method, format, callback) {
        var url = serverUrl + "?random=" + Math.random() + "&" + params;
        var d = null;
        if (true || url.length > 2048) {
            method = "POST";
            url = serverUrl + "?random=" + Math.random();
            d = params;
        }
        if (callback == null) { // synchronous
            var data;
            $.ajax({
                type: method,
                url: url,
                dataType: format,
                data: d,
                async: false,
                success: function (d) {

                    for (var i = 0; i < d.length; i++) { //$(d[i]._id).remove();$(d[i].lastModified).remove();
                      //  if (d[i] && d[i]._id)
                         //   delete d[i]._id;
                        if (d[i] && d[i].lastModified)
                            delete d[i].lastModified;
                    }
                    ;

                    data = d;
                },
                error: function (error, ajaxOptions, thrownError) {
                    console.log(error);
                    console.log(thrownError);
                    common.setMessage("server error" + thrownError,"red");
                }

            });
            return data;
        } else { // asynchronous
            $.ajax({
                type: method,
                url: url,
                dataType: format,
                async: false,
                success: callback,
                data: d,
                error: function (error, ajaxOptions, thrownError) {
                    console.log(error);
                    console.log(thrownError);
                    common.setMessage("server error" + thrownError,"red");
                }

            });
        }
    }

    self.getXmlDoc = function (fileName) {
        var doc;
        $.ajax({
            type: "GET",
            url: fileName,
            dataType: "xml",
            async: false,
            success: function (data) {
                doc = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(fileName);
                console.error(xhr.status);
                console.error(thrownError);
                common.setMessage("server error");
                doc = null; // "<?xml version="1.0" encoding="UTF-8"
                            // standalone="no"?>"
            }

        });
        return doc;
    }

    self.getTextDoc = function (fileName) {
        var doc;
        $.ajax({
            type: "GET",
            url: fileName,
            dataType: "text",
            async: false,
            success: function (data) {
                doc = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(url);
                console.error(xhr.status);
                console.error(thrownError);
                common.setMessage("server error");
            }

        });
        return doc;
    }

    self.saveDataPOST = function (data, dataType, messageDivId, url) {
        if (!url)
            url = serverUrl;

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (data) {
                var message = "Data saved";
                common.setMessage(message,"green");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(url);
                console.error(xhr.status);
                console.error(thrownError);

                common.setMessage("server error", "red");
            }

        });
    }

    return self;
})()