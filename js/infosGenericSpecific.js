var infosGenericSpecific=(function(){
    var self={};


   self.onAfterLoadInfosDiv=function(type){

        if(type=="useCase"){
            $("#attr_business").click(function (){

               var str= infosUseCase.modifyBCs();
                $("#treeDialog").html(str);
                $("#treeDialog").dialog("open");
               // $("#treeDialog").css("visibility","visible");




            })


        }




    }









    return self;




})()