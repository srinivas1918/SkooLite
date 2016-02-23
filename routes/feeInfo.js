/**
* @author Srinivas Nalla
* File: feeInfo.js
*/
var express=require("express");
var router=express.Router();

// Imports application required files.
var config=require("../constants.js");
var feeInfoService=require('../service/feeInfoService.js');

router.use(function(req,resp,next){
	console.log("Fee Info :");
	if(req.session.school==undefined){
		var redirectUrl=req.originalUrl;
		req.session.redirectUrl=req.originalUrl;
		resp.redirect("/");
	}
	next();
});


router.get("/paymentInfo/:studentId",function(req,resp,next){
	feeInfoService.getStudentFeeInfo(req.params.studentId,function(err, result){
		if(err)
			errorHandler(err,req,resp,next);
		else{
			console.log(JSON.stringify(result));
			feeInfoService.getStudentPaidFeeInfo(req.params.studentId,function(err, result1){
				if(err){
					errorHandler(err,req,resp,next);
				}
				resp.render(config.paymentInfo,{result:result,paidInfo:result1});
			});
			
		}
	});

});	

router.get("/showPaymentHistory/:studentId",function(req,resp,next){
	feeInfoService.getStudentPaymentInfo(req.params.studentId,function(err,result){

		if(err){
			console.log("Error "+err);
			errorHandler(err, req, resp, next);

		}else{
			console.log(JSON.stringify(result))
			resp.render(config.paymentHistory,{payHistory:result});
		}

	});
});

router.get("/list",function(req,resp,next){
	var schoolId=req.session.school._id;
	feeInfoService.getSchoolFeeInfo(schoolId,function(err,result1){
		if(err){
			errorHandler(err,req,resp,next);
		}
		//console.log(JSON.stringify(result1));
		var feeType=result1.feeType;
		if(result1.length!=0){
			feeInfoService.getStrengthForSchool(schoolId,function(err,result2){
				if (err) {
					errorHandler(err,req, resp,next)
				}else{
					var feeInfo=[];
					result1.courseFee.fee.forEach(function(d1,index1){
						var course=result1.courseFee.course;
						console.log(course);
						result2.forEach(function(d2,index12){
							if(course==d2._id){
								result1.strength=d2.TotalStudents;
								//feeInfo.push(d1);
								return;
							}
							
							
						});
						//console.log(feeInfo);
					})
					console.log("=====")
					console.log(JSON.stringify(result1));
					resp.render(config.schoolFeeInfo,{result:result1,feeType:feeType});
				}

				
			});

		}
		
	});
	
});

function errorHandler(err,req,resp,next){
	console.log("Error occured")
	res.status(500).render("error",{error:err});
}
module.exports=router;