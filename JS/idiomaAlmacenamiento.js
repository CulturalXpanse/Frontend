window.addEventListener('DOMContentLoaded', (event) => {
    const idiomaGuardado = localStorage.getItem('idioma');
    if (idiomaGuardado) {
        let pagina;
        if (window.location.pathname.includes("login")) {
            pagina = "login";
        } else if (window.location.pathname.includes("register")) {
            pagina = "register";
        } else if (window.location.pathname.includes("centroDeAyuda")) {
            pagina = "centroDeAyuda";
        } else if (window.location.pathname.includes("olvidarContrasenia")) {
            pagina = "olvidarContrasenia";
        } else if (window.location.pathname.includes("inicio")) {
            pagina = "inicio";
        } else if (window.location.pathname.includes("perfil")) {
            pagina = "perfil";
        } else if (window.location.pathname.includes("configuracion")) {
            pagina = "configuracion";
        } else {
            console.warn("No se pudo detectar la página actual.");
            return;
        }
        document.documentElement.lang = idiomaGuardado;
        cambiarIdioma(idiomaGuardado, pagina);
    }
});