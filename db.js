var mongoskin = require('mongoskin');
var connection_string = '127.0.0.1:27017/saima';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +'skoolite'
}
var db = mongoskin.db('mongodb://'+connection_string, {safe:true});
var helper=mongoskin.helper;

var dbOparations={db:db,helper:helper};


module.exports.dbOparations=dbOparations;
