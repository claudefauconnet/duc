/**
 * Created by claud on 09/07/2017.
 */
var pptx = (function () {

    var self = {};
    self.bus = []

    self.createAllPOTPowerpoints = function () {
        // var dbName=$("#pptxDbName").val();
        var dbName = $("#databaseSelect").val();
        var busStr = ""
        for (var i = 0; i < pptx.bus.length; i++) {
            if (i > 0)
                busStr += ","
            busStr += pptx.bus[i]
        }
        $("#waitImg").css("visibility", "visible");
        $("#pptxMessage").html("PPTX generation working, please wait");

        devisuProxy.createAllPOTPowerpoints(dbName, busStr, function (result) {
            alert("Slides generation done")
            $("#waitImg").css("visibility", "hidden");
            $("#pptxMessage").html("");
        })


    }
    self.getPptxSelect = function () {
        var dbName = $("#databaseSelect").val()

        var optionsStr = "<option></option>";

        optionsStr += "<option value='technologiesSheetsPOT2017.pptx'>technologies</option>";

        optionsStr += "<option value='scenariosSheetsPOT2017.pptx'>scenarios</option>";

        //    var bus = devisuProxy.getDistinct(dbName, "BCs", null, "BU_name");
        var bus = devisuProxy.getDistinct(dbName, "use_cases", null, "bu");
        self.bus = []
        for (var i = 0; i < bus.length; i++) {
            self.bus.push(bus[i]);
            optionsStr += "<option value='useCasesSheetsPOT2017_" + bus[i] + ".pptx'>use cases " + bus[i] + "</option>";

        }

        var selectStr = "<select onchange='pptx.downloadPptx(this)'>" + optionsStr + "</select>"
        $("#downloadPptxSpan").html(selectStr);
        return selectStr;


    }

    self.downloadPptx = function (select) {
        var str = $(select).val();
        window.location.href = Gparams.pptxLocation + str;


    }


    return self;
})()