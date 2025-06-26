import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../features/Modal';
import * as XLSX from 'xlsx';
import componentStyles from './TableModalComponents.module.css';
import style from './Table.module.css'
import { FiDownload, FiFilter, FiHome } from 'react-icons/fi';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
function Table() {
  const api = process.env.API

  const [searchRow, setSearchRow] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [thead, setThead] = useState([]);
  const [strings, setStrings] = useState([])
  const [modalActive, setModalActive] = useState(false)
  const [filter, setFilter] = useState(0)

  const [sections, setSections] = useState([])
  const [selectedSections, setSelectedSections] = useState([]);
  const [years, setYears] = useState([2022, 2023]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const [dfilter, setDfilter] = useState({
    "filters": [],
    "limit": limit,
    "offset": 0
  })
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({
    cities: [],
    years: [],
    sections: [],
    rows: [],
    columns: []
  });

  useEffect(() => {
    axios.post(`${api}/api/v2/filtered-data`, dfilter).then((response) => {
      const newData = response.data.data || [];
      if (offset == 0) {
        setStrings(newData || [])
      }
      else {

        setStrings(prevStrings => [...prevStrings, ...newData]);
      }
      setThead(response.data.headers || []);
      if (newData.length < limit || offset + limit >= response.data.max_size) {
        setHasMore(false);
      }
      setLoadingMoreData(false)
    }).catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });
  }, [dfilter]);
  const loadMore = () => {
    setLoadingMoreData(true)
    setOffset(offset + limit);
    setDfilter({
      ...dfilter,
      offset: offset
    })
  }
  const exportToExcel = () => {
    const wsData = [thead, ...strings];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Таблица");
    XLSX.writeFile(wb, "table.xlsx");
  };

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

  function handleFilteredData() {
    setOffset(0);
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
      "limit": limit,
      "offset": offset
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

  const goToHome = () => {
    window.location.href = '/';
  };

  const isLoading = strings.length === 0;

  return (

    <div className={style.tableWrapper}>
      {/* Верхняя панель */}
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
          <button className={style.downloadButton} onClick={exportToExcel} aria-label="Скачать">
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
      {/* Применённые фильтры */}
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
