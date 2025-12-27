
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".numscroller");

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCounting(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 } // Start when 50% visible
    );

    elements.forEach((el) => observer.observe(el));

    function startCounting(el) {
        const max = parseInt(el.getAttribute("data-max").replace(/\./g, ""), 10); // Remove dots for parsing
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 2000; // Animation duration in ms
        const stepTime = 20; // Update every 20ms
        const steps = duration / stepTime;
        const increment = max / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= max) {
                current = max;
                clearInterval(timer);
            }

            // Format number with German locale (thousands separator point)
            const formatted = Math.floor(current).toLocaleString("de-DE");
            el.textContent = formatted + suffix;
        }, stepTime);
    }
});
