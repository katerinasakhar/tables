import componentStyles from './TableModalComponents.module.css';
import { FiSearch } from 'react-icons/fi';
import { memo, useMemo, useCallback, useTransition } from 'react';

const FilterCheckbox = memo(({ item, isSelected, onChange }) => (
  <div className={componentStyles.item}>
    <label>
      <input
        type="checkbox"
        value={item}
        checked={isSelected}
        onChange={onChange}
      />
      {item}
    </label>
  </div>
));

function FilterList({
    filter,
  cities, years, sections, rows, columns,
  selectedCities, selectedYears, selectedSections, selectedRows, selectedColumns,
  setSelectedCities, setSelectedYears, setSelectedSections, setSelectedRows, setSelectedColumns,
  searchCity, setSearchCity, searchRow, setSearchRow, searchColumn, setSearchColumn
}){

  const [isPending, startTransition] = useTransition();

  const selectedMap = useMemo(() => {
    const map = {};
    switch(filter) {
      case 1: selectedCities.forEach(c => map[c] = true); break;
      case 2: selectedYears.forEach(y => map[y] = true); break;
      case 3: selectedSections.forEach(s => map[s] = true); break;
      case 4: selectedRows.forEach(r => map[r] = true); break;
      case 5: selectedColumns.forEach(c => map[c] = true); break;
    }
    return map;
  }, [filter, selectedCities, selectedYears, selectedSections, selectedRows, selectedColumns]);

  const handleCityChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedCities(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  }, [setSelectedCities]);

  const handleYearChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    setSelectedYears(prev =>
      prev.includes(value)
        ? prev.filter(y => y !== value)
        : [...prev, value]
    );
  }, [setSelectedYears]);

  const handleSectionChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedSections(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  }, [setSelectedSections]);

  const handleRowChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedRows(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  }, [setSelectedRows]);

  const handleColumnChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedColumns(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  }, [setSelectedColumns]);
  const handleSelectAllCities = useCallback(() => {
    startTransition(() => {
      setSelectedCities(prev =>
        prev.length === cities.length ? [] : cities
      );
    });
  }, [cities, selectedCities.length, setSelectedCities]);

  const handleSelectAllRows = useCallback(() => {
    startTransition(() => {
      setSelectedRows(prev =>
        prev.length === rows.length ? [] : rows
      );
    });
  }, [rows, selectedRows.length, setSelectedRows]);

  const handleSelectAllColumns = useCallback(() => {
    startTransition(() => {
      setSelectedColumns(prev =>
        prev.length === columns.length ? [] : columns
      );
    });
  }, [columns, selectedColumns.length, setSelectedColumns]);

  const handleSelectAllYears = useCallback(() => {
    startTransition(() => {
      setSelectedYears(prev =>
        prev.length === years.length ? [] : years
      );
    });
  }, [years, selectedYears.length, setSelectedYears]);

  const handleSelectAllSections = useCallback(() => {
    startTransition(() => {
      setSelectedSections(prev =>
        prev.length === sections.length ? [] : sections
      );
    });
  }, [sections, selectedSections.length, setSelectedSections]);

  const filteredArray = useMemo(() => {
    const search = { 1: searchCity, 4: searchRow, 5: searchColumn }[filter] || '';
    const array = { 1: cities, 2: years, 3: sections, 4: rows, 5: columns }[filter] || [];

    if (!search) return array;
    return array.filter(item => item.toString().toLowerCase().includes(search.toLowerCase()));
  }, [filter, cities, years, sections, rows, columns, searchCity, searchRow, searchColumn]);

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
              value={{ 1: searchCity, 4: searchRow, 5: searchColumn }[filter] || ''}
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
        <label style={{ opacity: isPending ? 0.6 : 1 }}>
          <input
            type="checkbox"
            className={componentStyles.input}
            checked={{
              1: selectedCities.length === cities.length && cities.length > 0,
              2: selectedYears.length === years.length && years.length > 0,
              3: selectedSections.length === sections.length && sections.length > 0,
              4: selectedRows.length === rows.length && rows.length > 0,
              5: selectedColumns.length === columns.length && columns.length > 0
            }[filter]}
            onChange={{
              1: handleSelectAllCities,
              2: handleSelectAllYears,
              3: handleSelectAllSections,
              4: handleSelectAllRows,
              5: handleSelectAllColumns
            }[filter]}
            disabled={isPending}
          />
          {{
            1: selectedCities.length === cities.length && cities.length > 0,
            2: selectedYears.length === years.length && years.length > 0,
            3: selectedSections.length === sections.length && sections.length > 0,
            4: selectedRows.length === rows.length && rows.length > 0,
            5: selectedColumns.length === columns.length && columns.length > 0
          }[filter] ? 'Снять все' : 'Выбрать все'}
          {isPending && ' ...'}
        </label>
      </div>

      {/* Список */}
      <div className={componentStyles.scroll}>
        {filteredArray.map((item) => {
          const handlers = {
            1: handleCityChange,
            2: handleYearChange,
            3: handleSectionChange,
            4: handleRowChange,
            5: handleColumnChange
          };
          return (
            <FilterCheckbox
              key={item}
              item={item}
              isSelected={selectedMap[item] || false}
              onChange={handlers[filter]}
            />
          );
        })}
      </div>
    </div>
  ) : null;
}
export default FilterList