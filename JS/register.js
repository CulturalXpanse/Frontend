
$(document).ready(function(){  

    $("#btnRegister").click(function(){
        var name = $("#name").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var password_confirmation = $("#password_confirmation").val();
        
        var data = {
            "name": name,
            "email": email,
            "password": password,
            "password_confirmation": password_confirmation
        }

        jQuery.ajax({  
            url: 'http://localhost:8000/api/user',  
            type: 'POST',
            headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json",
            },
            data: JSON.stringify(data),
            
            success: function (resultado) {
                $("#registroExitosoModal").css("display", "flex");

                $("#cerrarModalRegistro").click(function () {
                    $("#registroExitosoModal").fadeOut();
                    $(location).prop('href', 'login.html');
                });

                $(".closeRegistro").click(function () {
                    $("#registroExitosoModal").fadeOut();
                    $(location).prop('href', 'login.html');
                });
            },

            error: function (resultado) {
                let mensaje = "";
                if (resultado.responseJSON.error === "invalid_grant") {
                    mensaje = resultado.responseJSON.message;
                } else if (resultado.responseJSON.error === "invalid_request") {
                    mensaje = resultado.responseJSON.hint;
                }
                $("#mensaje").html(mensaje);
            }
        });  
    });
});  