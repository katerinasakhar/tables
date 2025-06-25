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
      Загрузить файлы</label>
      <input type='file' id="download" className='download' multiple onChange={handleFileChange} accept=".xls,.xlsx" />
      <Button />
    </div>
  );
}

export default Home;
