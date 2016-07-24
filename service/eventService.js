var dbOparations=require("../db.js").dbOparations;
var config=require('../constants.js');
var ObjectID = require('mongodb').ObjectID;   //unique Id generator.
var db=dbOparations.db;

var EventService=function(){};

EventService.prototype.saveEvent = function(eventObject,callback) {

	db.collection("events").insert(eventObject,function(err, result){
		if(err){
			return callback(new Error("Database Error"));
		}else{
			return callback(null,result);
		}
	});
};

EventService.prototype.listEvents=function(obj,callback){

	db.collection("events").find(obj).sort({eventDate:1}).toArray(function(err,result){

		if(err){
			return callback(new Error("Database err"))
		}else{
			return callback(null,result);
		}
	});
}

EventService.prototype.getEventByDate=function(obj,callback){
	db.collection('events').find(obj).toArray(function(err,result){
		if(err)
			return callback(new Error("Database Error"))
		else
			return callback(null,result);
	})
}
module.exports=new EventService();