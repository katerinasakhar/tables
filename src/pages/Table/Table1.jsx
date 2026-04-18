import { useState, useEffect } from "react";
import { useTableData } from "./useTableData";
import TopBar from "./TopBar";
import AppliedFilters from "./AppliedFilters";
import DataTable from "./DataTable";
import FilterModal from "./FilterModal";
import * as XLSX from 'xlsx';
import style from './Table.module.css';
import axios from "axios";
import componentStyles from './TableModalComponents.module.css';
import { FiFilter, FiFileText, FiDownload } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { FiAlertTriangle,FiHome } from 'react-icons/fi';


function Table({ selectedForm, setFormSelectModal }) {
  const api = process.env.API;
  const limit = 10;
  const queryClient = useQueryClient();
  
  const {
    strings, thead, loadMore, hasMore, loadingMoreData, 
    getMaxSize, setDfilter, forms, currentForm, setCurrentForm,
    isLoading, isEmpty, hasError, errorMessage, refetch,
    isRefetching
  } = useTableData(api, limit, selectedForm);

  const [modalActive, setModalActive] = useState(false);
  const [filter, setFilter] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({
    cities: [],
    years: [],
    sections: [],
    rows: [],
    columns: []
  });
  
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  const [searchRow, setSearchRow] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [currentFormName, setCurrentFormName] = useState('');

  // Получение названия текущей формы
  useEffect(() => {
    const fetchCurrentFormName = async () => {
      if (!selectedForm || !api) return;
      
      try {
        const response = await fetch(`${api}/api/v2/forms/${selectedForm}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных формы');
        const form = await response.json();
        setCurrentFormName(form.name);
      } catch (error) {
        console.error('Ошибка при получении данных формы:', error);
        setCurrentFormName('Неизвестная форма');
      }
    };
    
    fetchCurrentFormName();
  }, [selectedForm, api]);

  const goToHome = () => {
    window.location.href = '/';
  };

  const downloadXLS = () => {
    if (isLoading || isEmpty) return;
    
    const maxSize = getMaxSize();
    const filter = [
      { "filter-name": "год", "values": selectedYears },
      { "filter-name": "субъект", "values": selectedCities },
      { "filter-name": "раздел", "values": selectedSections },
      { "filter-name": "строка", "values": selectedRows },
      { "filter-name": "колонка", "values": selectedColumns }
    ];
    
    const filters = { 
      filters: filter, 
      limit: maxSize.current, 
      offset: 0,
      form_id: selectedForm
    };
    
    axios.post(`${api}/api/v2/filtered-data?form_id=${selectedForm}`, filters)
      .then((response) => {
        const data = response.data.data;
        const headers = response.data.headers;
        
        const jsonData = data.map((row) =>
          Object.fromEntries(headers.map((key, index) => [key, row[index]]))
        );
        
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблица');
        XLSX.writeFile(workbook, "table.xlsx");
      })
      .catch((error) => { 
        console.error('Ошибка при скачивании XLS:', error);
        alert('Ошибка при скачивании файла');
      });
  };

  const downloadCSV = () => {
    if (isLoading || isEmpty) return;
    
    const maxSize = getMaxSize();
    const filter = [
      { "filter-name": "год", "values": selectedYears },
      { "filter-name": "субъект", "values": selectedCities },
      { "filter-name": "раздел", "values": selectedSections },
      { "filter-name": "строка", "values": selectedRows },
      { "filter-name": "колонка", "values": selectedColumns }
    ];
    
    const filters = { 
      filters: filter, 
      limit: maxSize.current, 
      offset: 0,
      form_id: selectedForm
    };
    
    axios.post(`${api}/api/v2/filtered-data?form_id=${selectedForm}`, filters)
      .then((response) => {
        const data = response.data.data;
        const headers = response.data.headers;
        
        const jsonData = data.map((row) =>
          Object.fromEntries(headers.map((key, index) => [key, row[index]]))
        );
        
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' });
        
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'table.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => { 
        console.error('Ошибка при скачивании CSV:', error);
        alert('Ошибка при скачивании файла');
      });
  };

  const handleFilteredData = () => {
    queryClient.setQueryData(['table-data', appliedFilters, currentForm, limit, selectedForm], {
      pages: [],
      pageParams: []
    });
    
    setDfilter([
      { "filter-name": "год", "values": selectedYears },
      { "filter-name": "субъект", "values": selectedCities },
      { "filter-name": "раздел", "values": selectedSections },
      { "filter-name": "строка", "values": selectedRows },
      { "filter-name": "колонка", "values": selectedColumns }
    ]);
    
    setAppliedFilters({
      cities: [...selectedCities],
      years: [...selectedYears],
      sections: [...selectedSections],
      rows: [...selectedRows],
      columns: [...selectedColumns]
    });
    
    setModalActive(false);
  };

  function handleSortedArray(filter, array) {
    switch (filter) {
      case 1:
        return [
          ...array.filter(city => selectedCities.includes(city.toString())),
          ...array.filter(city => !selectedCities.includes(city.toString())),
        ];
      case 2:
        return [
          ...array.filter(year => selectedYears.includes(year)),
          ...array.filter(year => !selectedYears.includes(year)),
        ];
      case 3:
        return [
          ...array.filter(section => selectedSections.includes(section.toString())),
          ...array.filter(section => !selectedSections.includes(section.toString())),
        ];
      case 4:
        return [
          ...array.filter(row => selectedRows.includes(row.toString())),
          ...array.filter(row => !selectedRows.includes(row.toString())),
        ];
      case 5:
        return [
          ...array.filter(column => selectedColumns.includes(column.toString())),
          ...array.filter(column => !selectedColumns.includes(column.toString())),
        ];
      default:
        return array;
    }
  }

  const cacheFilterData = (filterName, filterValues, setter, sortFn) => {
    const cacheKey = ['filter-values', filterName, appliedFilters, selectedForm];
    const cached = queryClient.getQueryData(cacheKey);
    
    if (cached) {
      setter(sortFn(cached));
      return;
    }
    
    axios.post(`${api}/api/v2/filter-values?form_id=${selectedForm}`, {
      "filter-name": filterName,
      "filters": filterValues
    })
    .then(response => {
      const values = response.data.values || [];
      setter(sortFn(values));
      queryClient.setQueryData(cacheKey, values);
    })
    .catch(err => {
      console.error(`Ошибка получения значений фильтра ${filterName}:`, err);
      setter([]);
    });
  };

  const showYears = () => cacheFilterData("год", [
    { "filter-name": "субъект", "values": selectedCities },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "строка", "values": selectedRows },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setYears, (vals) => handleSortedArray(2, vals));

  const showCities = () => cacheFilterData("субъект", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "строка", "values": selectedRows },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setCities, (vals) => handleSortedArray(1, vals));

  const showSections = () => cacheFilterData("раздел", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "субъект", "values": selectedCities },
    { "filter-name": "строка", "values": selectedRows },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setSections, (vals) => handleSortedArray(3, vals));

  const showRows = () => cacheFilterData("строка", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "субъект", "values": selectedCities },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setRows, (vals) => handleSortedArray(4, vals));

  const showColumns = () => cacheFilterData("колонка", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "субъект", "values": selectedCities },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "строка", "values": selectedRows }
  ], setColumns, (vals) => handleSortedArray(5, vals));

  // Рендер состояния загрузки
  if (isLoading) {
    return (
      <div className={style.tableWrapper}>
        <div className={style.loadingOverlay}>
          <div className={style.spinner}></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  // Рендер ошибки
  if (hasError) {
    return (
      <div className={style.tableWrapper}>
        <div className={style.errorContainer}>
          <FiAlertTriangle size={48} color="#e74c3c" />
          <h3>Ошибка загрузки данных</h3>
          <p>{errorMessage}</p>
          <button 
            className={style.retryButton}
            onClick={refetch}
            disabled={isRefetching}
          >
            {isRefetching ? 'Повторная попытка...' : 'Попробовать снова'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.tableWrapper}>
      {/* Объединенный контейнер для кнопок - ОСТАВЛЯЕМ ТОЛЬКО ЭТОТ */}
      <div className={style.controlsRow}>
        <div>
          <button className={style.homeButton} onClick={goToHome} aria-label="Главная">
                <FiHome className={style.homeIcon} />
                Главное меню
              </button>
        </div>
        
        <div className={style.formSelector} onClick={() => setFormSelectModal(true)}>
          <FiFileText size={18} />
          <span>Текущая форма: {currentFormName || 'Загрузка...'}</span>
        </div>
        
        
      </div>

      {/* УДАЛЯЕМ КНОПКИ СКАЧИВАНИЯ ИЗ ТОПБАРА */}
      <TopBar 
        goToHome={goToHome} 
        isEmpty={isEmpty}
        forms={forms} 
        currentForm={currentForm}
        setCurrentForm={setCurrentForm}
      />
      
      {!isEmpty && (
        <div className={style.filterBar}>
          <button className={style.filterButton} onClick={() => setModalActive(true)}>
            <FiFilter />
            Фильтры
          </button>
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
      )}
      
      <AppliedFilters 
        appliedFilters={appliedFilters} 
        setFilter={setFilter} 
        showCities={showCities} 
        showYears={showYears} 
        showSections={showSections} 
        showRows={showRows} 
        showColumns={showColumns} 
        setModalActive={setModalActive} 
      />
      
      {isEmpty ? (
        <div className={style.emptyContainer}>
          <div className={style.emptyContent}>
            <h3>Нет данных для отображения</h3>
            <p>Для выбранной формы нет загруженных данных. Пожалуйста, загрузите файлы через раздел "Загрузка файлов".</p>
            <button 
              className={style.uploadButton}
              onClick={() => window.location.href = '/upload'}
            >
              Перейти к загрузке файлов
            </button>
          </div>
        </div>
      ) : (
        <DataTable 
          strings={strings} 
          thead={thead} 
          hasMore={hasMore} 
          loadMore={loadMore} 
          loadingMoreData={loadingMoreData} 
        />
      )}
      
      <FilterModal 
        active={modalActive} 
        setActive={setModalActive} 
        filter={filter} 
        setFilter={setFilter}
        cities={cities} 
        years={years} 
        sections={sections} 
        rows={rows} 
        columns={columns}
        selectedCities={selectedCities} 
        selectedYears={selectedYears} 
        selectedSections={selectedSections}
        selectedRows={selectedRows} 
        selectedColumns={selectedColumns}
        setSelectedCities={setSelectedCities} 
        setSelectedYears={setSelectedYears} 
        setSelectedSections={setSelectedSections}
        setSelectedRows={setSelectedRows} 
        setSelectedColumns={setSelectedColumns}
        searchCity={searchCity} 
        setSearchCity={setSearchCity}
        searchRow={searchRow} 
        setSearchRow={setSearchRow}
        searchColumn={searchColumn} 
        setSearchColumn={setSearchColumn}
        handleFilteredData={handleFilteredData} 
        showCities={showCities} 
        showYears={showYears} 
        showSections={showSections} 
        showRows={showRows} 
        showColumns={showColumns}
        setCities={setCities} 
        setYears={setYears} 
        setSections={setSections} 
        setColumns={setColumns} 
        setRows={setRows}
      />
    </div>
  );
}

export default Table;