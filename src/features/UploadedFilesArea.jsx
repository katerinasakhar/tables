import React, { useState, useEffect, useMemo } from 'react';
import styles from './UploadedFilesArea.module.css';
import Modal from './Modal';
import { FiFile, FiCalendar, FiSearch, FiX } from 'react-icons/fi';

const UploadedFilesArea = () => {
  const [files, setFiles] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [deletingFilename, setDeletingFilename] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const api = process.env.API;
        const response = await fetch(`${api}/api/v2/files?limit=10000`);
        if (!response.ok) throw new Error('Ошибка сети');

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Сервер вернул не JSON');
        }

        const data = await response.json();
        setFiles(data || []);
      } catch (error) {
        console.error('Ошибка при получении списка файлов:', error.message);
        setFiles([]);
      }
    };

    fetchFiles();
  }, []);

  const successfulFiles = useMemo(() => files.filter(f => f.status === 'success'), [files]);
  const failedFiles = useMemo(() => files.filter(f => ['failed', 'duplicate'].includes(f.status)), [files]);
  const hasErrors = failedFiles.length > 0;

  const years = useMemo(() => [...new Set(successfulFiles.map(f => f.year))].sort((a, b) => b - a), [successfulFiles]);

  const filteredFiles = useMemo(() => {
    let result = successfulFiles.filter(file => file.filename.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedYear) {
      result = result.filter(file => file.year === Number(selectedYear));
    }
    return result;
  }, [successfulFiles, searchTerm, selectedYear]);

  const handleResolveError = (filename) => {
    const confirmed = window.confirm('Убедитесь, что вы устранили ошибку, прежде чем её удалять');
    if (!confirmed) return;
    setDeletingFilename(filename);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.successSection}>
          <div className={styles.sectionHeader}>
            <h3><FiFile className={styles.icon} />Загруженные файлы</h3>
            {successfulFiles.length > 10 && (
              <button className={styles.viewAllButton} onClick={() => setModalActive(true)}>
                Показать все ({successfulFiles.length})
              </button>
            )}
          </div>

          <ul className={styles.fileList}>
            {successfulFiles.slice(0, 10).map(file => (
              <li key={file.filename} className={styles.fileItem}>
                <span className={styles.filename}>{file.filename}</span>
                <span className={styles.fileMeta}><FiCalendar className={styles.metaIcon} />{file.year} • {file.status}</span>
              </li>
            ))}
            {successfulFiles.length === 0 && <li className={styles.empty}>Нет загруженных файлов</li>}
          </ul>
        </div>

        <div className={styles.errorSection}>
          <div className={styles.sectionHeader}>
            <h3><FiFile className={styles.icon} />Файлы с ошибками</h3>
          </div>
          {hasErrors ? (
            <>
              <p className={styles.warningText}>Не забудьте загрузить файлы, в которых были ошибки. Иначе ваш отчет может быть неточным.</p>
              <ul className={styles.errorFileList}>
                {failedFiles.map(file => (
                  <li
                    key={file.filename}
                    className={`${styles.errorFileItem} ${deletingFilename === file.filename ? styles.fadeOut : ''}`}
                    onTransitionEnd={() => {
                      if (deletingFilename === file.filename) {
                        setFiles(prev => prev.filter(f => f.filename !== file.filename));
                        setDeletingFilename(null);
                      }
                    }}
                  >
                    <div className={styles.errorFileContent}>
                      <div className={styles.errorFileHeader}>
                        <span className={styles.errorFileName}>{file.filename}</span>
                        <span className={styles.errorFileMeta}>{file.year} • {file.status} • {new Date(file.upload_timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.errorTextContainer}>
                        <div className={styles.errorText}>{file.error || 'Неизвестная ошибка'}</div>
                      </div>
                    </div>
                    <button
                      className={styles.resolveButton}
                      onClick={() => handleResolveError(file.filename)}
                      disabled={deletingFilename === file.filename}
                    >
                      Ошибка устранена
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : <p className={styles.noErrorsMessage}>Все файлы загружены без ошибок</p>}
        </div>
      </div>

      {modalActive && (
        <Modal active={modalActive} setActive={setModalActive}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Все загруженные файлы</h3>
              <button className={styles.closeButton} onClick={() => setModalActive(false)}>
                <FiX size={24} />
              </button>
            </div>
            <div className={styles.modalInfo}>
              <p className={styles.fileCount}>Найдено: <strong>{filteredFiles.length}</strong> файлов</p>
            </div>
            <div className={styles.modalFilters}>
              <div className={styles.searchContainer}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Поиск по названию"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.selectContainer}>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={styles.yearSelect}
                >
                  <option value="">Все годы</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFileList}>
              {filteredFiles.length > 0 ? (
                filteredFiles.map(file => (
                  <div key={file.filename} className={styles.modalFileItem}>
                    <span className={styles.modalFilename}>{file.filename}</span>
                    <span className={styles.modalFileMeta}>{file.year} • {file.status} • {new Date(file.upload_timestamp).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div className={styles.modalEmpty}>Файлы не найдены</div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UploadedFilesArea;