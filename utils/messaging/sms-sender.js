/**
* @author: Nalla Srinivas
* File:    sms-sender.js
* @Desc:   This file helps for sending sms nofications using Third party gateway
*/
var http = require('http');
var config=require('../../constants.js');
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
 
client = new Client(options_proxy);
var SMSHelper=function(){}

SMSHelper.prototype.sendMessage = function(object,callback) {
		// prepare the header
		
			var args = {
 				 data: object,
  				 headers:{"Content-Type": "application/json"} 
				};
		//console.log("Url :"+config.URL);
		//console.log(args);		
		var req=	client.post(config.URL, args, function(data,response) {
  			// parsed response body as js object 
			//console.log(JSON.parse(data.toString('utf8')));

			// raw response 
			//console.log(response);
			return callback(null,JSON.parse(data.toString('utf8')));
			});
		req.on('requestTimeout',function(req){
			console.log('request has expired');
			req.abort();
			return callback(new Error("Error on req processing"),"Messaging server is too slow, Please "+
				"try after some time");
		});

		req.on('error', function(err){
			//console.log('request error:::',err);
			return callback(new Error("Error on req processing"),"Sending messge has problem,"+
			 "contact your provider");
		});
};
module.exports=new SMSHelper();