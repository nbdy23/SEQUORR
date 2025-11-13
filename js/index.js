// Index Page - Scroll Reveal
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const modules = document.querySelectorAll('.module');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2
        });
        
        modules.forEach(module => {
            observer.observe(module);
        });
    });
})();