/**
* @author Srinivas Nalla
* File: admin.js
*/

var express = require('express');
var moment=require('moment');
var router = express.Router();

var config=require("../constants.js");

/* Importing Application required services */
var studentService=require("../service/studentService.js");
var feeInfoService=require('../service/feeInfoService.js');
var sms_notifier=require('../utils/messaging/sms-sender.js');
// Authentication Middleware works here
router.use(function(req,resp,next){

	if(req.session.school==undefined){
		var redirectUrl=req.originalUrl;
		req.session.redirectUrl=req.originalUrl;
		resp.redirect("/");
	}
	next();
})

/* GET dashboard render */
router.get('/', function(req, res, next) {
	res.render("dashboard",{});
});

// showing student from for registration
router.get("/regStudent",function(req,res,next){
	console.log("new student studentRegForm");
	// get previous registered students of the current day.
	var todayDate=moment(new Date()).format("DD-MM-YYYY");
	var query={regDate:todayDate};

	var feeCategories=req.session.school.feeType;

	studentService.findStudentsByDate(query,function(err,result){

		if(err){
			res.render('studentRegForm',{message:false,err:err});
		}
		console.log(JSON.stringify(result));
		res.render('studentRegForm',{message:true,result:result,feeType:feeCategories});

	});
	//res.render('studentRegForm');
});

// verifying student in the db based on rollNo, studentClass and schoolId
router.post("/verifyStudent",function(req,res,next){
	console.log("RequestBody :"+JSON.stringify(req.body));
	studentService.isStudentExists(req.body,function(err,result){
		if(err){
			res.json({message:false, err:err});
		}

		if(result==null){
			// user not exist
			res.json({message:true});
		}else{
			res.json({message:false});
		}
	});
});

// submit student for registration.
router.post("/submitStudent",function(req,res,next){
	var student=req.body;
	var regDate=moment(new Date()).format("DD-MM-YYYY");
	/*var payementDates=student.paymentDates.split(",");*/

	// converting payment Dates to DD-MM-YYYY format.
	/*var dueDates=[];
	payementDates.forEach(function(d){
		dueDates.push(moment(d,'DD-MMM-YYYY').format("DD-MM-YYYY"));
		//console.log(moment(d,'DD-MMM-YYYY').format("DD-MM-YYYY"));
	});*/

	//student.dueDates=dueDates;

	//delete student['paymentDates'];

	student.regDate=regDate;
	student.school_id=req.session.school._id; // Setting school id to the student
	student.school_code=req.session.school.code; // Setting school code to the student
	//student.sec_code=shortId.generate();
	student.amountPaid=0;
	studentService.registerStudent(student,function(err,result){
		if(err){
			// send error message
			res.json({message:false,err:err});
		}
		else{
			//sending sms once registration done.
			var message="Please enter the below authentication code for verifying mobile number: "+
						  result[0].sec_code;
			var dataObject={};
			dataObject.Account=config.credentials;

			var msgObject={};
			msgObject.Number=result[0].contact;
			msgObject.Text=message;

			var messages=[];
			messages.push(msgObject);
			dataObject.Messages=messages;
			//console.log("=====Data Object====== ");
			//console.log(JSON.stringify(dataObject));
			sms_notifier.sendMessage(JSON.stringify(dataObject));
			res.json({message:true,result:result});

		}

	});

});

// students list for dashboard

router.post("/studentsList",function(req, resp, next){
	var school_id=req.session.school._id;
	var reqBody=req.body;
	console.log(school_id);
	reqBody.school_id=school_id;
	console.log(reqBody.school_id);
	console.log("query:"+JSON.stringify(reqBody))
	studentService.listStudents(reqBody,function(err,result){
		if(err){
			errorHandler(err,req,res,next);
		}
		//console.log("====")
		//console.log(JSON.stringify(result))
		resp.render(config.studentsList,{result:result});
	})
});

router.post('/searchStudent',function(req,resp,next){
	console.log(req.body.query);
	var school_id=req.session.school._id;
	var query={studentName:req.body.query,school_id:school_id};
	studentService.searchStudent(query,function(err,result){
		if(err){
			resp.json({});
		}
		//var searchResult=prepareHtmlString(result);
		resp.send(result);
	})

});

/** URL: localhost:3000/admin/_id
*	Here, _id is param.
*/
router.get("/findStudent/:_id",function(req,resp,next){

	studentService.findStudentById(req.params._id, function(err,result){
		if(err){
			resp.render(config.studentInfo,{status:false,result:result});
		}
		if(result==null){
			resp.render(config.studentInfo,{status:false,result:result});
		}else{
			console.log("==========================");
			resp.set('Content-Type', 'text/plain');
			resp.render(config.studentInfo,{status:true,result:result});
		}

	})
});

router.get("/makePaymentForStudent/:_id",function(req,resp,next){

	studentService.findStudentById(req.params._id,function(err, result){
		if(err){
			resp.render(config.makePayment,{status:false})
		}
		if(result==null){
			resp.render(config.makePayment,{status:false,result:null});
		}else{
			var paymentModes=req.session.school.feeType;
			console.log(paymentModes);
			resp.render(config.makePayment,{status:true,result:result, paymentModes:paymentModes});
		}
	});
});


router.post('/savePayment',function(req,resp,next){
	console.log(req.body);
	var studentId=req.body.studentId;
	//var todayDate=new Date();
	req.body.paymentDate=new Date();
	req.body.paymentAmount=Number(req.body.paymentAmount);
	var notify=req.body.notify;
	if(notify==0){
			req.body.nextDueDate=todayDate;
	}
	req.body.notify=0 // always off once payment done.
	studentService.savePayment(req.body,function(err,result){
		if(err){
			resp.json({status:false})
		}
		else{
			req.body.studentId=studentId;
			sms_notifier.sendPaymentMessage(req.body,function(message){
				sms_notifier.sendMessage(message);
			});
			resp.json({status:true,result:result});
		}

	})

})

router.get("/courseFeeDetails/:course",function(req,resp,next){
	console.log(req.params.course);
	var school_id=req.session.school._id;
	var course=req.params.course;
	var query={"courseFee.course":course,_id:school_id};
	studentService.courseFeeDetails(query,function(err,result){
		if(err){
			resp.json({status:false,err:"Contact admin some error occured"})
		}
		if(result==null){
			var message="You can`t save this student currently because, This course <b>"+
			req.params.course+" Class</b> doesn`t have fee details. So, please register fee details </br>"+
			"click on <b>Go</b> to register Fee for this course";
			resp.json({status:false,err:message});
		}else{
			resp.json({status:true,result:result.courseFee});
		}
	})
})


router.get("/feeRegForm/:course",function(req,resp,next){
	resp.render(config.feeRegForm,{result:req.session.school.feeType,course:req.params.course})
})

router.post("/saveFeeDetails/:studentId",function(req,resp,next){
	console.log(JSON.stringify(req.body));
	var school_id=req.session.school._id;
	var schoolFee={course:req.body.course,annualFee:req.body.annualFee};
	var student_id=req.params.studentId;
	feeInfoService.getSchoolFeeInfo(school_id,function(err,feeResult){

		if(err)
			errorHandler(err,req,resp,next)

		var feeTypes=feeResult.feeType;

		var fee=[];
		feeTypes.forEach(function(d){
			var jsonObject={paymentMode:d, paymentAmount:Number(req.body[d])};
			//jsonObject[d]=req.body[d];
			fee.push(jsonObject);
		})
 	console.log("Fees :");
 	console.log(JSON.stringify(fee));
 	schoolFee.fee=fee;
		studentService.updateFeeInfo(schoolFee,student_id,function(err,result){
		if(err){
			resp.json({status:false,err:"Database Error"});
		}else{
			resp.json({status:true,result:result});
		}

	}); // studentService


	}); // end feeInfo Service


});

router.post('/addStudentFeeInfo',function(req,resp,next){

	console.log(JSON.stringify(req.body));
	var data=req.body;
	delete data['course'];
	var _id=data.student_id;
	delete data['student_id'];

	studentService.addStudentFeeInfo(data,_id,function(err,result){
		if(err){
			resp.json({status:false,result:err})
		}
		resp.json({status:true,result:result});
	})

});

function errorHandler(err,req,resp,next){
	console.log("Error occured")
	res.status(500).render("error",{error:err});
}

module.exports = router;
