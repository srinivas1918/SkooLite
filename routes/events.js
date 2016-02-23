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

	var eventDate=moment(eventsObject.eventDate, "YYYY-MM-DD");
	//console.log(eventDate);
	eventsObject.eventDate=new Date(eventDate);

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

function reverse(s) {
  if (s.length < 2)
    return s;
  var halfIndex = Math.ceil(s.length / 2);
  return reverse(s.substr(halfIndex)) +
         reverse(s.substr(0, halfIndex));
}

router.get("/getEvent",function(req,resp, next){

});

module.exports=router;