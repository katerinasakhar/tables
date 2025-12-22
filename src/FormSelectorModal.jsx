// === File: FormSelectorModal.jsx ===
import React from 'react';
import Modal from './features/Modal';
import './FormSelectorModal.css';

const FormSelectorModal = ({ active, setActive, forms, selectedForm, onSelectForm }) => {
  if (!active) return null;

  return (
    <Modal active={active} setActive={setActive}>
      <div className="form-selector-modal">
        <h2 className="modal-title">Выберите форму отчетности</h2>
        
        <div className="forms-grid">
          {forms.map((form) => (
            <button
              key={form.id}
              onClick={() => onSelectForm(form.id)}
              className={`form-card ${selectedForm === form.id ? 'selected' : ''}`}
            >
              <div className="form-name">{form.name}</div>
              {form.requisites && form.requisites.skip_sheets && (
                <div className="form-info">
                  Пропускает листы: {form.requisites.skip_sheets.join(', ')}
                </div>
              )}
              <div className="form-id">ID: {form.id.substring(0, 8)}...</div>
              {selectedForm === form.id && (
                <div className="selected-badge">Выбрано</div>
              )}
            </button>
          ))}
        </div>
        
        <div className="modal-footer">
          <button className="close-button" onClick={() => setActive(false)}>
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FormSelectorModal;
// === End of file ===