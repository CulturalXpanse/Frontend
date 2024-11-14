document.addEventListener('DOMContentLoaded', () => {
    const friendList = document.querySelector('.amigos-list');
    const contextMenu = document.getElementById('context-menu');
    let selectedUserId = null;

    friendList.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        if (e.target.closest('.amigos')) {
            const amigo = e.target.closest('.amigos');
            selectedUserId = amigo.getAttribute('id');
            contextMenu.style.display = 'block';
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;
        }
    });

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    document.getElementById('view-profile').addEventListener('click', () => {
        if (selectedUserId) {
            window.location.href = `perfilUsuario.html?id=${selectedUserId}`;
        }
    });

    // Lógica para las barras laterales
    const leftSidebarButton = document.querySelector('.left-sidebar-button');
    const rightSidebarButton = document.querySelector('.right-sidebar-button');
    const leftSidebar = document.querySelector('.left-sidebar');
    const rightSidebar = document.querySelector('.right-sidebar');
    const leftArrow = leftSidebarButton.querySelector('i');
    const rightArrow = rightSidebarButton.querySelector('i');

    function closeBothSidebars() {
        leftSidebar.classList.remove('visible');
        rightSidebar.classList.remove('visible');
        leftArrow.classList.remove('fa-arrow-left');
        leftArrow.classList.add('fa-arrow-right');
        rightArrow.classList.remove('fa-arrow-right');
        rightArrow.classList.add('fa-arrow-left');
    }

    leftSidebarButton.addEventListener('click', () => {
        if (leftSidebar.classList.contains('visible')) {
            leftSidebar.classList.remove('visible');
            leftArrow.classList.remove('fa-arrow-left');
            leftArrow.classList.add('fa-arrow-right');
        } else {
            closeBothSidebars();
            leftSidebar.classList.add('visible');
            leftArrow.classList.remove('fa-arrow-right');
            leftArrow.classList.add('fa-arrow-left');
        }
    });

    rightSidebarButton.addEventListener('click', () => {
        if (rightSidebar.classList.contains('visible')) {
            rightSidebar.classList.remove('visible');
            rightArrow.classList.remove('fa-arrow-right');
            rightArrow.classList.add('fa-arrow-left');
        } else {
            closeBothSidebars();
            rightSidebar.classList.add('visible');
            rightArrow.classList.remove('fa-arrow-left');
            rightArrow.classList.add('fa-arrow-right');
        }
    });
});