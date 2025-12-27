
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
        this.highlightActiveLinks();
      })
      .catch(err => console.error('Error loading header:', err));
  }

  initMobileMenu() {
    const mobileToggle = this.querySelector('#mobileToggle');
    const mobileMenu = this.querySelector('#mobileMenu');

    if (mobileToggle && mobileMenu) {
      const toggleMenu = () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        document.body.style.overflow = isHidden ? '' : 'hidden';
      };

      mobileToggle.addEventListener('click', toggleMenu);

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          document.body.style.overflow = '';
        });
      });
    }
  }

  highlightActiveLinks() {
    const currentPath = window.location.pathname.replace(/\/$/, "").replace(/\.html$/, "");
    const links = this.querySelectorAll("nav a, #mobileMenu a");

    links.forEach((link) => {
      try {
        const url = new URL(link.href);
        // Only checking internal links
        if (url.origin === window.location.origin) {
          const linkPath = url.pathname.replace(/\/$/, "").replace(/\.html$/, "");

          // Check if paths match, but EXCLUDE links with hashes (anchors on the same page)
          // unless you specifically want to handle scrollspy separately.
          // This prevents "Einsatzbereiche" (/#welten) from being orange on home page.
          if (linkPath === currentPath && !url.hash) {
            // Check for H4 title (dropdown/mobile items)
            const title = link.querySelector("h4");
            if (title) {
              title.classList.remove("text-slate-900");
              title.classList.add("text-brand-orange");
            } else {
              link.classList.remove("text-slate-800/80");
              link.classList.add("text-brand-orange");
            }
          }
        }
      } catch (e) {
        console.error("Error parsing link URL", e);
      }
    });
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

// Initialize Read More toggles for prose blocks
function initReadMoreToggles() {
  const proseBlocks = document.querySelectorAll('.prose');

  proseBlocks.forEach(prose => {
    if (prose.scrollHeight > 340) {
      // Add collapsed class
      prose.classList.add('prose-collapsed');

      // Create toggle button
      const toggleBtn = document.createElement('div');
      toggleBtn.className = 'prose-toggle';
      toggleBtn.innerHTML = `
          <span>Mehr anzeigen</span>
          <i class="fa-solid fa-chevron-down"></i>
        `;

      // Insert after prose block
      if (prose.parentNode) {
        prose.parentNode.insertBefore(toggleBtn, prose.nextSibling);
      }

      // Add click event
      toggleBtn.addEventListener('click', () => {
        const isCollapsed = prose.classList.contains('prose-collapsed');

        if (isCollapsed) {
          prose.classList.remove('prose-collapsed');
          toggleBtn.classList.add('expanded');
          toggleBtn.querySelector('span').textContent = 'Weniger anzeigen';
        } else {
          prose.classList.add('prose-collapsed');
          toggleBtn.classList.remove('expanded');
          toggleBtn.querySelector('span').textContent = 'Mehr anzeigen';
          // Smooth scroll back to top of content if needed? 
          // prose.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small timeout to ensure styles and layout calculate height correctly
  setTimeout(() => {
    initReadMoreToggles();
    initComponentAnimations(document);
  }, 100);
});
