document.addEventListener('DOMContentLoaded', function () {
    const botonMenu = document.querySelector('.dropbtn');
    const contenidoDropdown = document.querySelector('.dropdown-content');

    botonMenu.addEventListener('click', function (event) {
        contenidoDropdown.classList.toggle('mostrar');
        event.stopPropagation();
    });

    document.addEventListener('click', function () {
        if (contenidoDropdown.classList.contains('mostrar')) {
            contenidoDropdown.classList.remove('mostrar');
        }
    });
});
