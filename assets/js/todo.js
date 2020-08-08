//Check off specific todos by clicking
//Add listener to the entire ul (for all potential li)
$("ul").on("click", "li", function(){
    $(this).toggleClass("completed");
});

//Click on X to delete a todo
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(500, function(){
        $(this).remove();
    });
    //stop bubble events
    event.stopPropagation(); 
});

//Add new todos from input
$("input[type='text']").on("keypress", function(event){
    if(event.which == 13){
        $("ul").append("<li><span><i class='fas fa-trash-alt'></i></span> "+$(this).val()+"</li>");
        $(this).val(""); //clear the input text
    }
});

//Make the input box fadeIn/FadeOut once click it
$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle();
});