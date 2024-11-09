    var settingsmenu = document.querySelector(".settings-menu");
    var settingsButton = document.querySelector(".nav-user-icon");
    var darkBtn = document.getElementById("dark-btn");

    function settingsMenuToggle(){
        settingsmenu.classList.toggle("settings-menu-height");
    }

    var menuLinks = document.querySelectorAll(".settings-links a");
    menuLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        settingsMenuToggle();
        });
    });

    function notificationMenuToggle() {
        const notificationMenu = document.getElementById('notification-menu');
        notificationMenu.classList.toggle('active');
    }
    
    window.onclick = function(event) {
        const notificationMenu = document.getElementById('notification-menu');
        if (!event.target.matches('#notification-icon')) {
            if (notificationMenu.classList.contains('active')) {
                notificationMenu.classList.remove('active');
            }
        }
    }

    darkBtn.onclick = function(){
        darkBtn.classList.toggle("dark-btn-on")
        document.body.classList.toggle("dark-theme");
        
        if(localStorage.getItem("theme") == "light"){
            localStorage.setItem("theme", "dark");
        }else{
            localStorage.setItem("theme", "light");
        }
    }

    if(localStorage.getItem("theme") == "light"){
        darkBtn.classList.remove("dark-btn-on");
        document.body.classList.remove("dark-theme");
    }
    else if(localStorage.getItem("theme") == "dark"){
        darkBtn.classList.add("dark-btn-on");
        document.body.classList.add("dark-theme");
    }
    else{
        localStorage.setItem("theme", "light");
    }

    const dots = document.querySelectorAll('.dots');

    dots.forEach(dot => {
        dot.addEventListener('click', function(event) {
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
            event.stopPropagation();
        });
    });

    document.addEventListener('click', () => {
        dots.forEach(dot => {
            const dropdown = dot.nextElementSibling;
            dropdown.classList.remove('show');
        });
    });