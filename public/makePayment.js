
var makePayment=function(studentId,tab){
	//alert("2")
	$(".loader").fadeIn('slow');
	$.ajax({
		type:"GET",
		url:"/admin/makePaymentForStudent/"+studentId,
		success:function(resp){
			$(".loader").fadeOut();
			$("#makePayment-body").html(resp);
			$("#makePayment").modal("show");
  			showPaymentInfo(studentId);
  			viewing=null;
  			viewTab=null;
		},
		error:function(ex){
			viewing=null;
			viewTab=null;
		}
	})
}
var showPaymentHistory=function(studentId,tab){
			viewing=null;
  			viewTab=null;
  			$(".loader").fadeIn('slow');
			//$("#paymentHistory-body").html('');
	$.ajax({
		type:"GET",
		url:"/fees/showPaymentHistory/"+studentId,
		success:function(resp){
			$(".loader").fadeOut();
			$("#paymentHistory").modal('show');
			$("#paymentHistory-body").html(resp);
		},
		error:function(ex){
			alert("error! Please check your internet/ Contact admin");
			$(".loader").fadeOut();
		}
	});
}
var showPaymentInfo=function(studentId){
	$.ajax({type:"GET",url:"/fees/paymentInfo/"+studentId,
			success:function(resp){
				$("#paymentInfo").html(resp);
				console.log("appendd");
			},error:function(ex){
				alert(ex);
			}
	})
}

var submitPayment=function(){
	console.log("pay click")
	
	var payment=$("#payment").val();
	if(payment.length==0){
		$("#payment").addClass('error');
		return false;
	}else{
		//console.log("payment amount:"+$("#payment").val())
		$("#payment").removeClass('error');
	}

	var paymentMode=$("#paymentMode").val();
	//console.log(paymentMode)
	if(paymentMode=='other'){
		paymentMode=$("#otherPay").val();
		if(paymentMode.length==0){
			$("#otherPay").addClass("error");
			return false;
		}else{
			$("#otherPay").removeClass("error")
		}
	}
var notify=$("input[name=notify]:checked").val();
	if(notify==1){
		var nextDueDate=$("#due").val();
		if(nextDueDate.length==0){
			$("#due").addClass('error');
			return false;
		}else{
			$("#due").removeClass('error')
		}
	}
	var paidBy=$("#paidBy").val();
	//console.log(paidBy);
	if(paidBy.length==0){
		$("#paidBy").addClass('error');
		return false;
	}else{
		$("#paidBy").removeClass('error');
	}

	if(paidBy=="otherParent"){
		paidBy=$("#other").val();
		if(paidBy.length==0){
			$("#other").addClass('error');
			return false;
		}else{
			$("#other").removeClass('error');
		}
	}

	
	$(this).hide();
	$("#spinner").show();
	console.log(payment);
	console.log(paymentMode);
	console.log(paidBy);
	console.log(notify);
	//$(this).show();
	//$("#spinner").hide();
	var studentId=$("#studentId").val();
	var studentName=$("#studentName").val();
	var amountPaid=$("#amountPaid").val();
	paymentAmount=Number(amountPaid)+Number(payment);
	var paymentData={paymentAmount:Number(payment),paymentMode:paymentMode,paidBy:paidBy,notify:notify,
		amountPaid:Number(paymentAmount)}
	if(notify==1){
		var nextDueDate=$("#due").val();
		console.log("next Due :"+nextDueDate);
		paymentData.nextDueDate=nextDueDate;
	}	
	
	paymentData.studentId=studentId;
	$.ajax({
		type:"POST",
		url:"/admin/savePayment",
		data:paymentData,
		success:function(resp){
			bootbox.alert("<span class='text-success'> <b>Payment Done for the Student :"
				+studentName+"</b></span>",function(){
				//$("#makePayment").modal('hide');
				
				window.location.reload();

			});
		},
		error:function(ex){
			bootbox.alert("<span class='text-danger'> <b>Payment Failed for the Student :"
				+studentName+"</b></span>");
		}
	})
}





