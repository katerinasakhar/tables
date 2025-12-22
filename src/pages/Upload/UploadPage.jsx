// === File: pages/Upload/UploadPage.jsx ===
import React, { useState, useRef, useEffect } from 'react';
import { FiHome } from 'react-icons/fi';
import { FiUpload } from 'react-icons/fi';
import { FiRotateCcw } from 'react-icons/fi';
import { FiFileText } from 'react-icons/fi';
import styles from './UploadPage.module.css';

const UploadPage = ({ selectedForm, setFormSelectModal }) => {
  const api = process.env.API;
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadResults, setUploadResults] = useState([]);
  const [currentFormName, setCurrentFormName] = useState('');
  const fileInputRef = useRef(null);

  // Получение названия текущей формы
  useEffect(() => {
    const fetchCurrentFormName = async () => {
      if (!selectedForm || !api) return;
      
      try {
        const response = await fetch(`${api}/api/v2/forms/${selectedForm}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных формы');
        
        const form = await response.json();
        setCurrentFormName(form.name);
      } catch (error) {
        console.error('Ошибка при получении данных формы:', error);
        setCurrentFormName('Неизвестная форма');
      }
    };

    fetchCurrentFormName();
  }, [selectedForm, api]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const handleSelectFolder = () => {
    const input = fileInputRef.current;
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.setAttribute('multiple', '');
    input.click();
    setTimeout(() => {
      input.removeAttribute('webkitdirectory');
      input.removeAttribute('directory');
    }, 100);
  };

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

  const processFiles = (newFiles) => {
    const processedFiles = newFiles.map(file => {
      if (file.webkitRelativePath) {
        const fileName = file.webkitRelativePath.split('/').pop();
        return new File([file], fileName, { type: file.type });
      }
      return file;
    });
    setFiles(prev => [...prev, ...processedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedForm) {
      alert('Пожалуйста, выберите форму отчетности перед загрузкой файлов');
      return;
    }

    setUploadStatus('uploading');
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      // Правильный способ: form_id в query-параметрах
      const response = await fetch(`${api}/api/v2/upload?form_id=${selectedForm}`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || 'Ошибка сервера при загрузке');
      }
      
      setUploadResults(result.details || []);
      setUploadStatus('completed');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadResults(
        files.map(file => ({
          filename: file.name,
          status: 'Failed',
          error: error.message || 'Не удалось загрузить файл.',
        }))
      );
      setUploadStatus('completed');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setUploadStatus('idle');
    setUploadResults([]);
  };

  const goToHome = () => {
    window.location.href = '/';
  };

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
            <button onClick={() => fileInputRef.current.click()} className={styles.uploadButton}>
              Выбрать файлы
            </button>
            <button onClick={handleSelectFolder} className={styles.uploadButton}>
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
            disabled={files.length === 0 || !selectedForm}
          >
            <FiUpload className={styles.uploadIcon} />
            Отправить на сервер
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const successCount = uploadResults.filter(r => r.status === 'success').length;
    const failedCount = uploadResults.length - successCount;
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h2>Результаты загрузки</h2>
          <div className={styles.errorCount}>
            Ошибок: {failedCount}
          </div>
        </div>
        <div className={styles.resultsList}>
          {uploadResults.map((result, index) => (
            <div key={index} className={styles.resultItem}>
              <div className={styles.fileInfo}>
                <div className={styles.fileIcon}>📄</div>
                <div className={styles.fileDetails}>
                  <div className={styles.fileName}>{result.filename}</div>
                  {result.error && (
                    <div className={styles.errorMessage}>
                      {result.error}
                    </div>
                  )}
                  {!result.error && result.status !== 'success' && (
                    <div className={styles.errorMessage}>
                      {result.status === 'duplicate'
                        ? 'Файл уже был загружен'
                        : 'Неизвестная ошибка'}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.statusIcon}>
                {result.status === 'success'
                  ? '✅'
                  : result.status === 'duplicate'
                  ? '⚠️'
                  : '❌'}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <button 
            className={styles.actionButton}
            onClick={handleReset}
          >
            <FiRotateCcw className={styles.backIcon} />
            Загрузить ещё
          </button>
          <button 
            className={styles.actionButton}
            onClick={goToHome}
          >
            <FiHome className={styles.homeIcon} />
            В главное меню
          </button>
        </div>
      </div>
    );
  };

  const renderUploading = () => (
    <div className={styles.uploadingContainer}>
      <div className={styles.loader}></div>
      <p>Идёт отправка файлов на сервер...</p>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <button className={styles.homeButton} onClick={goToHome}>
        <FiHome className={styles.homeIcon} />
        Главное меню
      </button>
      
      <div className={styles.formSelector} onClick={() => setFormSelectModal(true)}>
        <FiFileText size={18} />
        <span>Текущая форма: {currentFormName || 'Загрузка...'}</span>
      </div>

      <div className={styles.centeredContent}>
        <header className={styles.header}>
          <h1>Загрузка файлов</h1>
          <p>
            Загрузите новый отчет, чтобы включить его в анализ или повторно загрузите документы,
            которые ранее загрузились с ошибками
          </p>
        </header>
        {uploadStatus === 'completed'
          ? renderResults()
          : uploadStatus === 'uploading'
          ? renderUploading()
          : renderUploadInterface()}
      </div>
    </div>
  );
};

export default UploadPage;
// === End of file ===