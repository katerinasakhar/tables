import React from 'react';
import ReactDOM from 'react-dom';
import './ErrorDisplay.css';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  isModal = false,
  onClose 
}) => {
  const getErrorMessage = () => {
    if (error.details) return error.details;
    if (error.originalError?.detail) return error.originalError.detail;
    return error.message || 'Произошла ошибка';
  };

  const getErrorStatus = () => {
    if (error.status) return error.status;
    if (error.context === 'loadForms') return 'Ошибка загрузки форм';
    if (error.context === 'createForm') return 'Ошибка создания формы';
    return 'Ошибка';
  };

  const getServerResponse = () => {
    if (error.serverResponse) {
      return JSON.stringify(error.serverResponse, null, 2);
    }
    return JSON.stringify(error.originalError || error, null, 2);
  };

  const content = (
    <div className={`error-display ${isModal ? 'error-modal' : 'error-inline'}`}>
      <div className="error-header">
        <div className="error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="error-title">
          <h3>{getErrorStatus()}</h3>
          {error.operation && (
            <p className="error-explanation">{error.operation}</p>
          )}
        </div>
        {isModal && onClose && (
          <button className="error-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <div className="error-details">
        <div className="error-details-content">
          <div className="error-section">
            <h4>Описание ошибки</h4>
            <p>{getErrorMessage()}</p>
          </div>
          
          <div className="error-section">
            <h4>Ответ сервера</h4>
            <pre>{getServerResponse()}</pre>
          </div>
          
          <div className="error-meta">
            <small>Время: {new Date().toLocaleString('ru-RU')}</small>
            {error.status && <small>Статус: {error.status}</small>}
          </div>
        </div>
      </div>

      <div className="error-actions">
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return ReactDOM.createPortal(
      <div className="error-modal-overlay" onClick={onClose}>
        <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>,
      document.getElementById('modal-root') || document.body
    );
  }

  return content;
};

export default ErrorDisplay;
