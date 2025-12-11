import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import Modal from '../../features/Modal'; //added
import * as XLSX from 'xlsx';
import componentStyles from './TableModalComponents.module.css'; //added //added
import style from './Table.module.css'
import { FiDownload, FiHome } from 'react-icons/fi'; //added 
import FiFilter from 'react-icons/fi'
import { FiArrowLeft, FiSearch } from 'react-icons/fi'; //added
function Table() {
  const api = process.env.API

  const [searchRow, setSearchRow] = useState(''); //added
  const [searchCity, setSearchCity] = useState(''); //added
  const [searchColumn, setSearchColumn] = useState(''); //added
  const [thead, setThead] = useState([]); //added
  const [strings, setStrings] = useState([]) //added
  const [modalActive, setModalActive] = useState(false) //added
  const [filter, setFilter] = useState(0) //added
  const [sections, setSections] = useState([]) //added
  const [selectedSections, setSelectedSections] = useState([]); //added
  const [years, setYears] = useState([]); //added
  const [selectedYears, setSelectedYears] = useState([]); //added
  const [cities, setCities] = useState([]); //added
  const [selectedCities, setSelectedCities] = useState([]); //added
  const [rows, setRows] = useState([]); //added
  const [columns, setColumns] = useState([]); //added
  const [selectedRows, setSelectedRows] = useState([]); //added
  const [selectedColumns, setSelectedColumns] = useState([]); //added
  const offset=useRef(0); //added
  const maxSize=useRef(0) //added
  const limit = useRef(10); //added
  const [loadingMoreData, setLoadingMoreData] = useState(false); //added
  const [dfilter, setDfilter] = useState({ //added
    "filters": [],
    "limit": limit.current,
    "offset": 0
  }) 
  const [hasMore, setHasMore] = useState(true); //added
  const [appliedFilters, setAppliedFilters] = useState({ //added
    cities: [],
    years: [],
    sections: [],
    rows: [],
    columns: []
  });
//added
  useEffect(() => {
    axios.post(`${api}/api/v2/filtered-data`, dfilter).then((response) => {
      const newData = response.data.data || [];
      if (offset.current == 0) {
        setStrings(newData || [])
      }
      else {
        setStrings(prevStrings => [...prevStrings, ...newData]);
      }
      setThead(response.data.headers || []);
      if (newData.length < limit.current || offset.current + limit.current >= response.data.max_size) {
        setHasMore(false);
      }
      setLoadingMoreData(false)
      maxSize.current=response.data.max_size
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });
  }, [dfilter]);
  //added
  const loadMore = () => {
    setLoadingMoreData(true)
    offset.current=offset.current + limit.current
    setDfilter({
      ...dfilter,
      offset: offset.current
    })
  }

//ADDED
  function downloadXLS(){
    const filters={
      ...dfilter,
      offset:0,
      limit:maxSize.current
    }
    axios.post(`${api}/api/v2/filtered-data`, filters).then((response)=>{
      const data=response.data.data
      const headers=response.data.headers
      const jsonData = data.map((row) =>
      Object.fromEntries(headers.map((key, index) => [key, row[index]]))
    );
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблица');
    XLSX.writeFile(workbook, "table.xlsx");
  }
    ).catch((error)=>{console.error(error)})
  }
//ADDED
    function downloadCSV(){ 
    const filters={
      ...dfilter,
      offset:0,
      limit:maxSize.current
    }
    axios.post(`${api}/api/v2/filtered-data`, filters).then((response)=>{
      const data=response.data.data
      const headers=response.data.headers
      const jsonData = data.map((row) =>
      Object.fromEntries(headers.map((key, index) => [key, row[index]]))
    );
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' });
    const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'table.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
    ).catch((error)=>{console.error(error)})
  }

  const handleCityChange = (e) => {
    const value = e.target.value;

    if (selectedCities.includes(value)) {
      setSelectedCities(selectedCities.filter((city) => city !== value));
    } else {
      setSelectedCities([...selectedCities, value]);
    }

  };

  const handleYearChange = (e) => {
    const value = parseInt(e.target.value);

    if (selectedYears.includes(value)) {
      setSelectedYears(selectedYears.filter((year) => year !== value));
    } else {
      setSelectedYears([...selectedYears, value]);
    }
  }

  const handleSectionChange = (e) => {
    const value = e.target.value;

    if (selectedSections.includes(value)) {
      setSelectedSections(selectedSections.filter((section) => section != value));
    } else {

      setSelectedSections([...selectedSections, value]);
    }

  };

  const handleRowChange = (e) => {
    const value = e.target.value;

    if (selectedRows.includes(value)) {
      setSelectedRows(selectedRows.filter((row) => row !== value));
    } else {
      setSelectedRows([...selectedRows, value]);
    }

  };
  const handleColumnChange = (e) => {
    const value = e.target.value;

    if (selectedColumns.includes(value)) {
      setSelectedColumns(selectedColumns.filter((column) => column !== value));
    } else {
      setSelectedColumns([...selectedColumns, value]);
    }

  };
  function handleSelectAllCities() {
    if (selectedCities.length === cities.length) {
      setSelectedCities([])
    }
    else {
      setSelectedCities(cities)
    }
  }
  function handleSelectAllRows() {
    if (selectedRows.length === rows.length) {
      setSelectedRows([])
    }
    else {
      setSelectedRows(rows)
    }
  }
  function handleSelectAllColumns() {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([])
    }
    else {
      setSelectedColumns(columns)
    }
  }
  function handleSelectAllYears() {
    if (selectedYears.length === years.length) {
      setSelectedYears([])
    }
    else {
      setSelectedYears(years)
    }
  }
  function handleSelectAllSections() {
    if (selectedSections.length === sections.length) {
      setSelectedSections([])
    }
    else {
      setSelectedSections(sections)
    }
  }
  function handleSortedArray(filter, array) {
    switch (filter) {
      case 1:
        return [
          ...array.filter(city => selectedCities.includes(city.toString())),
          ...array.filter(city => !selectedCities.includes(city.toString())),
        ]
      case 2:
        return [
          ...array.filter(year => selectedYears.includes(year)),
          ...array.filter(year => !selectedYears.includes(year)),
        ]
      case 3:
        return [
          ...array.filter(section => selectedSections.includes(section.toString())),
          ...array.filter(section => !selectedSections.includes(section.toString())),
        ]
      case 4:
        return [
          ...array.filter(row => selectedRows.includes(row.toString())),
          ...array.filter(row => !selectedRows.includes(row.toString())),
        ]
      case 5:
        return [
          ...array.filter(column => selectedColumns.includes(column.toString())),
          ...array.filter(column => !selectedColumns.includes(column.toString())),
        ]
    }

  }
  //added
  function showYears() {
    axios.post(`${api}/api/v2/filter-values`, {
      "filter-name": "год",
      "filters": [
        {
          "filter-name": "город",
          "values": selectedCities
        },
        {
          "filter-name": "раздел",
          "values": selectedSections
        },
        {
          "filter-name": "строка",
          "values": selectedRows
        },
        {
          "filter-name": "колонка",
          "values": selectedColumns
        }
      ]
    }).then((response) => {
      const values = response.data.values;
      console.log(1)
      const sortedValues = handleSortedArray(2, values)
      setYears(sortedValues)
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    })
  }
//added
  function showCities() {
    axios.post(`${api}/api/v2/filter-values`, {
      "filter-name": "город",
      "filters": [
        {
          "filter-name": "год",
          "values": selectedYears
        },
        {
          "filter-name": "раздел",
          "values": selectedSections
        },
        {
          "filter-name": "строка",
          "values": selectedRows
        },
        {
          "filter-name": "колонка",
          "values": selectedColumns
        }
      ]
    }).then((response) => {
      const values = response.data.values;
      const sortedValues = handleSortedArray(1, values)
      setCities(sortedValues)
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    })
  }
  //added
  function showSections() {
    axios.post(`${api}/api/v2/filter-values`, {
      "filter-name": "раздел",
      "filters": [
        {
          "filter-name": "год",
          "values": selectedYears
        },
        {
          "filter-name": "город",
          "values": selectedCities
        },
        {
          "filter-name": "строка",
          "values": selectedRows
        },
        {
          "filter-name": "колонка",
          "values": selectedColumns
        }
      ]
    }).then((response) => {
      const values = response.data.values;
      const sortedValues = handleSortedArray(3, values)
      setSections(sortedValues)
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    })

  }
//added
  function showRows() {
    axios.post(`${api}/api/v2/filter-values`, {
      "filter-name": "строка",
      "filters": [
        {
          "filter-name": "год",
          "values": selectedYears
        },
        {
          "filter-name": "город",
          "values": selectedCities
        },
        {
          "filter-name": "раздел",
          "values": selectedSections
        },
        {
          "filter-name": "колонка",
          "values": selectedColumns
        }
      ]
    }).then((response) => {
      const values = response.data.values;
      const sortedValues = handleSortedArray(4, values)
      setRows(sortedValues)
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    })
  }
//added
  function showColumns() {
    axios.post(`${api}/api/v2/filter-values`, {
      "filter-name": "колонка",
      "filters": [
        {
          "filter-name": "год",
          "values": selectedYears
        },
        {
          "filter-name": "город",
          "values": selectedCities
        },
        {
          "filter-name": "раздел",
          "values": selectedSections
        },
        {
          "filter-name": "строка",
          "values": selectedRows
        }

      ]
    }).then((response) => {
      const values = response.data.values;
      const sortedValues = handleSortedArray(5, values)
      setColumns(sortedValues)
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    })
  }
//added
  function handleFilteredData() {
    offset.current=0
    setStrings([])
    setDfilter({
      "filters": [
        {
          "filter-name": "год",
          "values": selectedYears
        },
        {
          "filter-name": "город",
          "values": selectedCities
        },
        {
          "filter-name": "раздел",
          "values": selectedSections
        },
        {
          "filter-name": "строка",
          "values": selectedRows
        },
        {
          "filter-name": "колонка",
          "values": selectedColumns
        }
      ],
      "limit": limit.current,
      "offset": offset.current
    })
    setAppliedFilters({
      cities: [...selectedCities],
      years: [...selectedYears],
      sections: [...selectedSections],
      rows: [...selectedRows],
      columns: [...selectedColumns]
    });
    setModalActive(false)
  }
  //added
  const goToHome = () => {
    window.location.href = '/';
  };

  const isLoading = strings.length === 0;

  return (

    <div className={style.tableWrapper}>
      
      {/* added */}
      <div className={style.topBar}>
        <button className={style.homeButton} onClick={goToHome} aria-label="Главная">
          <FiHome className={style.homeIcon} />
          Главное меню
        </button>

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
      </div>

      {/* Панель фильтров */}
      {!isLoading && (
        <div className={style.filterBar}>
          <button className={style.filterButton} onClick={() => setModalActive(true)}>
            <FiFilter />
            Фильтры
          </button>
        </div>
      )}
      {/* added */}
      {/* Применённые фильтры */}
     
      {(appliedFilters.cities.length > 0 ||
        appliedFilters.years.length > 0 ||
        appliedFilters.sections.length > 0 ||
        appliedFilters.rows.length > 0 ||
        appliedFilters.columns.length > 0) && (
          <div className={componentStyles.activeFilters}>
            <h4>Применённые фильтры:</h4>
            <ul className={componentStyles.filtersList}>
              {appliedFilters.cities.length > 0 && (
                <li className={componentStyles.filterTag} onClick={() => { setFilter(1); showCities(); setModalActive(true); }}>
                  <strong>Города:</strong> {appliedFilters.cities.join(', ')}

                </li>
              )}
              {appliedFilters.years.length > 0 && (
                <li className={componentStyles.filterTag} onClick={() => { setFilter(2); showYears(); setModalActive(true); }}>
                  <strong>Год:</strong> {appliedFilters.years.join(', ')}

                </li>
              )}
              {appliedFilters.sections.length > 0 && (
                <li className={componentStyles.filterTag} onClick={() => { setFilter(3); showSections(); setModalActive(true); }}>
                  <strong>Раздел:</strong> {appliedFilters.sections.join(', ')}

                </li>
              )}
              {appliedFilters.rows.length > 0 && (
                <li className={componentStyles.filterTag} onClick={() => { setFilter(4); showRows(); setModalActive(true); }}>
                  <strong>Строка:</strong> {appliedFilters.rows.join(', ')}

                </li>
              )}
              {appliedFilters.columns.length > 0 && (
                <li className={componentStyles.filterTag} onClick={() => { setFilter(5); showColumns(); setModalActive(true); }}>
                  <strong>Столбец:</strong> {appliedFilters.columns.join(', ')}

                </li>
              )}
            </ul>
          </div>
        )}

      {/* Индикация загрузки или таблица */}
      {isLoading ? (
        <div className={style.loadingOverlay}>
          <div className={style.spinner}></div>
          <p>Загрузка данных...</p>
        </div>
      ) : (
        <>
          {/* Таблица */}
          {/* added */}
          <div className={style.tableContainer}>
            <table className={style.modernTable}>
              <thead>
                <tr>
                  {thead.map((head) => (
                    <th key={head}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {strings.length > 0 ? (
                  strings.map((string) => (
                    <tr key={string.id}>
                      {string.map((cell, idx) => (
                        <td key={idx}>{cell}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={thead.length} className={style.emptyData}>
                      Нет данных
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Кнопка "Показать ещё" */}
          {/* added*/}
          {hasMore && (
            <div className={style.centeredFooter}>
              <button
                className={style.showMoreButton}
                onClick={loadMore}
                disabled={loadingMoreData}
              >
                {loadingMoreData ? 'Загрузка...' : 'Показать ещё'}
              </button>
            </div>
          )}
        </>
      )}



{/* added */}

      <Modal active={modalActive} setActive={setModalActive}>
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
                {['Города', 'Год', 'Раздел', 'Строка', 'Столбец'][filter - 1]}
              </div>
            )}
          </div>

          {/* Содержимое */}
          <div className={componentStyles.modalBody}>
            {filter === 0 && (
              <div className={componentStyles.filters}>
                <h2>Фильтры</h2>
                <button onClick={() => { setCities([]); showCities(); setFilter(1) }}>Города</button>
                <button onClick={() => { setYears([]); showYears(); setFilter(2) }}>Года</button>
                <button onClick={() => { setSections([]); showSections(); setFilter(3) }}>Разделы</button>
                <button onClick={() => { setRows([]); showRows(); setFilter(4) }}>Строки</button>
                <button onClick={() => { setColumns([]); showColumns(); setFilter(5) }}>Столбцы</button>
              </div>
            )}

            {[1, 2, 3, 4, 5].includes(filter) && (
              <div>
                {/* Поиск */}
                {(filter === 1 || filter === 4 || filter === 5) && (
                  <div className={componentStyles.searchContainer}>
                    <div className={componentStyles.searchInput}>
                      <FiSearch size={16} color="#888" />
                      <input
                        type="text"
                        placeholder="Поиск..."
                        value={{ 1: searchCity, 4: searchRow, 5: searchColumn }[filter]}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (filter === 1) setSearchCity(value);
                          if (filter === 4) setSearchRow(value);
                          if (filter === 5) setSearchColumn(value);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Кнопка "выбрать все" */}
                <div className={componentStyles.checkboxWrapper}>
                  <label>
                    <input
                      type="checkbox"
                      className={componentStyles.input}
                      checked={{
                        1: selectedCities.length === cities.length,
                        2: selectedYears.length === years.length,
                        3: selectedSections.length === sections.length,
                        4: selectedRows.length === rows.length,
                        5: selectedColumns.length === columns.length
                      }[filter]}
                      onChange={{
                        1: handleSelectAllCities,
                        2: handleSelectAllYears,
                        3: handleSelectAllSections,
                        4: handleSelectAllRows,
                        5: handleSelectAllColumns
                      }[filter]}
                    />
                    {{
                      1: selectedCities.length === cities.length,
                      2: selectedYears.length === years.length,
                      3: selectedSections.length === sections.length,
                      4: selectedRows.length === rows.length,
                      5: selectedColumns.length === columns.length
                    }[filter] ? 'Снять все' : 'Выбрать все'}
                  </label>
                </div>

                {/* Список */}
                <div className={componentStyles.scroll}>
                  {{
                    1: cities.filter(city => city.toString().toLowerCase().includes(searchCity.toLowerCase())).map((city) => (
                      <div key={city} className={componentStyles.item}>
                        <label>
                          <input
                            type="checkbox"
                            value={city}
                            checked={selectedCities.includes(city.toString())}
                            onChange={handleCityChange}
                          />
                          {city}
                        </label>
                      </div>
                    )),
                    2: years.map((year) => (
                      <div key={year} className={componentStyles.item}>
                        <label>
                          <input
                            type="checkbox"
                            value={year}
                            checked={selectedYears.includes(year)}
                            onChange={handleYearChange}
                          />
                          {year}
                        </label>
                      </div>
                    )),
                    3: sections.map((section) => (
                      <div key={section} className={componentStyles.item}>
                        <label>
                          <input
                            type="checkbox"
                            value={section}
                            checked={selectedSections.includes(section.toString())}
                            onChange={handleSectionChange}
                          />
                          {section}
                        </label>
                      </div>
                    )),
                    4: rows.filter(row => row.toString().toLowerCase().includes(searchRow.toLowerCase())).map((row) => (
                      <div key={row} className={componentStyles.item}>
                        <label>
                          <input
                            type="checkbox"
                            value={row}
                            checked={selectedRows.includes(row.toString())}
                            onChange={handleRowChange}
                          />
                          {row}
                        </label>
                      </div>
                    )),
                    5: columns.filter(col => col.toString().toLowerCase().includes(searchColumn.toLowerCase())).map((col) => (
                      <div key={col} className={componentStyles.item}>
                        <label>
                          <input
                            type="checkbox"
                            value={col}
                            checked={selectedColumns.includes(col.toString())}
                            onChange={handleColumnChange}
                          />
                          {col}
                        </label>
                      </div>
                    ))
                  }[filter]}
                </div>
              </div>
            )}
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

    </div>)
}

export default Table;
