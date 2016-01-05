var resendVFC=function(studenId){

	$.ajax({
		type:"GET",
		url:"/notifications/resendVFC/SMS/"+studenId,
		success:function(response){
			console.log("sending code done");
		},error:function(ex){
			alert('error while sending code');
		}
	})
}

var sendMessage=function(studenId){

}

