
// Helper to init animations for a container (replicates existing site logic)
function initComponentAnimations(container) {
  const animated = container.querySelectorAll('.js-animate');
  if (animated.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  animated.forEach((el) => observer.observe(el));
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    fetch('/components/header.html')
      .then(response => response.text())
      .then(data => {
        this.innerHTML = data;
        this.initMobileMenu();
      })
      .catch(err => console.error('Error loading header:', err));
  }

  initMobileMenu() {
    const mobileToggle = this.querySelector('#mobileToggle');
    const mobileMenu = this.querySelector('#mobileMenu');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
      });
    }
  }
}
customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    fetch('/components/footer.html')
      .then(response => response.text())
      .then(data => {
        this.innerHTML = data;
      })
      .catch(err => console.error('Error loading footer:', err));
  }
}
customElements.define('site-footer', SiteFooter);

class ContactSection extends HTMLElement {
  connectedCallback() {
    fetch('/components/contact.html')
      .then(response => response.text())
      .then(data => {
        this.innerHTML = data;
        // Initialize animations for the loaded content
        initComponentAnimations(this);
      })
      .catch(err => console.error('Error loading contact section:', err));
  }
}
customElements.define('contact-section', ContactSection);
