/**
* @author: Nalla Srinivas
* File:    sms-sender.js
* @Desc:   This file helps for sending sms nofications using Third party gateway
*/
var http = require('http');
var config=require('../../constants.js');
var studentService=require("../../service/studentService.js");

var options_proxy={
		proxy:{
			host:"192.168.1.1",
			port:808,
			user:"",
			password:"",
			tunnel:false
		}
	}
var Client = require('node-rest-client').Client;
 
client = new Client();
var SMSHelper=function(){}

SMSHelper.prototype.sendMessage = function(object,callback) {
		// prepare the header
		console.log("SENDING SMS");
			var args = {
 				 data: object,
  				 headers:{"Content-Type": "application/json"} 
				};
		console.log("Url :"+config.URL);
		console.log(args);		
		var req=	client.post(config.URL, args, function(data,response) {
  			// parsed response body as js object 
			//console.log(JSON.parse(data.toString('utf8')));
			console.log("===============SMS sent ===========");
			// raw response 
			//console.log(response);
			if(callback && typeof callback == "function")
			return callback(null,JSON.parse(data.toString('utf8')));
			});
		req.on('requestTimeout',function(req){
			console.log('request has expired');
			req.abort();
			if(callback && typeof callback == "function") 
			return callback(new Error("Error on req processing"),"Messaging server is too slow, Please "+
				"try after some time");
		});

		req.on('error', function(err){
			//console.log('request error:::',err);
			if(callback && typeof callback == "function") 
			return callback(new Error("Error on req processing"),"Sending messge has problem,"+
			 "contact your provider");
		});
};

SMSHelper.prototype.sendPaymentMessage=function(feeObject,callback){
	console.log("================");
console.log(JSON.stringify(feeObject));
	studentService.getNameAndPhone(feeObject.studentId,function(err, result){
		if(err){
			if(callback && typeof callback == "function")
			return callback(err);
		}else{
			console.log(JSON.stringify(result));
			var text="We received the fee Amount "+feeObject.paymentAmount+" for "+feeObject.paymentMode;
			var dataObject={};
			dataObject.Account=config.credentials;

			var msgObject={};
			msgObject.Number=result.contact;
			msgObject.Text=text;

			var messages=[];
			messages.push(msgObject);
			dataObject.Messages=messages;

			//this.sendMessage(JSON.stringify(dataObject));			
			return callback(JSON.stringify(dataObject));
		}
	});

}
module.exports=new SMSHelper();