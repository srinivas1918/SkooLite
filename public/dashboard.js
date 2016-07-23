var viewing=null;
var viewTab=null;
$(function(){
	console.log("doc loaded")
	$("#studentLi").addClass("active");
	loadStudents({classLevel:"X"});
	$("#classLevel").val("X");
	$("#classLevel").on("change",function(){
		if($(this).hasClass('error'))
		$(this).removeClass('error');
	});
	$("#go").on("click",findStudents);
});

//load the student table 
var loadStudents=function(query){
$.ajax({
	type:"POST",
	data:query,
	url:"/admin/studentsList",
	success:function(resp){
		console.log("resp success");
		$("#studentsTable").html(resp);
	}
})
};

var findStudents=function(){
	var classLevel=$("#classLevel :selected").val();
	var section=$("#section :selected").val();
	//var query={classLevel:classLevel,section:section};
	var query={};
	if(classLevel.length!=0){
		query.classLevel=classLevel;
	}
	if(section.length!=0){
		query.section=section;
	}

	if(classLevel.length==0 && section.length==0){
		$("#classLevel").addClass('error');
		return false;
	}

	loadStudents(query);

}

var findStudent=function(data){
	console.log(data);
	$.ajax({
		type:"GET",
		url:"/admin/findStudent/"+data,
		success:showStudentInfo,
		error:function(err){
			alert("error");
		}
	})
}

var showStudentInfo=function(student){
	//console.log(student);
	 $("#demo1").val('');
	 $("#studentInfo").modal('show');
	 $("#studentInfo-body").html(student);

}

$('#studentInfo').on('hidden.bs.modal', function () {
		//alert("Studne info hide "+viewing);
		 $("#studentInfo-body").html('');
		 if(viewing!=null){
		 	//alert(viewTab)
		 	if(viewTab=="makePayment"){
		 		$.ajax({
		type:"GET",
		url:"/admin/makePaymentForStudent/"+viewing,
		success:function(resp){
			$("#makePayment-body").html(resp);
			$("#makePayment").modal("show");
  			showPaymentInfo(viewing);
  			viewing=null;
		},
		error:function(ex){
			viewing=null;
		}
	})
		 	}

		 if(viewTab=="paymentHistory"){
			$.ajax({
		type:"GET",
		url:"/fees/showPaymentHistory/"+viewing,
		success:function(resp){
			$("#paymentHistory").modal('show');
			$("#paymentHistory-body").html(resp);
		}
	});		 	
		 }	
		 	
		 }
		 

	});

$('#makePayment').on('hidden.bs.modal', function () {
		console.log("makePayment info hide");
		 $("#makePayment-body").html('');
		 $("body").css("padding-right","0px");
		 viewing=null;
	});

$('#paymentHistory').on('hidden.bs.modal', function () {
		console.log("makePayment info hide");
		 $("#paymentHistory-body").html('');
		 $("body").css("padding-right","0px");
		 viewing=null;
	});

