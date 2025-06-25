import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import * as XLSX from 'xlsx';
import componentStyles from './TableModalComponents.module.css';
import style from './Table.module.css'

function Table(){
  const api = process.env.API

    const [searchRow, setSearchRow] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchColumn, setSearchColumn] = useState('');
    const [thead,setThead]=useState([]);
    const [strings,setStrings]=useState([])
    const [modalActive, setModalActive]=useState(false)
    const [filter, setFilter] = useState(0);


    const [sections, setSections]=useState([])
    const [selectedSections, setSelectedSections] = useState([]);
    const [years, setYears] = useState([2022, 2023]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [rows, setRows]=useState([]);
    const [columns, setColumns]=useState([]);
    const [selectedRows, setSelectedRows]=useState([]);
    const [selectedColumns, setSelectedColumns]=useState([]);
    const [offset,setOffset]=useState(0);
    const [limit]=useState(10);
    const [dfilter, setDfilter]=useState({
        "filters":[],
        "limit": 1000,
        "offset": 0
    })
    
    useEffect(() => {
            axios.post("http://5.165.236.240:2700/api/v2/filtered-data",dfilter).then((response)=>{
                setStrings(response.data.data || [])
                console.log(strings)
                setThead(response.data.headers || []);
            }).catch((error) => {
                console.error("Ошибка при получении данных:", error);
              });
          }, [dfilter]);
    const loadMore = () =>{
      setOffset(offset+limit);
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
      function handleSelectAllCities(){
        if (selectedCities.length===cities.length){
          setSelectedCities([])
        }
        else{
          setSelectedCities(cities)
        }
      }
      function handleSelectAllRows(){
        if (selectedRows.length===rows.length){
          setSelectedRows([])
        }
        else{
          setSelectedRows(rows)
        }
      }
      function handleSelectAllColumns(){
        if (selectedColumns.length===columns.length){
          setSelectedColumns([])
        }
        else{
          setSelectedColumns(columns)
        }
      }
      function handleSelectAllYears(){
        if (selectedYears.length===years.length){
          setSelectedYears([])
        }
        else{
          setSelectedYears(years)
        }
      }
      function handleSelectAllSections(){
        if (selectedSections.length===sections.length){
          setSelectedSections([])
        }
        else{
          setSelectedSections(sections)
        }
      }

      function showYears(){
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
      }).then((response)=>{
          setYears(response.data.values)
      }).catch((error) => {
          console.error("Ошибка при получении данных:", error);
        })
      }

      function showCities(){
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
      }).then((response)=>{
          setCities(response.data.values)
      }).catch((error) => {
          console.error("Ошибка при получении данных:", error);
        })
      }

      function showSections(){
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
      }).then((response)=>{
          setSections(response.data.values)
      }).catch((error) => {
          console.error("Ошибка при получении данных:", error);
        })

      }

      function showRows(){
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
      }).then((response)=>{
          setRows(response.data.values)
      }).catch((error) => {
          console.error("Ошибка при получении данных:", error);
        })
      }

      function showColumns(){
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
      }).then((response)=>{
          setColumns(response.data.values)
      }).catch((error) => {
          console.error("Ошибка при получении данных:", error);
        })
      }
      
      function handleFilteredData(){
        setOffset(0);
        setStrings([])
        setDfilter({
            "filters":[
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
            "limit":limit,
            "offset":offset
        })
        setModalActive(false)
      }
      
    return(<div>
        <button className={style.btn} onClick={()=>setModalActive(true)}>Фильтры</button>
        <button className={style.btn} onClick={exportToExcel}>Скачать XLS</button> {/* Новая кнопка */}
        {strings.length==0&&(
    <p>Загрузка...</p>
)}
    <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
            <tr>
            {thead.map((head) => (
                    <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
{strings.length>0&&strings.map((string)=>(
    <tr key={string.id}>
        {string.map((cell)=>(
            <th key={cell}>{cell}</th>
        ))}
    </tr>
))}
  </tbody>
    </table>
    <Modal active={modalActive} setActive={setModalActive}>
      <div className={componentStyles.content}>
        {filter==0&&(
            <div className={componentStyles.filters}>
<h2>Фильтры</h2>
<button onClick={()=>{setCities([]); showCities(); setFilter(1)}}>Города</button>
<button onClick={()=>{setYears([]); showYears(); setFilter(2)}}>Года</button>
<button onClick={()=>{setSections([]); showSections(); setFilter(3)}}>Разделы</button>
<button onClick={()=>{setRows([]); showRows(); setFilter(4)}}>Строки</button>
<button onClick={()=>{setColumns([]);showColumns(); setFilter(5)}}>Столбцы</button>
<button className={componentStyles.submitData} onClick={handleFilteredData}>Применить</button>
</div>)}
{filter==1&&(
    <div>
        <h3>Города</h3>
        <div className={componentStyles.searchContainer}>
          <div className={componentStyles.searchInput}>
        <input
      type="text"
      placeholder="Поиск..."
      value={searchCity}
      onChange={(e) => setSearchCity(e.target.value)}
    />
    </div>
    <div class={componentStyles.checkboxWrapper}>
    <label>
      <input
      type='checkbox'
      checked={selectedCities.length===cities.length}
      onChange={handleSelectAllCities}
      class={componentStyles.input}
      />
      {selectedCities.length === cities.length ? 'Снять все' : 'Выбрать все'}
    </label>
    </div>
</div>
    <div className={componentStyles.scrollAndButton}>
        <div className={componentStyles.scroll}>
        {cities.filter(city => 
          city.toString().toLowerCase().includes(searchCity.toLowerCase()) // Исправлено
        ).map((city)=>(
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
        ))}
        </div>
        <div className={componentStyles.buttonWrapper}>
       <button className={componentStyles.buttonBack} onClick={()=>setFilter(0)}>Назад</button> 
       </div>
       </div>
    </div>
)}
{filter==2&&(
    <div>
        <h3>Год</h3>
       <div class={componentStyles.checkboxWrapper}>
        <label>
      <input
      type='checkbox'
      checked={selectedYears.length===years.length}
      onChange={handleSelectAllYears}
      class={componentStyles.input}
      />
      {selectedYears.length === years.length ? 'Снять все' : 'Выбрать все'}
    </label>
    </div>
    <div className={componentStyles.scrollAndButton}>
        <div className={componentStyles.scroll}>
        {years.map((year)=>(
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
        ))}
        </div>
        <div className={componentStyles.buttonWrapper}>
        <button className={componentStyles.buttonBack} onClick={()=>setFilter(0)}>Назад</button>
        </div>
        </div>
    </div>
)}
{filter==3&&(
    <div>
        <h3>Раздел</h3>
            <div class={componentStyles.checkboxWrapper}>
        <label>
      <input
      type='checkbox'
      checked={selectedSections.length===sections.length}
      onChange={handleSelectAllSections}
      class={componentStyles.input}
      />
      {selectedSections.length === sections.length ? 'Снять все' : 'Выбрать все'}
    </label>
    </div>
    <div className={componentStyles.scrollAndButton}>
        <div className={componentStyles.scroll}>
        {sections.map((section)=>(
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
        ))}
        </div>
        <div className={componentStyles.buttonWrapper}>
        <button className={componentStyles.buttonBack} onClick={()=>setFilter(0)}>Назад</button>
        </div>
        </div>
    </div>
)}
{filter == 4 && (
  <div>
    <h3>Строка</h3>
    <input
      type="text"
      placeholder="Поиск..."
      value={searchRow}
      onChange={(e) => setSearchRow(e.target.value)}
      style={{ marginBottom: "10px" }}
    />
        <div class={componentStyles.checkboxWrapper}>
    <label>
      <input
      type='checkbox'
      checked={selectedRows.length===rows.length}
      onChange={handleSelectAllRows}
      class={componentStyles.input}
      />
      {selectedRows.length === rows.length ? 'Снять все' : 'Выбрать все'}
    </label>
    </div>
    <div className={componentStyles.scrollAndButton}>
    <div className={componentStyles.scroll}>
      {rows
        .filter(row => 
          row.toString().toLowerCase().includes(searchRow.toLowerCase()) // Исправлено
        )
        .map((row) => (
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
        ))}
    </div>
    <div className={componentStyles.buttonWrapper}>
    <button className={componentStyles.buttonBack} onClick={() => setFilter(0)}>Назад</button>
    </div>
    </div>
  </div>
)}
{filter == 5 && (
  <div>
    <h3>Столбец</h3>
    <input
      type="text"
      placeholder="Поиск..."
      value={searchColumn}
      onChange={(e) => setSearchColumn(e.target.value)}
      style={{ marginBottom: "10px" }}
    />
        <div class={componentStyles.checkboxWrapper}>
     <label>
      <input
      type='checkbox'
      checked={selectedColumns.length===columns.length}
      onChange={handleSelectAllColumns}
      class={componentStyles.input}
      />
      {selectedColumns.length === columns.length ? 'Снять все' : 'Выбрать все'}
    </label>
    </div>
    <div className={componentStyles.scrollAndButton}>
    <div className={componentStyles.scroll}>
      {columns
        .filter(column => 
          column.toString().toLowerCase().includes(searchColumn.toLowerCase()) // Исправлено
        )
        .map((column) => (
          <div key={column} className={componentStyles.item}>
            <label>
              <input
                type="checkbox"
                value={column}
                checked={selectedColumns.includes(column.toString())}
                onChange={handleColumnChange}
              />
              {column}
            </label>
          </div>
        ))}
    </div>
    <div className={componentStyles.buttonWrapper}>
    <button className={componentStyles.buttonBack} onClick={() => setFilter(0)}>Назад</button>
    </div>
    </div>
  </div>
)}
</div>
    </Modal>
        
    </div>)
}

export default Table;
