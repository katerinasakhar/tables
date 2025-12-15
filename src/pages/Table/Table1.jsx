import { useState } from "react";
import { useTableData } from "./useTableData";
import TopBar from "./TopBar";
import AppliedFilters from "./AppliedFilters";
import DataTable from "./DataTable";
import FilterModal from "./FilterModal";
import * as XLSX from 'xlsx';
import style from './Table.module.css';
import axios from "axios";
import componentStyles from './TableModalComponents.module.css'; //added //added
import { FiFilter } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

function Table (){
    

    const api = process.env.API
    const limit = 10;
    const queryClient = useQueryClient();
    const {strings,thead,loadMore,hasMore,loadingMoreData,getMaxSize,setDfilter,forms,currentForm,setCurrentForm}=useTableData(api,limit)
   
    
    const [modalActive, setModalActive] = useState(false)
    const [filter, setFilter] = useState(0)
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

  const [sections, setSections] = useState([])
  const [selectedSections, setSelectedSections] = useState([]);

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [searchRow, setSearchRow] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  

  const isLoading = strings.length === 0;

  function downloadXLS(){
    const maxSize=getMaxSize()
    const filters={
      ...appliedFilters,
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

    function downloadCSV(){ 
    const maxSize=getMaxSize()
    const filter=[
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
      ]
    const filters = { filters:filter, limit: maxSize.current, offset: 0 };
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

  const goToHome = () => {
    window.location.href = '/';
  };

  
  function handleFilteredData() {
    queryClient.setQueryData(['table-data', appliedFilters, currentForm, limit], {
      pages: [],
      pageParams: []
    });
    setDfilter(
      [
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
      ]
    )
    setAppliedFilters({
      cities: [...selectedCities],
      years: [...selectedYears],
      sections: [...selectedSections],
      rows: [...selectedRows],
      columns: [...selectedColumns]
    });
    setModalActive(false)
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
  
  const cacheFilterData =  (filterName, filterValues, setter, sortFn) => {
    const cacheKey = ['filter-values', filterName, appliedFilters];
    const cached = queryClient.getQueryData(cacheKey);
    if (cached) {
      setter(sortFn(cached));
      return;
    }
    
    axios.post(`${api}/api/v2/filter-values`, {
    "filter-name": filterName,
    "filters": filterValues
  })
  .then(response => {
    const values = response.data.values;
    setter(sortFn(values));
    queryClient.setQueryData(cacheKey, values);
  })
  .catch(err => {
    console.error(err);
  });

  };
  const showYears = () => cacheFilterData("год", [
    { "filter-name": "город", "values": selectedCities },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "строка", "values": selectedRows },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setYears, (vals) => handleSortedArray(2, vals));

  
  const showCities = () => cacheFilterData("город", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "строка", "values": selectedRows },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setCities, (vals) => handleSortedArray(1, vals));

  const showSections = () => cacheFilterData("раздел", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "город", "values": selectedCities },
    { "filter-name": "строка", "values": selectedRows },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setSections, (vals) => handleSortedArray(3, vals));

  const showRows = () => cacheFilterData("строка", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "город", "values": selectedCities },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "колонка", "values": selectedColumns }
  ], setRows, (vals) => handleSortedArray(4, vals));

  const showColumns = () => cacheFilterData("колонка", [
    { "filter-name": "год", "values": selectedYears },
    { "filter-name": "город", "values": selectedCities },
    { "filter-name": "раздел", "values": selectedSections },
    { "filter-name": "строка", "values": selectedRows }
  ], setColumns, (vals) => handleSortedArray(5, vals));
 
  return (
    <div className={style.tableWrapper}>
        <TopBar goToHome={goToHome} downloadCSV={downloadCSV} isLoading={isLoading} forms={forms} setCurrentForm={setCurrentForm}/>
        {!isLoading && <div className={style.filterBar}>
                  <button className={style.filterButton} onClick={() => setModalActive(true)}>
                    <FiFilter />
                    Фильтры
                  </button>
                </div>}
        <AppliedFilters appliedFilters={appliedFilters} setFilter={setFilter} showCities={showCities} showYears={showYears} showSections={showSections} showRows={showRows} showColumns={showColumns} setModalActive={setModalActive} />
      {isLoading ? (<div className={style.loadingOverlay}>
                <div className={style.spinner}></div>
                <p>Загрузка данных...</p>
              </div>) : 
              <DataTable strings={strings} thead={thead} hasMore={hasMore} loadMore={loadMore} loadingMoreData={loadingMoreData} />}
      <FilterModal active={modalActive} setActive={setModalActive} filter={filter} setFilter={setFilter}
        cities={cities} years={years} sections={sections} rows={rows} columns={columns}
        selectedCities={selectedCities} selectedYears={selectedYears} selectedSections={selectedSections}
        selectedRows={selectedRows} selectedColumns={selectedColumns}
        setSelectedCities={setSelectedCities} setSelectedYears={setSelectedYears} setSelectedSections={setSelectedSections}
        setSelectedRows={setSelectedRows} setSelectedColumns={setSelectedColumns}
        searchCity={searchCity} setSearchCity={setSearchCity}
        searchRow={searchRow} setSearchRow={setSearchRow}
        searchColumn={searchColumn} setSearchColumn={setSearchColumn}
        handleFilteredData={handleFilteredData} showCities={showCities} showYears={showYears} showSections={showSections} showRows={showRows} showColumns={showColumns}
        setCities={setCities} setYears={setYears} setSections={setSections} setColumns={setColumns} setRows={setRows}
      />
    </div>
  )

}

export default Table