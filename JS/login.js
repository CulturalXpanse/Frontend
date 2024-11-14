$(document).ready(function() {
    var token = localStorage.getItem("accessToken");
    if (token != null) {
        $(location).prop('href', 'inicio.html');
    }

    // Obtener idioma del localStorage
    const idioma = localStorage.getItem('idioma') || 'es'; // Por defecto en español

    // Definir los mensajes dependiendo del idioma
    const mensajes = {
        es: {
            mensajeVacio: "El correo electrónico o la contraseña no pueden quedar vacíos.",
            mensajeError: "El correo electrónico o la contraseña son incorrectos."
        },
        en: {
            mensajeVacio: "The email or password cannot be left empty.",
            mensajeError: "The email or password is incorrect."
        }
    };

    // Establecer los mensajes en función del idioma
    function mostrarMensaje(tipo) {
        const mensaje = mensajes[idioma][tipo];
        $("#mensaje-error").text(mensaje).addClass('mostrar');
    }

    $("#btnLogin").click(function() {
        var username = $("#username").val();
        var password = $("#password").val();

        // Ocultar los mensajes de error previos
        $("#mensaje-error").removeClass('mostrar').text('');

        if (!username || !password) {
            mostrarMensaje('mensajeVacio');
            return;
        }

        var data = {
            "username": username,
            "password": password,
            "grant_type": "password",
            "client_id": 1,
            "client_secret": "1FZh5gv0GjHMgDrpK4IyacKw6KoW6IF7o85lyCY9"
        };

        $.ajax({  
            url: 'http://localhost:8000/oauth/token',  
            type: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function(resultado) {  
                localStorage.setItem("accessToken", resultado.access_token);
                $(location).prop('href', 'inicio.html');
            },
            error: function(resultado) {
                if (resultado.responseJSON.error === "invalid_grant") {
                    mostrarMensaje('mensajeError');
                } else if (resultado.responseJSON.error === "invalid_request") {
                    $("#mensaje-error").text(resultado.responseJSON.hint).addClass('mostrar');
                }
            } 
        });
    });
});