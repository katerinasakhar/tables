// UploadPage.jsx
import React, { useState, useRef } from 'react';
import styles from './UploadPage.module.css';

const UploadPage = () => {
  // Состояния компонента
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, completed
  const [uploadResults, setUploadResults] = useState([]);
  
  const fileInputRef = useRef(null);

  // Обработчик выбора файлов через input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  // Обработчик выбора директории
  const handleSelectFolder = () => {
    const input = fileInputRef.current;
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.setAttribute('multiple', '');
    input.click();
    // Сброс атрибутов после выбора
    setTimeout(() => {
      input.removeAttribute('webkitdirectory');
      input.removeAttribute('directory');
    }, 100);
  };

  // Обработчик перетаскивания файлов
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Обработка и нормализация файлов
  const processFiles = (newFiles) => {
    const processedFiles = newFiles.map(file => {
      // Для файлов из директории: оставляем только имя файла
      if (file.webkitRelativePath) {
        const fileName = file.webkitRelativePath.split('/').pop();
        return new File([file], fileName, { type: file.type });
      }
      return file;
    });

    setFiles(prev => [...prev, ...processedFiles]);
  };

  // Удаление файла из списка
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Имитация отправки на сервер
  const handleUpload = async () => {
    setUploadStatus('uploading');
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Генерация результатов (в реальном приложении заменить на реальный запрос)
    const results = files.map((file, index) => {
      const isSuccess = Math.random() > 0.3;
      return {
        fileName: file.name,
        success: isSuccess,
        error: isSuccess ? null : `Ошибка загрузки (код: ${Math.floor(Math.random() * 1000)})`
      };
    });
    
    setUploadResults(results);
    setUploadStatus('completed');
  };

  // Сброс состояния для новой загрузки
  const handleReset = () => {
    setFiles([]);
    setUploadStatus('idle');
    setUploadResults([]);
  };

  // Рендеринг основного интерфейса загрузки
  const renderUploadInterface = () => (
    <div className={styles.container}>
      <div 
        className={`${styles.uploadArea} ${isDragging ? styles.dragActive : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className={styles.fileInput}
          onChange={handleFileChange}
          multiple
        />
        
        <div className={styles.uploadContent}>
          <div className={styles.folderIcon}>📁</div>
          <p>Перетащите файлы сюда или</p>
          
          <div className={styles.uploadButtons}>
            <button 
              className={styles.uploadButton}
              onClick={() => fileInputRef.current.click()}
            >
              Выбрать файлы
            </button>
            <button 
              className={styles.uploadButton}
              onClick={handleSelectFolder}
            >
              Выбрать папку
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.fileListContainer}>
        <div className={styles.fileListHeader}>
          <h3>Выбранные файлы</h3>
          <span className={styles.fileCount}>{files.length} файлов</span>
        </div>
        
        <div className={styles.filesList}>
          {files.length === 0 ? (
            <div className={styles.emptyState}>Файлы не выбраны</div>
          ) : (
            files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>📄</div>
                  <div className={styles.fileDetails}>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileSize}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button 
                  className={styles.removeButton}
                  onClick={() => handleRemoveFile(index)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className={styles.footer}>
          <button 
            className={styles.actionButton}
            onClick={handleUpload}
            disabled={files.length === 0}
          >
            <span className={styles.uploadIcon}>↑</span>
            Отправить на сервер
          </button>
        </div>
      </div>
    </div>
  );

  // Рендеринг результатов загрузки
  const renderResults = () => (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <h2>Результаты загрузки</h2>
        <div className={styles.errorCount}>
          Ошибок: {uploadResults.filter(r => !r.success).length}
        </div>
      </div>
      
      <div className={styles.resultsList}>
        {uploadResults.map((result, index) => (
          <div key={index} className={styles.resultItem}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>📄</div>
              <div className={styles.fileDetails}>
                <div className={styles.fileName}>{result.fileName}</div>
                {!result.success && (
                  <div className={styles.errorMessage}>{result.error}</div>
                )}
              </div>
            </div>
            <div className={styles.statusIcon}>
              {result.success ? '✅' : '❌'}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <button 
          className={styles.actionButton}
          onClick={handleReset}
        >
          <span className={styles.backIcon}>←</span>
          Загрузить еще файлы
        </button>
      </div>
    </div>
  );

  // Рендеринг состояния загрузки
  const renderUploading = () => (
    <div className={styles.uploadingContainer}>
      <div className={styles.loader}></div>
      <p>Идет отправка файлов на сервер...</p>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {uploadStatus === 'completed' 
        ? renderResults() 
        : uploadStatus === 'uploading'
          ? renderUploading()
          : renderUploadInterface()
      }
    </div>
  );
};

export default UploadPage;