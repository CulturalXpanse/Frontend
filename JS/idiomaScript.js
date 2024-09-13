const traducciones = {
    es: {
        login: {
            titulo: "CulteX | Inicio de Sesión",
            correo: "Correo electrónico",
            contrasena: "Contraseña",
            iniciarSesion: "Iniciar sesión",
            olvidarContrasenia: "¿Olvidaste la contraseña?",
            registrarse: "Regístrate",
            cambiarIdioma: "Cambiar idioma",
            centroAyuda: "Centro de ayuda",
            derechos: "Todos los derechos reservados.",
            seleccionIdioma: "Selecciona el idioma"
        },
        register: {
            titulo: "CulteX | Registrarse",
            nombreCompleto: "Nombre Completo",
            nombreUsuario: "Nombre de Usuario",
            correo: "Correo electrónico",
            contrasena: "Contraseña",
            repetirContrasena: "Repetir Contraseña",
            fechaNacimiento: "Fecha de Nacimiento",
            registrarse: "Registrarse",
            iniciarSesion: "Inicia sesión",
            cambiarIdioma: "Cambiar idioma",
            centroAyuda: "Centro de ayuda",
            derechos: "Todos los derechos reservados.",
            seleccionIdioma: "Selecciona el idioma"
        },
        olvidarContrasenia: {

        },
        centroDeAyuda: {
            titulo: "CulteX | Centro de Ayuda",
            atras: "Atrás",
            preguntas: "Preguntas Frecuentes",
            pregunta1: "¿Cómo creo una cuenta en CulteX?",
            respuesta1: "Para crear una cuenta, dirígete a la página de registro y completa el formulario con tus datos personales. Una vez completado, puedes iniciar sesión.",
            pregunta2: "¿Cómo puedo restablecer mi contraseña?",
            respuesta2: "Si olvidaste tu contraseña, puedes restablecerla haciendo clic en 'Olvidé mi contraseña' en la página de inicio de sesión. Ingresa tu correo electrónico, donde te llevará a la página de cambio de contraseña.",
            pregunta3: "¿Cómo puedo editar mi perfil?",
            respuesta3: "Para editar tu perfil, inicia sesión y dirígete a la sección 'Mi perfil'. Allí podrás cambiar tu foto de perfil, actualizar tu biografía y modificar tus preferencias de privacidad.",
            pregunta4: "¿Cómo funciona el sistema de amigos?",
            respuesta4: "Puedes enviar solicitudes de amistad a otros usuarios de CulteX. Cuando la persona acepte tu solicitud, podrán ver las publicaciones de cada uno, comentar y compartir contenido de manera más cercana.",
            pregunta5: "¿Cómo puedo eliminar mi cuenta?",
            respuesta5: "Si deseas eliminar tu cuenta, puedes hacerlo desde la sección de 'Configuración de la cuenta'. Ten en cuenta que esta acción es irreversible y se eliminarán todos tus datos, publicaciones y contactos.",
            cambiarIdioma: "Cambiar idioma",
            derechos: "Todos los derechos reservados.",
            seleccionIdioma: "Selecciona el idioma"
        },
        inicio: {

        },
        perfil: {

        },
        configuracion: {

        },
        bloqueados: {

        },

    },
    en: {
        login: {
            titulo: "CulteX | Login",
            correo: "Email",
            contrasena: "Password",
            iniciarSesion: "Login",
            olvidarContrasenia: "Forgot Password?",
            registrarse: "Sign Up",
            cambiarIdioma: "Change Language",
            centroAyuda: "Help Center",
            derechos: "All rights reserved.",
            seleccionIdioma: "Select the language"
        },
        register: {
            titulo: "CulteX | Sign Up",
            nombreCompleto: "Full Name",
            nombreUsuario: "Username",
            correo: "Email",
            contrasena: "Password",
            repetirContrasena: "Repeat Password",
            fechaNacimiento: "Date of Birth",
            registrarse: "Sign Up",
            iniciarSesion: "Log In",
            cambiarIdioma: "Change Language",
            centroAyuda: "Help Center",
            derechos: "All rights reserved.",
            seleccionIdioma: "Select the language"
        },
        olvidarContrasenia: {

        },
        centroDeAyuda: {
            titulo: "CulteX | Help Center",
            atras: "Back",
            preguntas: "Frequently Asked Questions",
            pregunta1: "How do I create an account on CulteX?",
            respuesta1: "To create an account, go to the registration page and complete the form with your personal information. Once completed, you can log in.",
            pregunta2: "How can I reset my password?",
            respuesta2: "If you forgot your password, you can reset it by clicking 'Forgot my password' on the login page. Enter your email, where it will take you to the change password page.",
            pregunta3: "How can I edit my profile?",
            respuesta3: "To edit your profile, log in and go to the 'My Profile' section. There you can change your profile photo, update your biography and modify your privacy preferences.",
            pregunta4: "How does the friends system work?",
            respuesta4: "You can send friend requests to other CulteX users. When the person accepts your request, you will be able to see each other's posts, comment, and share content more closely.",
            pregunta5: "How can I delete my account?",
            respuesta5: "If you want to delete your account, you can do so from the 'Account Settings' section. Please note that this action is irreversible and all your data, posts and contacts will be deleted.",
            cambiarIdioma: "Change language",
            derechos: "All rights reserved.",
            seleccionIdioma: "Select the language",
        },
        inicio: {

        },
        perfil: {
            
        },
        configuracion: {

        },
        bloqueados: {

        },
    }
};

function cambiarIdioma(idioma, pagina) {
    const elementos = document.querySelectorAll("[data-trad]");
    elementos.forEach(el => {
        const clave = el.getAttribute("data-trad");
        if (traducciones[idioma] && traducciones[idioma][pagina] && traducciones[idioma][pagina][clave]) {
            el.textContent = traducciones[idioma][pagina][clave];
        } else {
            console.warn(`No se encontró la traducción para: ${clave}`);
        }
    });
}

const modal = document.getElementById("languageModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.querySelector(".close");

openModalBtn.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modal.style.display = "none";
    }
});

document.querySelectorAll('.language-option').forEach(button => {
    button.addEventListener('click', function() {
        const idioma = this.getAttribute('data-idioma');
        
        let pagina;
        if (window.location.pathname.includes("login")) {
            pagina = "login";
        } else if (window.location.pathname.includes("register")) {
            pagina = "register";
        } else if (window.location.pathname.includes("centroDeAyuda")) {
            pagina = "centroDeAyuda";
        } else if (window.location.pathname.includes("perfil")) {
            pagina = "perfil";
        } else if (window.location.pathname.includes("configuracion")) {
            pagina = "configuracion";
        } else {
            console.warn("No se pudo detectar la página actual.");
            return;
        }

        // Cambiar el idioma
        document.documentElement.lang = idioma;
        cambiarIdioma(idioma, pagina);
        localStorage.setItem('idioma', idioma);
        modal.style.display = "none";
    });
});