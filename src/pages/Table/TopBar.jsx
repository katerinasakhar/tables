import { FiDownload, FiHome } from 'react-icons/fi';
import style from './Table.module.css'

function TopBar({goToHome,downloadCSV,isLoading,forms,setCurrentForm}){
    return(<div className={style.topBar}>
            <button className={style.homeButton} onClick={goToHome} aria-label="Главная">
              <FiHome className={style.homeIcon} />
              Главное меню
            </button>
            <select name="form" onChange={(e)=>{setCurrentForm(e.target.value)}}>
              {forms.map((form)=>(<option value={form}>{form}</option>))}
            </select>
    
            <div className={style.titleContainer}>
              <h2>Таблица данных</h2>
              <p className={style.subtitle}>Настройте фильтры и получите любой срез данных</p>
            </div>
    
            {!isLoading && (
              <button className={style.downloadButton} onClick={downloadCSV} aria-label="Скачать">
                <FiDownload />
                Скачать
              </button>
            )}
          </div>)
}
export default TopBar