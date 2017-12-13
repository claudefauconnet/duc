/**
 * Created by claud on 11/06/2017.
 */
var objs={}
db.r_UC_T_DC.find({}).forEach(function(doc){
    var str=doc.techno_id+"_"+doc.DC_id;
    if(!objs[str])
        objs[str]=doc._id;
})

for(var key in objs){
    db.r_UC_T_DC.update({_id:objs[key]},{$set:{keep:1}})
}


db.r_UC_T_DC.remove({keep:{$exists:false}})



var keys=[];
db.r_T_DC.find().forEach(function(doc){
    for(var key in doc){
        if(keys.indexOf(key)<0)
            keys.push(key);
    }

})
var str="";
for(var i=0;i<keys.length;i++){
    str+=""+(keys[i])+",";
}
print(str)