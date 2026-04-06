// === File: pages/Upload/UploadPage.jsx ===
import React, { useState, useRef, useEffect } from 'react';
import { FiHome, FiUpload, FiRotateCcw, FiFileText, FiCheckCircle, FiAlertCircle, FiFile, FiAlertTriangle } from 'react-icons/fi';
import styles from './UploadPage.module.css';

const UploadPage = ({ selectedForm, setFormSelectModal }) => {
  const api = process.env.API;
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadResults, setUploadResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDetails, setUploadDetails] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentFormName, setCurrentFormName] = useState('');
  const fileInputRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Очистка SSE при размонтировании
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

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

  const startSSE = (uploadId) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const source = new EventSource(`${api}/api/v2/upload-progress/${uploadId}`);
    eventSourceRef.current = source;

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setUploadProgress(data.progress_percentage);
        setCurrentEvent(data);
        
        if (data.status === 'completed' || data.status === 'failed') {
          setUploadResults(data.result?.details || []);
          setUploadDetails(data.result);
          setUploadStatus('completed');
          source.close();
          eventSourceRef.current = null;
        }
      } catch (err) {
        console.error('SSE parsing error:', err);
      }
    };

    source.onerror = (err) => {
      console.error('SSE error:', err);
      setUploadStatus('error');
      source.close();
      eventSourceRef.current = null;
    };
  };

  const handleUpload = async () => {
    if (!selectedForm) {
      alert('Пожалуйста, выберите форму отчетности перед загрузкой файлов');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${api}/api/v2/upload?form_id=${selectedForm}`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || 'Ошибка сервера при загрузке');
      }
      
      const { upload_id } = result;
      startSSE(upload_id);
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadResults(
        files.map(file => ({
          filename: file.name,
          status: 'failed',
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
    setUploadProgress(0);
    setUploadDetails(null);
    setCurrentEvent(null);
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

  const renderUploading = () => (
    <div className={styles.uploadingContainer}>
      <div className={styles.uploadingHeader}>
        <div className={styles.loaderSmall}></div>
        <h3>Обработка данных...</h3>
      </div>
      
      <div className={styles.progressStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Всего файлов:</span>
          <span className={styles.statValue}>{currentEvent?.total || files.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Обработано:</span>
          <span className={styles.statValue}>{currentEvent?.current || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Осталось:</span>
          <span className={styles.statValue}>{(currentEvent?.total || files.length) - (currentEvent?.current || 0)}</span>
        </div>
      </div>

      <div className={styles.modernProgressWrapper}>
        <div className={styles.progressBarBackground}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${uploadProgress}%` }}
          >
            <div className={styles.progressGlow}></div>
          </div>
        </div>
        <div className={styles.progressPercentageText}>{uploadProgress.toFixed(0)}%</div>
      </div>

      {currentEvent?.processed_files?.length > 0 && (
        <div className={styles.recentFiles}>
          <h4>Последние обработанные:</h4>
          <div className={styles.recentFilesList}>
            {currentEvent.processed_files.slice(-3).reverse().map((f, i) => (
              <div key={i} className={styles.recentFileItem}>
                <span className={styles.recentFileIcon}>✓</span>
                <span className={styles.recentFileName}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentEvent?.errors?.length > 0 && (
        <div className={styles.liveErrors}>
          {currentEvent.errors.slice(-1).map((err, i) => (
            <div key={i} className={styles.liveErrorItem}>
              ⚠ {err}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    const successCount = uploadResults.filter(r => r.status === 'success').length;
    const failedCount = uploadResults.length - successCount;
    const isTotalSuccess = failedCount === 0;

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsSummaryCard}>
          <div className={`${styles.summaryIcon} ${isTotalSuccess ? styles.successIconBg : styles.warningIconBg}`}>
            {isTotalSuccess ? <FiCheckCircle size={24} /> : <FiAlertTriangle size={24} />}
          </div>
          <div className={styles.summaryTextContent}>
            <h2>{isTotalSuccess ? 'Загрузка успешно завершена' : 'Загрузка завершена с замечаниями'}</h2>
            <p className={styles.summaryDescription}>
              {successCount} {successCount === 1 ? 'файл обработан' : 'файлов обработано'} успешно
              {failedCount > 0 && `, ${failedCount} ${failedCount === 1 ? 'загружен' : 'загружено'} с ошибками`}
            </p>
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>{successCount}</span>
              <span className={styles.miniStatLabel}>Успешно</span>
            </div>
            <div className={styles.miniStat}>
              <span className={`${styles.miniStatValue} ${failedCount > 0 ? styles.errorText : ''}`}>{failedCount}</span>
              <span className={styles.miniStatLabel}>Ошибки</span>
            </div>
          </div>
        </div>

        <div className={styles.resultsList}>
          {uploadResults.map((result, index) => (
            <div key={index} className={`${styles.resultItem} ${result.status === 'success' ? styles.resultSuccess : styles.resultError}`}>
              <div className={styles.fileInfo}>
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
                        ? 'Этот файл уже был загружен ранее'
                        : 'Произошла непредвиденная ошибка при обработке'}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.statusBadgeWrapper}>
                {result.status === 'success' ? (
                  <span className={styles.badgeSuccess}>Готово</span>
                ) : (
                  <span className={styles.badgeError}>Ошибка</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.resultsFooter}>
          <button 
            className={styles.secondaryButton}
            onClick={handleReset}
          >
            <FiRotateCcw />
            Загрузить еще файлы
          </button>
          <button 
            className={styles.primaryButton}
            onClick={goToHome}
          >
            <FiHome />
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  };

  const renderError = () => (
    <div className={styles.errorContainer}>
      <h3>Произошла ошибка при загрузке</h3>
      <p>Не удалось установить соединение с сервером для отслеживания прогресса.</p>
      <button className={styles.actionButton} onClick={handleReset}>
        Попробовать снова
      </button>
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
          : uploadStatus === 'error'
          ? renderError()
          : renderUploadInterface()}
      </div>
    </div>
  );
};

export default UploadPage;
// === End of file ===