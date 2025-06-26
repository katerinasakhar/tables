// === Home.jsx ===
import React, { useState } from 'react';
import styles from './Home.module.css';
import { NavLink } from 'react-router-dom';
import UploadedFilesArea from '/src/features/UploadedFilesArea.jsx';


const Home = () => {
  const [files, setFiles] = useState([]);
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      allowedTypes.includes(file.type)
    );
    setFiles(selectedFiles);
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      <p className={styles.subtitle}>
        Выберите действие ниже — загрузите новые файлы или перейдите к анализу данных.
      </p>

      <div className={styles.buttonsWrapper}>
        <NavLink to="/upload" className={styles.button}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
          Загрузить файлы
        </NavLink>

        <NavLink to="/table" className={styles.button}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h6v6H4zm10 0h6v6h-6zm-10 10h6v6H4zm10 0h6v6h-6z" />
          </svg>
          Анализ данных
        </NavLink>
      </div>

      
      <UploadedFilesArea />
    </div>
  );
};

export default Home;