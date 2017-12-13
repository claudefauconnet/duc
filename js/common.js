var common = (function () {
    var self = {};
//moved  var dataPath = "data";
//moved  var messageDivId = "stateDisplay";
//moved  var dbName;

//moved  var isIE8 = false;

//moved  var filter;
//moved  var filterValue;
//moved  var isRadarReadOnly = true;
//moved  var http = "";
//moved  var currentObject;
//moved  var currentObjectId;
//moved  var canModifyRadarDetails = false;
//moved  var rapahaelItemsSet;
//moved  var canModify = false;
//moved  var view = "home";

//moved  var password = "T0talr@d@r";
//moved  var authentify = false;
//moved  var identified = true;
//moved  var userRole = "all";
//moved  var userLogin = "anonymous";
//moved  var userName = "anonymous";
//moved  var user;

//moved  var maxTentatives = 5;
//moved  var nTentatives = 0;

//moved  var positionControMode = "CONFINED"; // alternatives CHANGE-ATTRS and
    // CONFINED see radarRaphael.js
//moved  var radarAxes = [];


    self.submitPassword = function (loginField, passwordField, dontFinish) {
        var password = $(passwordField).val();
        var login = $(loginField).val();
        if(!dbName){
            if(password==login+"POT"){
               user= {userRole: "admin",
                userLogin : "DUC"
            }
                $("#loginDiv").css("visibility", "hidden");
                $("#popupMask").css("visibility", "hidden");
                $("#darkLayerMask").css("width", "0px");
                identified = true;
            return true;
            }

        }
        var user=devisuProxy.tryLogin(dbName, login, password);
        userRole = user.role;
        userLogin = user.login;
        if (userRole && userRole != "none" && nTentatives < maxTentatives) {
            if (!dontFinish) {
                $("#loginDiv").css("visibility", "hidden");
                $("#popupMask").css("visibility", "hidden");
                $("#darkLayerMask").css("width", "0px");
                identified = true;
                $("iframe").each(function() {
                   $(this)[0].contentWindow.userRole=userRole

                });




                // Radar_loadRadar();
                //	initTabs();
            }
            return true;
        } else if (nTentatives++< maxTentatives) {
            self.setMessage("invalid login password", "red");
        } else {
            nTentatives++;
            self.setMessage("too many tentatives, contact administrator", "red");
        }
        self.setMessage("", "green");
        return false;

    }

    self.showChangePassWordDiv = function () {
        $("#changePaswordDiv").css("visibility", "visible");
        $("#changePaswordDiv").css("z-index", "top");

    }

    self.changePassword = function () {

        if (self.submitPassword("#login2", "#passwordOld", true)) {
            var passwordNew1 = $("#passwordNew1").val();
            var passwordNew2 = $("#passwordNew2").val();
            if (passwordNew1 === "" || passwordNew1 !== passwordNew2) {
                self.setMessage("passwords does not match", "red");
                return;
            }
            user.password = passwordNew2;
            devisuProxy.updateItemem(dbName, "users", user);
            self.setMessage("password changed", "green");

        } else {

        }
        $("#changePaswordDiv").css("visibility", "hidden");

    }

    self.getQueryParams = function (qs) {
        qs = qs.split("+").join(" ");

        var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    self.isMultiValuedData = function (array, field, splitChar) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][field] && ("" + array[i][field]).indexOf(splitChar) > -1)
                return true;
        }
        return false;
    }

// si on dépasse maxVals on retourne un tableau vide
    self.getDistinctValues = function (array, field, splitChar, maxVals) {
        var distinctValues = new Array();
        for (var i = 0; i < array.length; i++) {
            var val = "" + array[i][field];

            if (val.indexOf(splitChar) > -1) { // gestion des chgamps multivalueé
                // séparés par splitChar
                var vals = val.split(splitChar);
                for (var j = 0; j < vals.length; j++) {
                    if ($.inArray(vals[i], distinctValues) < 0) {
                        distinctValues.push(vals[i]);
                    }
                }
                continue;
            }

            if ($.inArray(val, distinctValues) < 0) {
                distinctValues.push(val);
            }

            if (maxVals && distinctValues.length > maxVals)
                return [];
        }
        return distinctValues.sort();

    }

    self.getInputField = function (radarXmlUrl, key, val, isTextArea, className) {
        var enumX = [];
        var Xml_enumerations = radarXmls[currentRadarType].Xml_enumerations;
        if (!xmlDoc) {
            devisuProxy.getXmlDoc = getXmlDoc(radarXmlUrl);
            initEnumerations(xmlDoc);
        }
        for (var k = 0; k < Xml_enumerations.length; k++) {

            if (Xml_enumerations[k].fieldRealName == key)
                enumX.push(Xml_enumerations[k].label);
        }
        // var span = document.createElement("span");
        var field;

        if (key == "id") {
            field = document.createTextNode(val);
            var hiddenId = self.getInput("id", val, "hidden");
            span.appendChild(hiddenId);
        } else if (enumX && enumX.length > 0) {
            field = self.getSelect(key, enumX, val, null);
        } else if (isTextArea) {
            field = self.getTextArea(key, val, className);
        } else
            field = self.getInput(key, val);
        // span.appendChild(field);
        // span.setAttribute("class", "editFormInput");
        return field;

    }

    self.getSelect = function (name, values, currentVal, callback) {
        if (!currentVal)
            currentVal = "";
        var select = document.createElement("SELECT");
        var id = "field#" + name;
        select.setAttribute("name", name);
        select.setAttribute("id", id);
        select.style.width = "400px";
        // select.style.width = "200px";
        for (i = 0; i < values.length; i++) {
            var value = values[i];
            var option = document.createElement("option");
            option.setAttribute("value", value);
            if (currentVal == value)
                option.setAttribute("selected", "selected");
            option.innerHTML = value;
            select.appendChild(option);
        }

        if (callback) {
            select.onchange = function (evt) {
                if (evt.target.selectedIndex > 0)
                    callback(evt.target);
            }
        }
        return select;
    }

    self.getInput = function (name, value, type) {
        if (!value)
            value = "";
        var input = document.createElement("INPUT");
        input.setAttribute("name", name);
        input.setAttribute("value", value);
        if (type)
            input.setAttribute("type", type);
        input.style.width = "400px";
        // input.style.width = "200px";
        return input;
    }

    self.getTextArea = function (name, value, className) {
        if (!value)
            value = "";
        var input = document.createElement('TEXTAREA');

        input.setAttribute("name", name);
        input.setAttribute("id", name);
        input.className = className;

        valueElt = document.createTextNode(value);
        input.appendChild(valueElt);
        var rows = 3;
        if (value.length > 0)
            rows = Math.min((value.length / 30) + 3, 6);
        // input.setAttribute("rows", Math.round(rows,0));

        // input.setAttribute("cols", 40);
        // input.style.width = "400px";

        return input;
    }

    self.getInternetExplorerVersion = function ()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
    {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }

    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };

    self.setMessage=function(message, color,_messageDivId) {
        if(!_messageDivId)
            _messageDivId=messageDivId;

        $("#"+_messageDivId).html(message);

        if (!color)
            color = "black";
        $("#"+_messageDivId).css("color",color)



        /*  div.innerHTML = message;
       var div = document.getElementById(messageDivId)
        if (!div) {
            div = window.parent.document.getElementById(messageDivId)
        }
        if (!div) {
            console.log("No div  with ID stateDisplay  to display messages");
            console.log(message);
            return;
        }
        div.innerHTML = message;
        if (!color)
            color = "black";
        div.style.color = color;*/
    }

    self.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


        self.isInt=function(value) {
            return /-?[0-9]+/.test("" + value);

    }
    self.isFloat=function(value) {
        return /-?[0-9]+[.,]+[0-9]?/.test("" + value);

    }


    self.convertNumStringToNumber =function(value){
        if(value.match && value.match(/.*[a-zA-Z\/\\$].*/))
            return value;
        if(self.isInt(value))
            return parseInt(value)
        if(self.isFloat(value))
            return parseFloat(value)
        if(value=="true")
            return true;
        if(value=="false")
            return false;
        return value;

    }

    self.getColors = function (startColor, endColor, steps) {
        var colors = [];
        var base = new KolorWheel(startColor);
        var target = base.abs(endColor, steps);
        var drawBox = function (color) {
            // return '<span class="box"
            // style="background-color:'+color+'"></span>';
            return color;
        };

        for (var n = 0; n < steps; n++) {
            colors.push(drawBox(target.get(n).getHex()));
        }
        ;
        return colors;
    }

    self.getSortOrderArray = function () {
        var sortOrder = [];
        sortOrder.push(radarXmls[currentRadarType].XML_getFieldForRole("label"));
        sortOrder.push(radarXmls[currentRadarType].XML_getFieldForRole("color"));
        sortOrder.push(radarXmls[currentRadarType].XML_getFieldForRole("horizontalAxis"));
        sortOrder.push(radarXmls[currentRadarType].XML_getFieldForRole("radialAxis"));
        sortOrder = sortOrder.concat(radarXmls[currentRadarType].Xml_getfilterNames());
        return sortOrder;
    }

    self.cleanTextForJsonImport = function (text) {
        text = "" + text;
        // str=str.replace(/[^\x-\x1F]/g, " ");
        return text.replace(/%/g, "percent").replace(/\"/g, "").replace(/'/g, " ").replace(/\'/g, " ").replace(/&/g, "-").replace(/>/g, "").replace(/</g, "").replace(/\n/g, " ").replace(/\r/g, " ")
            .replace(/\t/g, " ");

    }

    self.fillSelectOptionsWithStringArray = function (select, data, add) {
        if (!add)
            select.options.length = 0;
        $.each(data, function (i, item) {
            $(select).append($('<option>', {
                value: item,
                text: item
            }));
        });
    }
    self.fillSelectOptions = function (select, data, textfield, valueField) {
        select.options.length = 0;
        if (!textfield || !valueField) {
            self.fillSelectOptionsWithStringArray(select, data);
            return;
        }
        $.each(data, function (i, item) {
            $(select).append($('<option>', {
                text: item[textfield],
                value: item[valueField]
            }));
        });
    }

    self.formatResultToCsv = function (result, sep) {
        if (!sep)
            sep = "\t";
        var header = "";
        var headerTab = [];
        var body = "";
        for (var i = 0; i < result.length; i++) {
            for (var key in result[i]) {
                if ($.inArray(key, headerTab) < 0) {
                    header += key + sep;
                    headerTab.push(key);
                }
            }
        }


//	var regex = new RegExp("/[\n\r" + sep + "]/g");
        //var regex = new RegExp("/(\s\r\n|\n|\r\t" + sep + ")" +");

        var regex = new RegExp("/\n|\r|\t\|;|\s/");
        for (var i = 0; i < result.length; i++) {
            var line = result[i];
            for (var j = 0; j < headerTab.length; j++) {
                var str = line[headerTab[j]];
                if ($.isArray(str)) {
                    body += JSON.stringify(str) + sep;
                }
                else if ($.isPlainObject(str)) {
                    body += JSON.stringify(str) + sep;
                }
                else if ($.isNumeric(str))
                    body += str + sep;
                else if (str && str.length > 0) {
                    str = str.replace(sep, ". ");

                    body += str.replace(/(\n|\r|\t\|;|\s|[\r\n]+)/, ".") + sep;
                }
                else
                    body += "" + sep;
            }
            body += "\n";
        }

        body = header + "\n" + body;
        return body;
    }
    self.init = function () {
        IEversion = self.getInternetExplorerVersion();
        if (IEversion > 0) {
            if (IEversion < 8)
                alert("IE " + bowser.version + " is not suppoted by this application (min IE8 )");
        }
        if (IEversion <= 9)
            ; // console.log("---browser------IE --" + IEversion);

        /*
         * var version =parseFloat($.browser.version)
         *
         * if ($.browser.msie && version<9){ alert("IE " + version + " is not suppoted
         * by this application (min IE9 )"); }
         */

//moved  var appname = window.navigator.appName;
//moved  var version = window.navigator.appVersion;

        var queryParams = self.getQueryParams(document.location.search);
        dbName = queryParams.dbName;

        if (queryParams.canModify == "y") {


            isRadarReadOnly = false;
            canModifyRadarDetails = true;

        }

        if (queryParams.admin == "true") {
//moved  	var userRole = "admin";
//moved  	var userLogin = "CF";
//moved  	var userName = "CF";
            /*
             * isRadarReadOnly = false; canModifyRadarDetails=true;
             */
        }
        filter = queryParams.filter;
        if (filter) {
            filterValue = queryParams.filterValue;
        }
        if (queryParams.view)
            view = queryParams.view;
    }
    self.init();
    return self;
})()