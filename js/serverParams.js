/**
 * Created by claud on 02/01/2017.
 */


var serverParams={
   neo4jUrl: 'http://neo4j:vi0lon@localhost:7474',
     mongoUrl : "mongodb://127.0.0.1:27017/",
    mongoFetchSize:50,
    elasticUrl:'localhost:9200',
    uploadMaxSize:20*1000*1000 //20M
}

module.exports = serverParams;
