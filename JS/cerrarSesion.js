$(document).ready(function(){  
    var token = localStorage.getItem("accessToken");
    if(token == null)
        $(location).prop('href', 'login.html');

    $("#logout-button").click(function(){
            jQuery.ajax({  
                url: 'http://localhost:8000/api/logout',  
                type: 'GET',
                headers: {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + token
                },
                success: function(resultado) {  
                    localStorage.removeItem("accessToken");
                    $(location).prop('href', 'login.html');    
                },
                
                error: function(resultado){
                    alert("Hubo un error");
                } 
                
            });  

        });
});  