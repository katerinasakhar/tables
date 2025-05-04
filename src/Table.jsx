import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './Table.css'
import * as XLSX from 'xlsx';

function Table(){
  const api = process.env.API
    const [searchRow, setSearchRow] = useState('');
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
    const [dfilter, setDfilter]=useState({
        "filters":[],
        "limit": 1000,
        "offset": 0
    })

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
   /*useEffect(() => {
        axios.post(`${api}/api/v2/filtered-data`,dfilter).then((response)=>{
            setStrings(response.data.data || [])
            console.log(strings)
            setThead(response.data.headers || []);
        }).catch((error) => {
            console.error("Ошибка при получении данных:", error);
          });
      }, [dfilter]);

      useEffect(()=>{
        axios.post(`${api}/api/v2/filter-values`, {
            "filter-name": "год",
            "filters": []
        }).then((response)=>{
            setYears(response.data.values)
        }).catch((error) => {
            console.error("Ошибка при получении данных:", error);
          })

          axios.post(`${api}/api/v2/filter-values`, {
            "filter-name": "город",
            "filters": []
        }).then((response)=>{
            setCities(response.data.values)
        }).catch((error) => {
            console.error("Ошибка при получении данных:", error);
          })

          axios.post(`${api}/api/v2/filter-values`, {
            "filter-name": "раздел",
            "filters": []
        }).then((response)=>{
            setSections(response.data.values)
        }).catch((error) => {
            console.error("Ошибка при получении данных:", error);
          })

          axios.post(`${api}/api/v2/filter-values`, {
            "filter-name": "строка",
            "filters": []
        }).then((response)=>{
            setRows(response.data.values)
        }).catch((error) => {
            console.error("Ошибка при получении данных:", error);
          })

          axios.post(`${api}/api/v2/filter-values`, {
            "filter-name": "колонка",
            "filters": []
        }).then((response)=>{
            setColumns(response.data.values)
        }).catch((error) => {
            console.error("Ошибка при получении данных:", error);
          })
      },[])*/

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
            "limit":50000,
            "offset":0
        })
        console.log(dfilter)
        setModalActive(false)
      }
      
    return(<div>
        <button onClick={()=>setModalActive(true)}>фильтры</button>
        <button onClick={exportToExcel}>Скачать XLS</button> {/* Новая кнопка */}
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
    <h2>фильтры</h2>
        {filter==0&&(
            <div className='filters'>
<button onClick={()=>{setCities([]); showCities(); setFilter(1)}}>города</button><br/>
<button onClick={()=>{setYears([]); showYears(); setFilter(2)}}>года</button><br/>
<button onClick={()=>{setSections([]); showSections(); setFilter(3)}}>разделы</button><br/>
<button onClick={()=>{setRows([]); showRows(); setFilter(4)}}>строки</button><br/>
<button onClick={()=>{setColumns([]);showColumns(); setFilter(5)}}>колонки</button><br/>
<button className='submit-data' onClick={handleFilteredData}>применить</button>
</div>)}
{filter==1&&(
    <div className='filter-content'>
        <h3>выберете города</h3>
        <div className='scroll'>
        {cities.map((city)=>(
            <div key={city}>
             <label>
             <input
               type="checkbox"
               value={city}
               checked={selectedCities.includes(city.toString())}
               onChange={handleCityChange}
             />
             {city}
           </label><br/>
           </div>
        ))}
        </div>
        <button className='button-back' onClick={()=>setFilter(0)}>Назад</button>
    </div>
)}
{filter==2&&(
    <div className='filter-content'>
        <h3>выберете года</h3>
        <div className='scroll'>
        {years.map((year)=>(
            <div key={year}>
             <label>
             <input
               type="checkbox"
               value={year}
               checked={selectedYears.includes(year)}
               onChange={handleYearChange}
             />
             {year}
           </label><br/>
           </div>
        ))}
        </div>
        <button className='button-back' onClick={()=>setFilter(0)}>Назад</button>
    </div>
)}
{filter==3&&(
    <div className='filter-content'>
        <h3>выберете разделы</h3>
        <div className='scroll'>
        {sections.map((section)=>(
            <div key={section}>
             <label>
             <input
               type="checkbox"
               value={section}
               checked={selectedSections.includes(section.toString())}
               onChange={handleSectionChange}
             />
             {section}
           </label><br/>
           </div>
        ))}
        </div>
        <button className='button-back' onClick={()=>setFilter(0)}>Назад</button>
    </div>
)}
{filter == 4 && (
  <div className='filter-content'>
    <h3>Выберете строки</h3>
    <input
      type="text"
      placeholder="Поиск..."
      value={searchRow}
      onChange={(e) => setSearchRow(e.target.value)}
      style={{ marginBottom: "10px" }}
    />
    <div className='scroll'>
      {rows
        .filter(row => 
          row.toString().toLowerCase().includes(searchRow.toLowerCase()) // Исправлено
        )
        .map((row) => (
          <div key={row}>
            <label>
              <input
                type="checkbox"
                value={row}
                checked={selectedRows.includes(row.toString())}
                onChange={handleRowChange}
              />
              {row}
            </label><br/>
          </div>
        ))}
    </div>
    <button className='button-back' onClick={() => setFilter(0)}>Назад</button>
  </div>
)}
{filter == 5 && (
  <div className='filter-content'>
    <h3>Выберете колонки</h3>
    <input
      type="text"
      placeholder="Поиск..."
      value={searchColumn}
      onChange={(e) => setSearchColumn(e.target.value)}
      style={{ marginBottom: "10px" }}
    />
    <div className='scroll'>
      {columns
        .filter(column => 
          column.toString().toLowerCase().includes(searchColumn.toLowerCase()) // Исправлено
        )
        .map((column) => (
          <div key={column}>
            <label>
              <input
                type="checkbox"
                value={column}
                checked={selectedColumns.includes(column.toString())}
                onChange={handleColumnChange}
              />
              {column}
            </label><br/>
          </div>
        ))}
    </div>
    <button className='button-back' onClick={() => setFilter(0)}>Назад</button>
  </div>
)}
    </Modal>
        
    </div>)
}


export default Table