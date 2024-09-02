function cambiarIdioma(lengua) {
    localStorage.setItem('idioma', lengua);
    location.reload();
}

function translatePage() {
    const lengua = localStorage.getItem('idioma') || 'es';
    document.documentElement.lang = lengua;
    
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach((element) => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[lengua][key];
    });
}

// Diccionario de traducciones
const translations = {
    es: {
        greeting: "Hola",
        // Agrega más claves y traducciones según sea necesario
    },
    en: {
        greeting: "Hello",
        // Agrega más claves y traducciones según sea necesario
    }
};

window.onload = translatePage;