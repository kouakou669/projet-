<script>
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const sidebarWrapper = document.getElementById('sidebar-wrapper');
            const closeMenu = document.getElementById('close-menu');
            const overlay = document.querySelector('.overlay');

            menuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                sidebarWrapper.classList.toggle('active'); // Ajoute ou enlève la classe active
                overlay.style.display = sidebarWrapper.classList.contains('active') ? 'block' : 'none';
            });

            closeMenu.addEventListener('click', function() {
                sidebarWrapper.classList.remove('active'); // Enlève la classe active
                overlay.style.display = 'none'; // Masquer l'overlay
            });

            overlay.addEventListener('click', function() {
                sidebarWrapper.classList.remove('active'); // Enlève la classe active
                overlay.style.display = 'none'; // Masquer l'overlay
            });
        });
    </script>
