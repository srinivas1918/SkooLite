/**
* @author : Nalla Srinivas
* feeInfoService.js
* 
*/
var dbOparations=require("../db.js").dbOparations;
var config=require('../constants.js');
var ObjectID = require('mongodb').ObjectID;   //unique Id generator.
var db=dbOparations.db;

var FeeInfoService=function(){};

// @param : student_id  (Unique ID of student)
// returns the student Fee info 
FeeInfoService.prototype.getStudentFeeInfo=function(studentId,callback){
	var _id={_id:dbOparations.helper.toObjectID(studentId)};
	db.collection("students").findOne(_id,{'courseFee':1},function(err,result){
		if(err){
			return callback(err);
	}else{
		//console.log(JSON.stringify(result))
		return callback(null, result);
	}
	});
}

FeeInfoService.prototype.getStudentPaidFeeInfo=function(studentId,callback){

	var _id={_id:dbOparations.helper.toObjectID(studentId)};
	var unwind={$unwind:"$payments"};
	var sort={"$sort":{"payments.paymentId":-1}};
	var group={$group:{_id:"$payments.paymentMode",paidDate:{$max:"$payments.paymentDate"},
				paidAmount:{$sum:"$payments.paymentAmount"}}};
	var project={$project:{_id:0,"paymentMode":"$_id","amount":"$paidAmount",
					"date":"$paidDate"}};			
	db.collection('students').aggregate([{$match:_id},unwind,sort,group,project],function(err,result){
		if(err){
			return callback(err);
		}

		console.log(JSON.stringify(result));
		return callback(null,result);
	})
}

FeeInfoService.prototype.getSchoolFeeInfo=function(schoolId,callback) {
	var _id={_id:dbOparations.helper.toObjectID(schoolId)}

	db.collection("schools").findOne(_id,{'feeType':1},function(err,result){
		if(err){
			return callback(err);
		}
		else{
			console.log(JSON.stringify(result));
			return callback(null, result);
		}
	});

};

FeeInfoService.prototype.getStrengthForSchool=function(school_id,callback) {
	db.collection("students").aggregate([{$match:{school_id:school_id}},{$group:{_id:"$classLevel",TotalStudents:{$sum:1}}}],
		function(err, result){
		if(err){
			return callback(err);
		}else{
			return callback(null, result);
		}
	})
};

FeeInfoService.prototype.getStudentPaymentInfo=function(student_id,callback){

	var criteria={_id:dbOparations.helper.toObjectID(student_id)};
	var project={payments:1,amountPaid:1,annualFee:1};

	db.collection("students").findOne(criteria,project,function(err,result){
		if(err){
			return callback(err)
		}
		//console.log('result :'+JSON.stringify(result));
		return callback(null, result);
	})
}

module.exports=new FeeInfoService();