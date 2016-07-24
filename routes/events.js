/**
* @author: Nalla Srinivas
* File : events.js
* @desc: File contains the actions related to events.
*/

var express=require("express");
var router=express.Router();
var moment=require('moment');

/* import application required files*/
var config=require("../constants.js");
var eventService=require("../service/eventService.js");

router.use(function(req,resp,next){
	
	if(req.session.school==undefined){
		var redirectUrl=req.originalUrl;
		req.session.redirectUrl=req.originalUrl;
		resp.redirect("/");
	}
	next();
});

router.get("/post",function(req,resp,next){

	resp.render(config.events);
});

router.post("/saveEvent",function(req, resp, next){
	var eventsObject=req.body;
	
	var todayDate=moment(new Date()).format("DD-MM-YYYY");
	eventsObject.postDate=todayDate;
  	
  	console.log("event start date :"+req.body.eventDate);
    var eventDate=moment(req.body.eventDate,'DD-MM-YYYY').toDate();
	eventsObject.eventDate=eventDate;
	var school_id=req.session.school._id;
	eventsObject.school_id=school_id;

	eventService.saveEvent(eventsObject,function(err, result){
		if(err){
		resp.json({status:false, result:err});
		}else{
			resp.json({status:true, result:result});
		}

	})
});

router.get("/loadEvents",function(req,resp,next){
	
	eventService.listEvents({school_id:req.session.school._id,eventDate:{$gt:new Date()}},function(err,result){
		if(err){
			resp.json({status:false,result:err});
		}else{
			resp.json({status:true, result:result}).end();
		}
	});
});

router.get("/loadCompleted",function(req,resp,next){
	
	eventService.listEvents({school_id:req.session.school._id,eventDate:{$lt:new Date()}},function(err,result){
		if(err){
			resp.json({status:false,result:err});
		}else{
			resp.json({status:true, result:result}).end();
		}
	});
});

router.get("/getEvent/:eventDate",function(req,resp, next){
   console.log(req.params.eventDate);
   var eventDate=moment(req.params.eventDate,'DD-MM-YYYY').toDate();
   console.log(eventDate);
   eventService.getEventByDate({'eventDate':eventDate},function(err, result){
   		console.log(err);
   			if(err){
   				resp.sendStatus(500);
   			}
   			else
   			{
   				//console.log(result);
   				resp.json({status:true, result:result});
   			}
   });
  

});

module.exports=router;