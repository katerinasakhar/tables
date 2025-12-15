import componentStyles from './TableModalComponents.module.css';
import { FiSearch } from 'react-icons/fi';

function FilterList({
    filter,
  cities, years, sections, rows, columns,
  selectedCities, selectedYears, selectedSections, selectedRows, selectedColumns,
  setSelectedCities, setSelectedYears, setSelectedSections, setSelectedRows, setSelectedColumns,
  searchCity, setSearchCity, searchRow, setSearchRow, searchColumn, setSearchColumn
}){
    
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

  return [1, 2, 3, 4, 5].includes(filter) ? (
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
                ) : null;
}
export default FilterList