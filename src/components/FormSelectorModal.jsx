import React, { useState, useEffect } from 'react';
import Modal from '../features/Modal';
import './FormSelectorModal.css';

const FormSelectorModal = ({ 
  active, 
  setActive, 
  forms, 
  selectedForm, 
  onSelectForm,
  onSave,
  onCreateForm,
  isInitial = false
}) => {
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [creatingFormType, setCreatingFormType] = useState(null);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [localSelectedForm, setLocalSelectedForm] = useState(selectedForm);

  // Синхронизируем локальное состояние с пропсами при изменении
  useEffect(() => {
    setLocalSelectedForm(selectedForm);
  }, [selectedForm, active]);

  // Проверяем, нужно ли показывать создание формы
  const shouldShowCreateForm = forms.length === 0 || isCreatingForm;

  if (!active) return null;

  const handleCreateForm = async (formType) => {
    setCreatingFormType(formType);
    setCreatingLoading(true);
    try {
      let formName = '';
      let skipSheets = [];
      
      switch(formType) {
        case '1ФК':
          formName = '1ФК';
          skipSheets = [0, 1];
          break;
        case '5ФК':
          formName = '5ФК';
          skipSheets = [0, 1];
          break;
        case 'Универсальная':
          formName = 'Универсальная';
          skipSheets = [];
          break;
      }
      
      await onCreateForm(formName, skipSheets);
      setIsCreatingForm(false);
      setCreatingFormType(null);
      
      // Если это начальное модальное окно, автоматически сохраняем
      if (isInitial) {
        onSave();
      }
    } catch (error) {
      alert(`Ошибка создания формы: ${error.message}`);
    } finally {
      setCreatingLoading(false);
    }
  };

  const handleSave = () => {
    if (localSelectedForm) {
      onSelectForm(localSelectedForm);
      onSave();
    }
  };

  return (
    <Modal active={active} setActive={setActive}>
      <div className="form-selector-modal">
        <h2 className="modal-title">
          {forms.length === 0 ? 'Создание первой формы отчетности' : 'Выберите форму отчетности'}
        </h2>
        
        {shouldShowCreateForm ? (
          <div className="create-form-section">
            <p className="form-info-text">
              {forms.length === 0 
                ? 'Нет доступных форм отчетности. Создайте одну из стандартных форм:'
                : 'Создать новую стандартную форму:'}
            </p>
            <div className="forms-grid">
              <button
                onClick={() => handleCreateForm('1ФК')}
                disabled={creatingLoading}
                className="form-card"
              >
                <div className="form-name">1ФК</div>
                <div className="form-info">Стандартная форма 1ФК</div>
                {creatingLoading && creatingFormType === '1ФК' && (
                  <div className="creating-indicator">Создание...</div>
                )}
              </button>
              <button
                onClick={() => handleCreateForm('5ФК')}
                disabled={creatingLoading}
                className="form-card"
              >
                <div className="form-name">5ФК</div>
                <div className="form-info">Стандартная форма 5ФК</div>
                {creatingLoading && creatingFormType === '5ФК' && (
                  <div className="creating-indicator">Создание...</div>
                )}
              </button>
              <button
                onClick={() => handleCreateForm('Универсальная')}
                disabled={creatingLoading}
                className="form-card"
              >
                <div className="form-name">Универсальная</div>
                <div className="form-info">Универсальная форма для всех отчетов</div>
                {creatingLoading && creatingFormType === 'Универсальная' && (
                  <div className="creating-indicator">Создание...</div>
                )}
              </button>
            </div>
            {forms.length > 0 && !creatingLoading && (
              <button
                className="back-to-list-button"
                onClick={() => setIsCreatingForm(false)}
              >
                ← Вернуться к списку форм
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="forms-grid">
              {forms.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setLocalSelectedForm(form.id)}
                  className={`form-card ${localSelectedForm === form.id ? 'selected' : ''}`}
                >
                  <div className="form-name">{form.name}</div>
                  {form.requisites && form.requisites.skip_sheets && (
                    <div className="form-info">
                      Пропускает листы: {form.requisites.skip_sheets.join(', ')}
                    </div>
                  )}
                  <div className="form-id">ID: {form.id.substring(0, 8)}...</div>
                  {localSelectedForm === form.id && (
                    <div className="selected-badge">Выбрано</div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Кнопка создания формы показывается ТОЛЬКО если форм нет */}
            {forms.length === 0 && (
              <div className="create-new-section">
                <button
                  className="create-new-button"
                  onClick={() => setIsCreatingForm(true)}
                >
                  + Создать новую форму
                </button>
              </div>
            )}
          </>
        )}
        
        <div className="modal-footer">
          {!shouldShowCreateForm && (
            <button
              className="save-button"
              onClick={handleSave}
              disabled={!localSelectedForm}
            >
              {isInitial ? 'Начать работу' : 'Сохранить выбор'}
            </button>
          )}
          
          {!isInitial && !shouldShowCreateForm && (
            <button
              className="close-button"
              onClick={() => {
                setLocalSelectedForm(selectedForm);
                setActive(false);
              }}
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FormSelectorModal;