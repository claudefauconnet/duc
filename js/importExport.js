var userLogin = "import"
var serverUrl = "devisu";
var ImportExport = (function () {


    var self = {};

    var uploadObj = {}

    var acceptedHeaders = {};

    self.allowedDbs = ["POT2017"]
    var colSep = ";";
    var lineSep = "\n";

//objects
    acceptedHeaders["name,id,path,type,category,description,availability,examples,resources,advantages,limitations,companySkills,digitalPolarity,year,marketSkills,maturity,isBB,layer,x,y,xA,yA,h,w"] = "technologies";
    acceptedHeaders["name,id,source,business,bu,year,BD,BC,description,currentSituation,horizon,businessValue,business_cat,main_technology,technical_cat,status,isInnovative,priority,riskLevel,easeOfImpl,Innovation_value,x,y,scenario,scenario_id"] = "use_cases";
     acceptedHeaders["name,id,businessValue,easeOfImpl,maturity,category,x,y,OrgSkills,excluded,horizon,marketSkills,numbOfBD,numbOfBU,numbOfUC,year,nUC"] = "scenarios";
    acceptedHeaders["name,id"] = "DCs";
    acceptedHeaders["BU_name,BU_id,BD_name,BD_id,BC_name,BC_id,company_id,company_name"]="BCs";
    //relations
    acceptedHeaders["login,id,password,role"]="users";
   acceptedHeaders["UC_id,UC_name,techno_name,techno_id,DC_name,DC_id"] = "r_UC_T_DC";
    acceptedHeaders["techno_name,techno_id,DC_id,DC_name,"] = "r_T_DC";

    acceptedHeaders["UC_id,UC_name,techno_name,techno_id"] = "r_UC_T";
    acceptedHeaders["SC_name,SC_id,techno_name,techno_id,key"]="r_SC_T";
    acceptedHeaders["SC_name,SC_id,UC_name,UC_id"]="r_SC_UC";

    acceptedHeaders["mongoDB,type,request,name"]="requests";




        self.initExportCollectionSelect = function () {
        var collections = []
        for (var key in acceptedHeaders) {
            collections.push(acceptedHeaders[key]);
        }
        collections.splice(0, 0, "");
        common.fillSelectOptionsWithStringArray(exportCollectionSelect, collections)
        $("#exportCollectionButton").css("visibility", "visible");
    }
    self.initdatabaseSelect = function () {

        common.fillSelectOptionsWithStringArray(databaseSelect, dbs)
    }




    self.exportCollection = function (db,collection,onlyHeaders,outputType,lineSep) {

        if(!db)
            db = $("#databaseSelect").val();
        if(!collection)
         collection = $("#exportCollectionSelect").val();
        if(!onlyHeaders)
        onlyHeaders = $("#exportOnlyHeadersCBX").prop("checked");
        if(!outputType)
         outputType = $("#exportOutputType").val();
        if( !lineSep)
            lineSep = String.fromCharCode(10);
        var dataTableDataSet = [];
        devisuProxy.loadData(db, collection, {}, function (data) {


            var str = "";
            var headerStr = getHeaders(collection).trim();
            headerStr = headerStr.replace(/,/g,colSep)
            str += headerStr+colSep + lineSep;//"\n";


            var header = headerStr.split(colSep);

            for (var j = 0; j < data.length; j++) {
                var dataTableRow = [];
                dataTableDataSet.push(dataTableRow);
                for (var i = 0; i < header.length; i++) {

                    var value = data[j][header[i]];
                    if (!value)
                        value = "";
                    else if( header[i]=="password")
                        value="";
                    else {


                       if (value.replace) {
                           if(value.indexOf(colSep)>-1)
                               var xx="aaa"
                            // if(!$.isNumeric(value)) {
                            //   console.log(value);
                          //  var regex=new RegExp("["+colSep+",\n\r]","g")
                           var regex=new RegExp("["+colSep+"\n\r]","g")
                            value = value.replace(regex, " ")

                          //  value = value.replace(/\n/g, " ");
                         //   value = value.replace(/\r/g, " ")
                        }
                    }
                    if (!onlyHeaders) {
                        dataTableRow.push(value);
                        str += value + colSep;
                    }


                }
                str += lineSep;// "\n";
            }


            if (outputType == "screen") {


                util.fillDataTable(header, dataTableDataSet, "dataTableTable");
            }


            else if (outputType == "csv") {

                var a = document.createElement('a');

             //   var data = new Blob([str]);

                var data = new Blob([ str], {
                  //  type: "text/plain;charset=utf-8;"
                    type: "text/plain;UTF-8",
                    responseType: 'Content-Type: text/plain; charset=windows-1252'

                });

                a.setAttribute("href", URL.createObjectURL(data));
                a.setAttribute("download", "export_" + collection + ".csv");
                a.click();

                var xx = data;
            }
        })

    }

    function getHeaders(collection) {
        for (var key in acceptedHeaders) {
            if (acceptedHeaders[key] == collection)
                return key;
        }
        return null;
    }


    self.acceptFileType = function (file) {

        return true;
    }


    var setColsep=function(header){
        var colSeps=[
            {sep:";",freq:0},
            {sep:",",freq:0},
            {sep:"\t",freq:0},

        ]
        for (var i=0;i<colSeps.length;i++){
            colSeps[i].freq=util.countColSep(header,colSeps[i].sep)

        }
        util.sortByField(colSeps, "freq", true);
        colSep=colSeps[0].sep;

    }

    self.acceptFileContent = function (file) {




        var json = {"text": file};
        var txt = util.decode64(json.text);


        var start = txt.match(/[A-z]{2*}/);


        if(file.indexOf("x-zip")>0){
            txt = txt.substring(27)
         //   console.log(txt)
            var data = pako.inflate(txt);
        }
        txt = txt.substring(24)

        var header = txt.substring(0, txt.indexOf("\n")).trim();
        header=header.replace(/\r/g,"");
      setColsep(header);



     /*   if (header.indexOf(";") > 0)
            colSep = ";";
        else if (header.indexOf(",") > 0)
            colSep = ",";
        else if (header.indexOf("\t") > 0)
            colSep = "\t";
        //  console.log(header)*/

        if(header.charAt(header.length-1)==colSep)
            header=header.substring(0,header.length-1).trim();

        var regex=new RegExp(colSep,"g")
        header = header.replace(regex, ",");

        var collection = acceptedHeaders[header];
        var obj = util.csv2json(txt, colSep);
        if (obj.error) {
            return obj;
        }

        for(var i=0;i<obj.length;i++) {

            if (obj[i]["id"]!=null) {
                if (obj[i].id == "" || obj[i].id == ""+0 || obj[i].id == 0)
                    delete obj[i].id;
            }
        }
        if (collection) {
            uploadObj = {
                collection: collection,
                content: obj
            }
            return uploadObj;
        }
        else {
            return {error: "ERROR :file header not recognize"}
        }

        return null;
    }



    self.clearContent=function(){
        var importDB = $("#importDBSelect").val();
        var collection = $("#importDBSelect").val();
        if(confirm("Clear all content in collection :"+ uploadObj.collection))
            devisuProxy.deleteItemByQuery(importDB,uploadObj.collection,{});
    }


    self.importMongo = function () {
        var importDB = $("#importDBSelect").val();
        $("#importJournal").html("import started...")

        function executeAddItems() {
            var result = devisuProxy.addItems(importDB, uploadObj.collection, uploadObj.content, function () {
                //  common.setMessage("Import Done.", "green", "message");
                $("#importJournal").html("IMPORT Done  : " + uploadObj.content.length + "rows");
            });
        }

        function processDuplicatesAndAddItems() {
            var uniqueKey = "name";
            var newRecords = uploadObj.content;
            var duplicateOption = $('input[name="importOptionRadio"]:checked').val();
            //  var duplicateOption = $("[name='importOptionRadio']").val();
            var duplStr = "";

            var oldRecords = devisuProxy.loadData(importDB, uploadObj.collection, {}, function (oldRecords) {
                    var duplicates = {};
                    var nDupl = 0;
                    for (var i = 0; i < oldRecords.length; i++) {
                        for (var j = 0; j < newRecords.length; j++) {
                            if (newRecords[j][uniqueKey] == oldRecords[i][uniqueKey]) {
                                duplicates[j] = newRecords[j];
                                nDupl++;
                            }
                        }

                    }
                    if (nDupl > 0) {

                        for (var key in  duplicates) {
                            duplStr += "<li>" + duplicates[key][uniqueKey] + "</li>";
                        }
                        if (duplicateOption == "replace") {
                            for (var key in  duplicates) {
                                var query = {};
                                query[uniqueKey] = duplicates[key][uniqueKey];
                                devisuProxy.deleteItemByQuery(importDB, uploadObj.collection, query, true);


                            }
                            $("#importJournal").html("items created : " + (oldRecords.length - nDupl) + "<br>" + " items replaced : " + nDupl + "<ul>" + duplStr + "</ul>");

                        }
                        else if (duplicateOption == "ignore") {
                            for (var key in  duplicates) {
                                uploadObj.content.splice(duplicates[i], 1);
                            }
                            $("#importJournal").html("items created : " + (oldRecords.length - nDupl) + "<br>" + " items ignored : " + nDupl + "<ul>" + duplStr + "</ul>");

                        }
                        else if (duplicateOption == "stop") {

                            $("#importJournal").html("IMPORT STOPPED. Reason : " + uniqueKey + " duplicates exist : " + duplStr);
                            return;

                        }

                    }
                    executeAddItems();


                }
            );
        }

        if (!importDB) {
            alert("choose an existing database or NEW option");
            return;
        }


        if (importDB == "NEW") {
            importDB = prompt("Enter ew Database name")


            if (!importDB)
                return;
            else {
                devisuProxy.createDB(importDB, function () {

                    executeAddItems();
                    util.initDBsSelect(databaseSelect);

                })
            }
        } else {
            processDuplicatesAndAddItems()
        }
    }



    self.processZipUpload=function(data){
        var doneReading = function(zip){
            for (var i=0; i<zip.entries.length; i++) {
                var entry = zip.entries[i];
            }
        };

        var zipFile = new ZipFile(url, doneReading);
    }


    return self;
})()





