document.addEventListener('DOMContentLoaded', function() {
    var notificationIcon = document.getElementById('notification-icon');
    var notificationsDropdown = document.getElementById('notifications-dropdown');
    var closeNotifications = document.getElementById('close-notifications');

    // Mostrar el dropdown
    notificationIcon.addEventListener('click', function(event) {
        event.preventDefault();
        notificationsDropdown.classList.toggle('show');
    });

    // Cerrar el dropdown
    closeNotifications.addEventListener('click', function() {
        notificationsDropdown.classList.remove('show');
    });

    // Cerrar el dropdown si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (!notificationIcon.contains(event.target) && !notificationsDropdown.contains(event.target)) {
            notificationsDropdown.classList.remove('show');
        }
    });
});