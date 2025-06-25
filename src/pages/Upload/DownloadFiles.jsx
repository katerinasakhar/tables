import "./DownloadFiles.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
const API_ENDPOINT = "http://5.165.236.240:2700/api/v2/upload"; 

function DownloadFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    event.target.value = null;
  };

  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Group files by their directory
      const folderMap = new Map();

      files.forEach((file) => {
        const pathParts = file.webkitRelativePath.split("/");
        const folderName = pathParts[0];

        if (!folderMap.has(folderName)) {
          folderMap.set(folderName, {
            name: folderName,
            files: [],
          });
        }
        folderMap.get(folderName).files.push(file);
      });

      const newFolders = Array.from(folderMap.values());
      setSelectedFolders([...selectedFolders, ...newFolders]);
    }
    event.target.value = null;
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
  };

  const handleRemoveFolder = (folderToRemove) => {
    setSelectedFolders(
      selectedFolders.filter((folder) => folder !== folderToRemove)
    );
  };

  const handleSendFiles = async () => {
    const allFiles = [
      ...selectedFiles,
      ...selectedFolders.flatMap((folder) => folder.files),
    ];

    if (allFiles.length === 0) {
      alert("Пожалуйста, выберите файлы для отправки.");
      return;
    }

    const formData = new FormData();
    allFiles.forEach((file) => {
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
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFolderClick = () => {
    folderInputRef.current.click();
  };

  function getFileWord(n) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return "файлов";
    if (n1 > 1 && n1 < 5) return "файла";
    if (n1 === 1) return "файл";
    return "файлов";
  }

  const totalItems = selectedFiles.length + selectedFolders.length;

  return (
    <div
      className={`download-page__container${
        totalItems === 0
          ? " download-page__container--centered"
          : totalItems > 0
          ? " with-files-centered"
          : ""
      }`}
    >
      {totalItems === 0 ? null : (
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
      {totalItems > 0 && <div className="download-page__spacer" />}
      <div
        className={`download-page__header${
          totalItems === 0 ? " download-page__header--hidden" : ""
        }`}
      >
        {totalItems > 0 && (
          <div className="download-page__header-count">
            {selectedFiles.length +
              selectedFolders.flatMap((folder) => folder.files).length}{" "}
            {getFileWord(
              selectedFiles.length +
                selectedFolders.flatMap((folder) => folder.files).length
            )}
          </div>
        )}
      </div>
      {totalItems > 0 ? (
        <>
          <div className="download-page__files-list-container">
            <div className="download-page__files-list">
              {/* Display folders first */}
              {selectedFolders.map((folder, index) => (
                <div
                  key={`folder-${index}`}
                  className="download-page__file-item"
                >
                  <div className="download-page__file-info">
                    <div className="download-page__file-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 0 0 .207.11h6.224c.966 0 1.75.783 1.75 1.75v.117H5.408a.848.848 0 0 0 0 1.695h15.484a1 1 0 0 1 .995 1.102L21 19.25c-.106 1.05-.784 1.75-1.75 1.75H3.75A1.75 1.75 0 0 1 2 19.25z"
                        />
                      </svg>
                    </div>
                    <div className="download-page__file-details">
                      <span className="download-page__file-name">
                        {folder.name}
                      </span>
                      <span className="download-page__file-count">
                        {folder.files.length} {getFileWord(folder.files.length)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFolder(folder)}
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

              {/* Display individual files */}
              {selectedFiles.map((file, index) => (
                <div key={`file-${index}`} className="download-page__file-item">
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
          <div className="download-page__upload-container">
            <div
              className={`custom-fileinput custom-fileinput--big${
                isDragActive ? " custom-fileinput--drag" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileClick}
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

            <label className="custom-fileinput custom-fileinput--big">
              <input
                type="file"
                multiple
                webkitdirectory=""
                className="custom-fileinput__input"
                onChange={handleFolderChange}
                accept=".xlsm"
                ref={folderInputRef}
              />
              <span className="custom-fileinput__button custom-fileinput__button--big">
                <div className="folder-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 0 0 .207.11h6.224c.966 0 1.75.783 1.75 1.75v.117H5.408a.848.848 0 0 0 0 1.695h15.484a1 1 0 0 1 .995 1.102L21 19.25c-.106 1.05-.784 1.75-1.75 1.75H3.75A1.75 1.75 0 0 1 2 19.25z"
                    />
                  </svg>
                </div>
                <p>Выбрать папку</p>
              </span>
            </label>
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