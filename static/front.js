$(document).ready(function(){

$('.deleteStuff').on('click', function(){
    var $this = $(this);
    var stuff = {
	user:$('#hiddenName').attr('value'),
	stuff: $(this).siblings('p').html()
    };
    console.log(stuff);
    $.ajax({
	type:'pos',
	data:JSON.stringify(stuff),
	url:'/deleteStuff',
	contentType:'application/json',
	beforeSend:function(data){
	    console.log('sending '+data);
	},
	success:function(data){
	    console.log('success '+data);
	    $this.parent().remove();
	}
    });

});



});
