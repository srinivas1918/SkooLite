$(function(){
	console.log('doc loaded');

	$("button[name=submit]").on("click", saveEvent);

	$("input[name=eventDate]").on("dp.change",function(){
		var date=$(this).val();
		getEventFor(date);
	});

	$('.required').on('focus',function(){
		$(this).removeClass("error");
	});
	/*$(".required").on("focus",function(){
		$(this).removeClass("error");
	});*/
});

var saveEvent=function(){
	var isValid=new Validate(".required").require();
	if(isValid){
	var data=$('form').serialize();
	$(this).hide();
	$("#spinner").show();
	console.log(data);
		$.ajax({
			type:"POST",
			data:data,
			url:"/events/saveEvent",
			success:function(resp){
				console.log(resp);
				if(resp.status){
					$("button[name=submit]").show();
					$("#spinner").hide();
					$('#post').trigger("reset");
				}
			},error:function(ex){
				alert('error');
			}
		})
	}else{
		alert("daf");
	}
	
	
	return false;
}

var getEventFor =function(date){
	$.ajax({
		type:"GET",
		url:"/events/getEvent/"+date,
		success:function(resp){
			resp.result.forEach(function(elm){
				var infoBox='<div class="alert alert-warning alert-dismissable"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>'+
      
                    ' On this day <b>'+elm.eventTitle+'</b> event conducting at <b>'+elm.eventLocation+'</b> Location</div>';
                  
                 $("#eventsByDate").html(infoBox); 
			})
		}
	})
}

function Validate(elem){
   
    /* properties */
    this.elem=elem;
   console.log(this.elem);
    /* functions for validations */
    this.require=function(){
        var flag=true;
       
        $(this.elem).each(function() {
       // console.log(this);
        //console.log(this.type);   
        if(this.type=='text' || this.type=='number' || this.type=='date' || this.type=='textarea' || this.type=='select-one'){
            if ($(this).val().length == 0 )
            {
                flag=false;
                $(this).addClass('error');
                console.log("2");

            }else{
            	//console.log($(this).val());
                $(this).removeClass('error');
              //  console.log("removeing class");

            }
        }else if(this.type=="radio" || this.type=="checkbox"){
            // checkbox || radio
            var name=this.name;
           // console.log(name);
            isCheck=$('input[name='+name+']').is(':checked');
            console.log("is check :"+isCheck);
            if(isCheck){
                //$(this).removeClass('error');

                $("#"+name+"Error").hide();
            }else{
               // $(this).addClass('error');
                $("#"+name+"Error").show(500);
                console.log("==1");
                flag=false;
            }
           
        }   
           
        });
       console.log(flag);
        return flag;
    };

}