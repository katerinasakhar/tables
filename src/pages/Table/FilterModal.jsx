import { FiArrowLeft} from 'react-icons/fi';
import componentStyles from './TableModalComponents.module.css';
import FilterList from './FilterList';
import Modal from '../../features/Modal';

function FilterModal ({
    active,
  setActive,
  filter,
  setFilter,
  cities, years, sections, rows, columns,
  selectedCities, selectedYears, selectedSections, selectedRows, selectedColumns,
  setSelectedCities, setSelectedYears, setSelectedSections, setSelectedRows, setSelectedColumns,
  searchCity, setSearchCity, searchRow, setSearchRow, searchColumn, setSearchColumn,
  handleFilteredData, showCities, showYears, showSections, showRows, showColumns,setCities,setYears,setSections,setColumns,setRows}){
    return(
        <Modal active={active} setActive={setActive}>
        <div className={componentStyles.content}>

          {/* Верхняя панель */}
          <div className={componentStyles.headerBar}>
            {filter !== 0 && (
              <button className={componentStyles.backButton} onClick={() => setFilter(0)}>
                <FiArrowLeft /> Назад
              </button>
            )}
            {filter !== 0 && (
              <div className={componentStyles.modalTitle}>
                {['Субъекты', 'Год', 'Раздел', 'Строка', 'Столбец'][filter - 1]}
              </div>
            )}
          </div>

          {/* Содержимое */}
          <div className={componentStyles.modalBody}>
            {filter === 0 ? (
              <div className={componentStyles.filters}>
                <h2>Фильтры</h2>
                <button onClick={() => { setCities([]); showCities(); setFilter(1) }}>Субъекты</button>
                <button onClick={() => { setYears([]); showYears(); setFilter(2) }}>Года</button>
                <button onClick={() => { setSections([]); showSections(); setFilter(3) }}>Разделы</button>
                <button onClick={() => { setRows([]); showRows(); setFilter(4) }}>Строки</button>
                <button onClick={() => { setColumns([]); showColumns(); setFilter(5) }}>Столбцы</button>
              </div>
            ) : (<FilterList
              filter={filter}
              cities={cities} years={years} sections={sections} rows={rows} columns={columns}
              selectedCities={selectedCities} selectedYears={selectedYears} selectedSections={selectedSections}
              selectedRows={selectedRows} selectedColumns={selectedColumns}
              setSelectedCities={setSelectedCities} setSelectedYears={setSelectedYears} setSelectedSections={setSelectedSections}
              setSelectedRows={setSelectedRows} setSelectedColumns={setSelectedColumns}
              searchCity={searchCity} setSearchCity={setSearchCity}
              searchRow={searchRow} setSearchRow={setSearchRow}
              searchColumn={searchColumn} setSearchColumn={setSearchColumn}
            />)}
          </div>

          {/* Нижняя панель */}
          {filter !== 0 && (
            <div className={componentStyles.footerBar}>
              <button className={componentStyles.applyButton} onClick={() => { handleFilteredData(); setFilter(0); }}>
                Применить
              </button>
            </div>
          )}
        </div>
      </Modal>
    )
}

export default FilterModal