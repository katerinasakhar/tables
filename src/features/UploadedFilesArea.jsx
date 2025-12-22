// === File: features/UploadedFilesArea.jsx ===
import React, { useState, useEffect, useMemo } from 'react';
import styles from './UploadedFilesArea.module.css';
import Modal from './Modal';
import { FiFile, FiCalendar, FiSearch, FiX } from 'react-icons/fi';

const UploadedFilesArea = ({ selectedForm }) => {
    const [files, setFiles] = useState([]);
    const [modalActive, setModalActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [deletingFilename, setDeletingFilename] = useState(null);
    const [deletingFileId, setDeletingFileId] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const api = process.env.API;
                const response = await fetch(`${api}/api/v2/files?form_id=${selectedForm}&limit=10000`);
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
        
        if (selectedForm) {
            fetchFiles();
        }
    }, [selectedForm]);

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

    const handleResolveError = async (file_id, filename, confirmMessage = 'Убедитесь, что вы устранили ошибку, прежде чем её удалять') => {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;
        setDeletingFilename(filename);
        setDeletingFileId(file_id);
        
        try {
            const api = process.env.API;
            const response = await fetch(`${api}/api/v2/files/${encodeURIComponent(file_id)}?form_id=${selectedForm}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Ошибка при удалении файла: ${response.status}`);
            }
            setFiles(prev => prev.filter(f => f.file_id !== file_id));
        } catch (error) {
            console.error('Ошибка удаления файла:', error.message);
        } finally {
            setDeletingFilename(null);
            setDeletingFileId(null);
        }
    };

    return (
        <div className={styles.wrapper}>
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
                            <li key={file.file_id} className={styles.fileItem}>
                                <span className={styles.filename}>{file.filename}</span>
                                <span className={styles.fileMeta}><FiCalendar className={styles.metaIcon} />{new Date(file.upload_timestamp).toLocaleDateString()} • {file.status}</span>
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
                            <p className={styles.warningText}>Не забудьте повторно загрузить файлы, в которых были ошибки. Иначе ваш отчет может быть неточным.</p>
                            <ul className={styles.errorFileList}>
                                {failedFiles.map(file => (
                                    <li
                                        key={file.file_id}
                                        className={`${styles.errorFileItem} ${deletingFileId === file.file_id ? styles.fadeOut : ''}`}
                                        onTransitionEnd={() => {
                                            if (deletingFileId === file.file_id) {
                                                setFiles(prev => prev.filter(f => f.file_id !== file.file_id));
                                                setDeletingFilename(null);
                                                setDeletingFileId(null);
                                            }
                                        }}
                                    >
                                        <div className={styles.errorFileContent}>
                                            <div className={styles.errorFileHeader}>
                                                <span className={styles.errorFileName}>{file.filename}</span>
                                                <span className={styles.errorFileMeta}>{new Date(file.upload_timestamp).toLocaleDateString()} • {file.status}  </span>
                                            </div>
                                            <div className={styles.errorTextContainer}>
                                                <div className={styles.errorText}>{file.error || 'Неизвестная ошибка'}</div>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.resolveButton}
                                            onClick={() => handleResolveError(file.file_id, file.filename)}
                                            disabled={deletingFileId === file.file_id}
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
                    <div className={styles.modalOverlay}>
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
                                        <option value="">Все года</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                           <div className={styles.modalFileList}>
  {filteredFiles.length > 0 ? (
    filteredFiles.map(file => (
      <div
        key={file.file_id}
        className={`${styles.modalFileItem} ${deletingFileId === file.file_id ? styles.fadeOut : ''}`}
        onTransitionEnd={() => {
          if (deletingFileId === file.file_id) {
            setFiles(prev => prev.filter(f => f.file_id !== file.file_id));
            setDeletingFilename(null);
            setDeletingFileId(null);
          }
        }}
      >
        <div className={styles.modalFileInfo}>
          <span className={styles.modalFilename}>{file.filename}</span>
          <span className={styles.modalFileMeta}>
            Загружено {new Date(file.upload_timestamp).toLocaleDateString()} • {file.status}  
          </span>
        </div>
        <button
          className={styles.deleteButton}
          onClick={() => handleResolveError(file.file_id, file.filename, 'Вы уверены, что хотите навсегда удалить файл этот файл?')}
          disabled={deletingFileId === file.file_id}
        >
          <FiX size={18} />
        </button>
      </div>
    ))
  ) : (
    <div className={styles.modalEmpty}>Файлы не найдены</div>
  )}
</div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UploadedFilesArea;
// === End of file ===