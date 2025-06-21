import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import "./UploadedFiles.css";

function UploadedFiles() {
  const location = useLocation();
  const { uploadResult } = location.state || { uploadResult: null };

  if (!uploadResult) {
    return (
      <div className="uploaded-files-page__container">
        <h1>Нет данных о загрузке</h1>
        <NavLink to="/download" className="uploaded-files-page__button-menu">
          Вернуться к загрузке
        </NavLink>
      </div>
    );
  }

  const { message, details } = uploadResult;
  const totalFiles = details.length;
  const failedFiles = details.filter(
    (file) => file.status !== "Success"
  ).length;

  return (
    <div className="uploaded-files-page__container">
      <div className="uploaded-files-page__header">
        <h1 className="uploaded-files-page__title">
          Загружено {totalFiles} файла
        </h1>
        {failedFiles > 0 && (
          <p className="uploaded-files-page__error-count">
            С ошибками: {failedFiles}
          </p>
        )}
      </div>

      <div className="uploaded-files-page__files-list-container">
        <div className="uploaded-files-page__files-list">
          {details.map((file, index) => (
            <div key={index} className="uploaded-files-page__file-item">
              <div className="uploaded-files-page__file-info">
                <div className="uploaded-files-page__file-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344 432">
                    <path
                      fill="currentColor"
                      d="M43 3h170l128 128v256q0 17-12.5 29.5T299 429H42q-17 0-29.5-12.5T0 387V45q0-17 12.5-29.5T43 3zm149 149h117L192 35v117z"
                    />
                  </svg>
                </div>
                <span className="uploaded-files-page__file-name">
                  {file.filename}
                </span>
              </div>
              {file.status === "Success" ? (
                <div className="uploaded-files-page__status-icon uploaded-files-page__status-icon--success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="uploaded-files-page__status-icon uploaded-files-page__status-icon--error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {file.error && (
                <div className="uploaded-files-page__error-message">
                  Пояснение: {file.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <NavLink to="/" className="uploaded-files-page__button-menu">
        В главное меню
      </NavLink>
    </div>
  );
}

export default UploadedFiles;
