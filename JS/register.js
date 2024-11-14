$(document).ready(function() {

    const idioma = localStorage.getItem('idioma') || 'es';

    const mensajes = {
        es: {
            mensajeVacio: "Todos los campos son obligatorios.",
            mensajeCorreo: "El correo electrónico no tiene un formato válido.",
            mensajeContrasena: "La contraseña debe tener al menos 8 caracteres.",
            mensajeError: "Hubo un problema al registrar el usuario.",
            mensajeContrasenasNoCoinciden: "Las contraseñas no coinciden."
        },
        en: {
            mensajeVacio: "All fields are required.",
            mensajeCorreo: "The email format is not valid.",
            mensajeContrasena: "Password must be at least 8 characters.",
            mensajeError: "There was an issue registering the user.",
            mensajeContrasenasNoCoinciden: "Passwords do not match."
        }
    };

    function mostrarMensaje(tipo) {
        const mensaje = mensajes[idioma][tipo];
        $("#mensaje-error").text(mensaje).addClass('mostrar');
    }

    $("#btnRegister").click(function(event) {
        event.preventDefault();

        var name = $("#name").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var password_confirmation = $("#password_confirmation").val();

        $("#mensaje-error").removeClass('mostrar').text('');

        if (!name || !email || !password || !password_confirmation) {
            mostrarMensaje('mensajeVacio');
            return;
        }

        var regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!regexCorreo.test(email)) {
            mostrarMensaje('mensajeCorreo');
            return;
        }

        if (password.length < 8) {
            mostrarMensaje('mensajeContrasena');
            return;
        }

        if (password !== password_confirmation) {
            mostrarMensaje('mensajeContrasenasNoCoinciden');
            return;
        }

        var data = {
            "name": name,
            "email": email,
            "password": password,
            "password_confirmation": password_confirmation
        };

        $.ajax({
            url: 'http://localhost:8000/api/user',
            type: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
            success: function(resultado) {
                $("#registroExitosoModal").css("display", "flex");

                $("#cerrarModalRegistro").click(function() {
                    $("#registroExitosoModal").fadeOut();
                    $(location).prop('href', 'login.html');
                });

                $(".closeRegistro").click(function() {
                    $("#registroExitosoModal").fadeOut();
                    $(location).prop('href', 'login.html');
                });
            },
            error: function(resultado) {
                let mensaje = mensajes[idioma].mensajeError;
                if (resultado.responseJSON.error === "invalid_grant") {
                    mensaje = resultado.responseJSON.message;
                } else if (resultado.responseJSON.error === "invalid_request") {
                    mensaje = resultado.responseJSON.hint;
                }
                $("#mensaje-error").text(mensaje).addClass('mostrar');
            }
        });
    });
});
