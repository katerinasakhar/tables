import "./DownloadFiles.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { API_ENDPOINT } from "../config/api";

function DownloadFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    event.target.value = null;
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
  };

  const handleSendFiles = async () => {
    if (selectedFiles.length === 0) {
      alert("Пожалуйста, выберите файлы для отправки.");
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("Ответ от сервера:", result);
      if (response.ok) {
        navigate("/uploaded-files", { state: { uploadResult: result } });
      } else {
        alert(`Ошибка: ${result.message || "Не удалось отправить файлы."}`);
      }
    } catch (error) {
      console.error("Ошибка при отправке файлов:", error);
      alert("Произошла ошибка при отправке файлов. Попробуйте снова.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.endsWith(".xlsm")
    );
    if (files.length) {
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };
  const handleClick = () => {
    fileInputRef.current.click();
  };

  function getFileWord(n) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return "файлов";
    if (n1 > 1 && n1 < 5) return "файла";
    if (n1 === 1) return "файл";
    return "файлов";
  }

  return (
    <div
      className={`download-page__container${
        selectedFiles.length === 0
          ? " download-page__container--centered"
          : selectedFiles.length > 0
          ? " with-files-centered"
          : ""
      }`}
    >
      {selectedFiles.length === 0 ? null : (
        <NavLink
          to="/"
          className="download-page__button-back download-page__button-back--top"
        >
          <div className="back-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </div>
          <div>Назад</div>
        </NavLink>
      )}
      {selectedFiles.length > 0 && <div className="download-page__spacer" />}
      <div
        className={`download-page__header${
          selectedFiles.length === 0 ? " download-page__header--hidden" : ""
        }`}
      >
        {selectedFiles.length > 0 && (
          <div className="download-page__file-count">
            {selectedFiles.length} {getFileWord(selectedFiles.length)}
          </div>
        )}
      </div>
      {selectedFiles.length > 0 ? (
        <>
          <div className="download-page__files-list-container">
            <div className="download-page__files-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="download-page__file-item">
                  <div className="download-page__file-info">
                    <div className="download-page__file-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 344 432"
                      >
                        <path
                          fill="currentColor"
                          d="M43 3h170l128 128v256q0 17-12.5 29.5T299 429H42q-17 0-29.5-12.5T0 387V45q0-17 12.5-29.5T43 3zm149 149h117L192 35v117z"
                        />
                      </svg>
                    </div>
                    <span className="download-page__file-name">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file)}
                    className="download-page__remove-file-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5.5 4.5h10v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm5-2a2 2 0 0 1 1.995 1.85l.005.15h-4a2 2 0 0 1 2-2zm-7 2h14m-9 3v8m4-8v8"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="download-page__spacer" />
          <div className="download-page__footer download-page__footer--outside">
            <label className="custom-fileinput">
              <input
                type="file"
                multiple
                className="custom-fileinput__input"
                onChange={handleFileChange}
                accept=".xlsm"
                ref={fileInputRef}
              />
              <span className="custom-fileinput__button">
                <div className="file-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344 432">
                    <path
                      fill="currentColor"
                      d="M43 3h170l128 128v256q0 17-12.5 29.5T299 429H42q-17 0-29.5-12.5T0 387V45q0-17 12.5-29.5T43 3zm149 149h117L192 35v117z"
                    />
                  </svg>
                </div>
                <p>Выбрать файлы</p>
              </span>
            </label>
            <button
              onClick={handleSendFiles}
              className="download-page__button-send"
            >
              <div className="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="m7.5.793l4.354 4.353l-.708.708L8 2.707V12H7V2.707L3.854 5.854l-.708-.708L7.5.793ZM14 13v1H1v-1h13Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>Отправить</div>
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className={`custom-fileinput custom-fileinput--big${
              isDragActive ? " custom-fileinput--drag" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              type="file"
              multiple
              className="custom-fileinput__input"
              onChange={handleFileChange}
              accept=".xlsm"
              ref={fileInputRef}
            />
            <span className="custom-fileinput__button custom-fileinput__button--big">
              <div className="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344 432">
                  <path
                    fill="currentColor"
                    d="M43 3h170l128 128v256q0 17-12.5 29.5T299 429H42q-17 0-29.5-12.5T0 387V45q0-17 12.5-29.5T43 3zm149 149h117L192 35v117z"
                  />
                </svg>
              </div>
              <p>Выбрать файлы</p>
            </span>
          </div>
          <NavLink to="/" className="download-page__button-back">
            <div className="back-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            </div>
            <div>Назад</div>
          </NavLink>
        </>
      )}
    </div>
  );
}

export default DownloadFiles;
