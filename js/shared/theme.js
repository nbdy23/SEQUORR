// Theme Toggle Functionality
(function() {
    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        updateThemeIcon(theme);
    };

    const updateThemeIcon = (theme) => {
        const button = document.querySelector('.theme-toggle-btn');
        if (button) {
            // Rotate the SVG icon
            const svg = button.querySelector('svg');
            if (svg) {
                svg.style.transform = theme === "light" ? "rotate(180deg)" : "rotate(0deg)";
            }
        }
    };

    const getTheme = () => {
        return localStorage.getItem("theme") || "dark";
    };

    const toggleTheme = () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    // Initialize theme on page load
    const currentTheme = getTheme();
    setTheme(currentTheme);

    // Attach click listener
    document.addEventListener('DOMContentLoaded', function() {
        const themeButton = document.querySelector('[data-theme-toggle]');
        if (themeButton) {
            themeButton.addEventListener('click', toggleTheme);
        }
    });

    window.toggleTheme = toggleTheme;
})();