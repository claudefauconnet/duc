var infosAbstract = (function () {
    var self = {};


    self.setAttributesValue = function (collection, obj, attrObject) {


        for (var key in attrObject) {
            var value = "";
            if (obj)
                var value = obj[key];
            if (!value)
                value = "";
            var type = attrObject[key].type;

            if (type && type == 'readOnly') {
                attrObject[key].value = "&nbsp;:&nbsp;<b>" + value + "</b>";
                continue;
            }
            var selectValues = null;
            var selectFields = fieldsValues[collection];
            if (selectFields) {
                selectValues = selectFields[key];

            }

            if (selectValues) {
                selectValues.sort();
                //   console.log(selectValues);
                var str = "<select class='objAttrInput' id='attr_" + key + "'>"
                str += "<option  value=''></option>";
                for (var i = 0; i < selectValues.length; i++) {

                    var selected = "";
                    if (value == selectValues[i])
                        selected = " selected ";

                    str += "<option value='" + selectValues[i] + "' " + selected
                        + " >" + selectValues[i] + "</option>";
                }

                str += "</select>";
                value = str;
            }


            else if (!type || type == 'text') {
                var cols = attrObject[key].cols;
                var rows = attrObject[key].rows;
                var strCols = ""

                if (rows) {// textarea
                    if (cols)
                        strCols = " cols='" + cols + "' ";
                    rows = " rows='" + rows + "' ";
                    value = "<textArea class='objAttrInput' " + strCols + rows
                        + "id='attr_" + key + "' > " + value + "</textarea>";
                } else {
                    if (cols)
                        strCols = " size='" + cols + "' ";
                    value = "<input class='objAttrInput' " + strCols + "id='attr_"
                        + key + "' value=' " + value + "'>";
                }
            }
            attrObject[key].value = value;
        }

    }

    self.drawAttributes = function (attrObject, zoneId) {
        var str = "<table>"
        for (var key in attrObject) {
            var strVal = attrObject[key].value;
            str += "<tr><td>" + key + "</td><td>" + strVal + "</td></tr>";
        }
        str += "</table>";
        $("#" + zoneId).html(str);

    }


    self.setModifiedValues = function (obj, classId) {
        var fields = $(classId);
        if (!obj)
            obj = {}
        for (var i = 0; i < fields.length; i++) {

            var fieldId = $(fields[i]).attr('id').substring(5);
            var fieldValue = $(fields[i]).val();
            if (!fieldValue || fieldValue.length == 0)
                continue;
            if (fieldValue == " ")
                continue;

            obj[fieldId] = fieldValue;

        }
        return obj;

    }

    self.save = function (dbName, collection, obj, additionalAttrsObj) {

        var fields = $(".objAttrInput")
        for (var i = 0; i < fields.length; i++) {

            var fieldValue = $(fields[i]).val();
            if (!fieldValue || fieldValue.length == 0) {
                continue;
            }

            var key = fields[i].id.replace("attr_", "");

            fieldValue = common.convertNumStringToNumber(fieldValue);
            obj[key] = fieldValue;
        }
        obj.userLogin = userLogin;
        //  obj.lastModified="";
        if (additionalAttrsObj) {
            for (var key in additionalAttrsObj) {
                obj[key] = additionalAttrsObj[key];
            }
        }

        if (!obj.id) {//new
            var result = devisuProxy.addItem(dbName, collection, obj, false);
            window.parent.common.setMessage(result.status, "green", "attrsTabMessage");
            return result.id;

        }
        else//update
            devisuProxy.saveData(dbName, collection, obj, function (result) {
                window.parent.common.setMessage(result.id, "green", "attrsTabMessage");

            });
    }


    return self;
})()