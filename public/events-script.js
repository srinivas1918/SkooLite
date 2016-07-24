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

	var table;
	table = $('#records_table').DataTable({
    bLengthChange: false,
    paging: false
   });

	$("#viewEvents").on("click",function(){
		console.log("loadEvents")
		loadEvents(table);
	});

	var table1;
	table1 = $('#records_table1').DataTable({
    bLengthChange: false,
    paging: false
   });
	$("#completedEvents").on("click",function(){
		$.ajax({
		type:"GET",
		url:"/events/loadCompleted",
		success:function(response){
			console.log(response);
			if(response.status)
			createTable(response, table1);
        	else{
        		alert("error");
        	}
		},
		error:function(ex){
			alert("Error check your internet/ Contact your admin");
		}
	})
	});
	/*$(".required").on("focus",function(){
		$(this).removeClass("error");
	});*/
});

var loadEvents=function(table){
	
	$.ajax({
		type:"GET",
		url:"/events/loadEvents",
		success:function(response){
			console.log(response);
			if(response.status)
			createTable(response, table);
        	else{
        		alert("error");
        	}
		},
		error:function(ex){
			alert("Error check your internet/ Contact your admin");
		}
	})
}

var createTable=function(data, table){
	      table.clear();
          $.each(data.result, function(i, item) {
           console.log("inserting", item);
         //  console.log(item.eventDate);
           var date=new Date(item.eventDate);
           //console.log( date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear());
           table.row.add([
             i+1,
             item.eventTitle,
             item.eventDesc,
             item.classLevel,
             date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear(),
             item.eventTime,
             item.eventLocation
           ]).draw();
         });
}
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