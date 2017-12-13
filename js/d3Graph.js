/**
 * Created by claud on 31/07/2017.
 */
var d3Graph=(function(){
    var self=  {};



   self.loadGraphIframe=function(){
       var baseUrl=window.location.href;
       baseUrl=baseUrl.substring(0,baseUrl.lastIndexOf(":")+1);
        var subGraph=$("#subGraph").val();
       var url=baseUrl+"3002/toutlesens/indexPOT.html";
      //  var url="http://localhost:3002/toutlesens/indexPOT.html?subGraph="+subGraph;
        $("#graphIframe").attr('src',url);

    }









    return self;
})()