import Button  from './Buttons.jsx';
import { useState } from 'react';
//import "./Home.css";

function Home() {
  const [files, setFiles] = useState([]);
  const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).filter(file =>
      allowedTypes.includes(file.type)
    );
    setFiles(selectedFiles);
  };

  return (
    <div className="App">
      <label htmlFor='download' className='btn'>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="30px" width="30px">
      <g  >
      <path d="m8.71 7.71 2.29-2.3v9.59a1 1 0 0 0 2 0v-9.59l2.29 2.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0 -.33-.21 1 1 0 0 0 -.76 0 1 1 0 0 0 -.33.21l-4 4a1 1 0 1 0 1.42 1.42zm12.29 6.29a1 1 0 0 0 -1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1-1v-4a1 1 0 0 0 -2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0 -1-1z"/>
      </g>
      </svg>
      Загрузить файлы</label>
      <input type='file' id="download" className='download' multiple onChange={handleFileChange} accept=".xls,.xlsx" />
      <Button />
    </div>
  );
}

export default Home;
