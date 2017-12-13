/**
 * Created by claud on 01/06/2017.
 */

var adminTools = (function () {

    var self = {};


    self.extractListValues = function () {

        var acceptedHeaders = {};
        var colSep = "\t";
        var lineSep = "\n";//String.charCode(10);
        var str = "";
        var fieldValues={};
        acceptedHeaders["type,category,availability,companySkills,digitalPolarity,priority,year,marketSkills,isBB"] = "technologies";
        acceptedHeaders["source,Uc id,name,bu,year,BD,BC,description,scenario,horizon,businessValue,business_cat,main_technology,technical_cat,status,isInnovative,priority,riskLevel,easeOfImpl,Innovation_value,x,y"] = "use_cases";
        acceptedHeaders["type,name,category"] = "buildingBlocks";
        acceptedHeaders["id,name,businessValue,easeOfImpl,maturity,category,x,y,global,Costlevel,OrgSkills,excluded,horizon,marketSkills,numbOfBD,numbOfBU,numbOfUC,year,nUC"] = "scenarios";
        acceptedHeaders["name,id"] = "DCs";
        acceptedHeaders[" text,id,type,parent,data.obj.bu,data.obj.bu_id,data.obj.BD,data.obj.BD_id,data.obj.BC_id,data.obj.BC,data.obj.id,data.obj.type,data.BD,data.type,isLeaf"] = "use_cases_tree";


        for (var key in acceptedHeaders) {

            var collection = acceptedHeaders[key];
            var collObj={};
            fieldValues[collection]=collObj;
            var fields = key.split(",");
            for (var i = 0; i < fields.length; i++) {

                var values = devisuProxy.getDistinct(dbName, collection, null, fields[i]);

                if (!values || values.length == 0)
                    str += str += collection + colSep + fields[i] + colSep + "NO VALUES" + lineSep;
                else {
                    if (values.length < 10) {
                        collObj[fields[i]]=[];
                        for (var j = 0; j < values.length; j++) {
                            collObj[fields[i]].push(values[j]);
                            str += collection + colSep + fields[i] + colSep + values[j] + lineSep;
                        }
                    }
                }

            }
        }

     //   console.log(str);
        console.log(JSON.stringify(fieldValues))


    }


    return self;

})()






