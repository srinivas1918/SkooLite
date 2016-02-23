/**
* @author: Nalla Srinivas
* @File: feeNotificationSchedular.js
* @Desc: This file will start executes every day to pick the pending payments details and notifies to
* 		 devices using SMS or Cloud Messageing.
*/
var cron = require('node-schedule');
var studentService=require("../../service/studentService.js");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var feeNotificationSchedular=function(){
	EventEmitter.call(this);
	var _self=this;

	 _self.init=function(){
		console.log("init feeNotificationSchedular");
		var rule = new cron.RecurrenceRule();
		rule.second = 30;
		cron.scheduleJob(rule, function(){
  			  console.log(new Date(), 'The 30th second of the minute.');
  			  studentService.isStudentExists({gender:"Male"},function(err, result){
  			  	if(err){
  			  		console.log(err);
  			  	}
  			  	_self.emit('myEvent', result);
  			  	//console.log(JSON.stringify(result));
  			  });
		});
	}
}
//var notifies=new feeNotificationSchedular();
//notifies.init();
util.inherits(feeNotificationSchedular, EventEmitter);
module.exports=feeNotificationSchedular;
