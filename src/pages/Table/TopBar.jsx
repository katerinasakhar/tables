// === File: pages/Table/TopBar.jsx ===
import { FiDownload, FiHome } from 'react-icons/fi';
import style from './Table.module.css';

function TopBar({ goToHome, downloadCSV, downloadXLS, isEmpty, setFormSelectModal }) {
  return (
    <div className={style.topBar}>
      <button className={style.homeButton} onClick={goToHome} aria-label="Главная">
        <FiHome className={style.homeIcon} />
        Главное меню
      </button>
      
      <div className={style.titleContainer}>
        <h2>Таблица данных</h2>
        <p className={style.subtitle}>
          {isEmpty 
            ? 'Нет данных для отображения' 
            : 'Настройте фильтры и получите любой срез данных'}
        </p>
      </div>
      
      {!isEmpty && (
        <div className={style.downloadButtons}>
          <button 
            className={`${style.downloadButton} ${style.csvButton}`} 
            onClick={downloadCSV} 
            aria-label="Скачать CSV"
          >
            <FiDownload />
            CSV
          </button>
          <button 
            className={`${style.downloadButton} ${style.xlsButton}`} 
            onClick={downloadXLS} 
            aria-label="Скачать XLS"
          >
            <FiDownload />
            XLS
          </button>
        </div>
      )}
    </div>
  );
}

export default TopBar;