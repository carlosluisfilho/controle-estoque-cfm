// Utilitário para confirmações de ações
class ConfirmDialog {
  static show(message, onConfirm, onCancel = null) {
    const sanitizedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">⚠️ Confirmação</h5>
          </div>
          <div class="modal-body">
            <p>${sanitizedMessage}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmBtn">Confirmar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const bootstrapModal = typeof bootstrap !== 'undefined' 
      ? new bootstrap.Modal(modal)
      : { show: () => modal.style.display = 'block', hide: () => modal.style.display = 'none' };
    
    modal.querySelector('#confirmBtn').onclick = () => {
      bootstrapModal.hide();
      onConfirm();
    };
    
    modal.addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(modal);
      if (onCancel) onCancel();
    });
    
    bootstrapModal.show();
  }
  
  static simple(message) {
    return confirm(message);
  }
}