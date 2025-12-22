// === File: LoadingState.jsx ===
import React from 'react';
import './LoadingState.css';

const LoadingState = ({ state, onRetry }) => {
  if (state.status === 'loading') {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Загрузка данных...</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2 className="error-title">Ошибка загрузки</h2>
          <p className="error-message">{state.error || 'Неизвестная ошибка'}</p>
          <button className="retry-button" onClick={onRetry}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (state.status === 'no-forms') {
    return (
      <div className="no-forms-container">
        <div className="no-forms-content">
          <h2 className="no-forms-title">Нет доступных форм</h2>
          <p className="no-forms-message">В системе не найдено форм отчетности. Пожалуйста, создайте хотя бы одну форму через административный интерфейс.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingState;
// === End of file ===