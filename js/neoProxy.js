/**
 * Created by claud on 21/06/2017.
 */
var neoProxy=(function(){
    var self={};


    self.callNeo=function() {




       var  str = "MATCH (n) return n limit 25";
        console.log(str);
        var payload = {match: str};


        $.ajax({
            type: "POST",
            url: "http://localhost:3002/neo",
            data: payload,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
    var xx=data;
            },
            error: function (xhr, err, msg) {
                console.log(xhr);
                console.log(err);
                console.log(msg);
            },


        });
    }

    self.importNeo=function(type,query){
        var params=self.neoMappings.objects[objName];
        if(!query){
            query=self.mongoDefaultQuery;

        }
        devisuProxy.loadData(dbName,params.mongoCollections,params.mongoQuery, function(result){
            for (var i=0;i<result.length;i++){
                var attrsStr="";
                
                var neoCreateStr=create (n)
            }

        })



    }



    self.neoMappings={
        objects:{
            technologies:{
                mongoCollections:"technologies",
                mongoDefaultQuery:{},
                neoLabel:"technology"

            }
        }



    }

   return self;
})();