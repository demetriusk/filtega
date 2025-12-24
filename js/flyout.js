/**
 * flyout.js
 * Handles the logic for the dynamic functionality of the side modal (flyout).
 * It expects the following IDs in the DOM:
 * - dynamicModal
 * - modalBackdrop
 * - modalPanel
 * - modalContent
 */

function openModal(templateId) {
    const modal = document.getElementById('dynamicModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');
    const contentContainer = document.getElementById('modalContent');
    const template = document.getElementById(templateId);

    // Safety check: if the modal structure is missing, do nothing safely
    if (!modal || !backdrop || !panel || !contentContainer) {
        console.warn('Modal structure not found in the DOM. Ensure #dynamicModal and children exist.');
        return;
    }

    if (!template) {
        console.error(`Template with ID "${templateId}" not found`);
        return;
    }

    // Clear existing content
    contentContainer.innerHTML = '';

    // Clone and append new content
    const clone = template.content.cloneNode(true);
    contentContainer.appendChild(clone);

    // Show modal
    modal.classList.remove('hidden');

    // Force reflow
    void modal.offsetWidth;

    backdrop.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('dynamicModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');

    if (!modal || !backdrop || !panel) return;

    backdrop.classList.add('opacity-0');
    panel.classList.add('translate-x-full');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 500);
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('dynamicModal');
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Expose functions globally if needed (though they are global by default in browser script tags)
window.openModal = openModal;
window.closeModal = closeModal;
