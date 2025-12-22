import { FiHome } from 'react-icons/fi';
import style from './Table.module.css';

function TopBar({ goToHome, isEmpty, setFormSelectModal }) {
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
      {/* УБРАЛ КНОПКИ СКАЧИВАНИЯ ОТСЮДА - ОНИ ТЕПЕРЬ ТОЛЬКО В CONTROLS ROW */}
    </div>
  );
}

export default TopBar;