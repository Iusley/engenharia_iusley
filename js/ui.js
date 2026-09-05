// Presentation only. The existing contact submission flow remains in index.html.
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('#navLinks');
  const area = document.querySelector('#area');

  const syncMenuLabel = () => {
    toggle.setAttribute('aria-label', toggle.getAttribute('aria-expanded') === 'true' ? 'Fechar menu' : 'Abrir menu');
    toggle.querySelector('i')?.setAttribute('aria-hidden', 'true');
  };

  // Existing click handlers own opening/closing the navigation.
  toggle.addEventListener('click', syncMenuLabel);
  navigation.addEventListener('click', syncMenuLabel);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.click();
      toggle.focus();
    }
  });

  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      area.value = link.dataset.service;
      area.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // Restore the button when returning from the existing email service via browser Back.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    const button = document.querySelector('#submitButton');
    button.disabled = false;
    button.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Enviar mensagem';
  });
})();
