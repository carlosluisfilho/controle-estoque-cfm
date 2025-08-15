// Utilitário para loading states
class LoadingManager {
  static show(element, text = 'Carregando...') {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (!element) return;

    element.disabled = true;
    element.dataset.originalText = element.textContent || element.value;
    
    if (element.tagName === 'BUTTON') {
      element.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${text}`;
    } else {
      element.classList.add('loading');
    }
  }

  static hide(element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    }
    if (!element) return;

    element.disabled = false;
    element.classList.remove('loading');
    
    if (element.dataset.originalText) {
      if (element.tagName === 'BUTTON') {
        element.innerHTML = element.dataset.originalText;
      }
      delete element.dataset.originalText;
    }
  }

  static showTable(tableId, message = 'Carregando dados...') {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="100%" class="text-center p-4">
        <div class="spinner-border text-primary me-2"></div>${message}
      </td></tr>`;
    }
  }

  static showSection(sectionId, message = 'Carregando...') {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.innerHTML = `<div class="text-center p-4">
      <div class="spinner-border text-primary mb-2"></div>
      <div>${message}</div>
    </div>`;
  }
}