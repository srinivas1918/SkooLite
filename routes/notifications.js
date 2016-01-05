/**
* @author Srinivas Nalla
* File: notification.js
* Desc: This file contains functions sending notifications through SMS/GCM providers
*       Supports rest calls 
*/
var express=require('express')
var router=express.Router();

//import application required files.
var studentService=require('../service/studentService.js');
var sms_notifier=require('../utils/messaging/sms-sender.js');
var config=require('../constants.js');
/*  app required routes starts */
var verifyAuthentication=function(req,resp,next){
	if(req.session.school==undefined){
		resp.json({status:false, error:"User is not authenticated"});
	}else{
		next();
	}
}


router.get('/resendVFC/SMS/:studentId', verifyAuthentication, function(req,resp,next){

		studentService.findStudentById(req.params.studentId,function(err,result){
			if(err){
				resp.json({status:false,message:"Server has stopped.."});
			}
			var message="Please enter the below authentication code for verifying mobile number: "+
						  result.sec_code;
			var dataObject={};
			dataObject.Account=config.credentials;
			
			var msgObject={};
			msgObject.Number=result.contact;
			msgObject.Text=message;

			var messages=[];
			messages.push(msgObject);
			dataObject.Messages=messages;			  
			sms_notifier.sendMessage(JSON.stringify(dataObject),function(err,msgStatus){
				//console.log(msgStatus);
				if(err){
				resp.json({status:false,meg:msgStatus});	
				}else
				resp.json(msgStatus);
			});
		});
});

module.exports=router;