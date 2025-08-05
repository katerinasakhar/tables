// === Home.jsx ===
import React, { useState } from 'react';
import styles from './Home.module.css';
import { NavLink } from 'react-router-dom';
import UploadedFilesArea from '/src/features/UploadedFilesArea.jsx';
import { BsCloudUpload } from "react-icons/bs";
import {  FiBarChart } from 'react-icons/fi'; 
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
          <BsCloudUpload size={20} /> {/* Используем иконку загрузки */}
          Загрузить файлы
        </NavLink>

        <NavLink to="/table" className={styles.button}>
          <FiBarChart size={20} /> {/* Иконка анализа данных */}
          Анализ данных
        </NavLink>
      </div>

      <UploadedFilesArea />
    </div>
  );
};

export default Home;