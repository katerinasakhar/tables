
import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { NavLink } from 'react-router-dom';
import UploadedFilesArea from '/src/features/UploadedFilesArea.jsx';
import { BsCloudUpload } from "react-icons/bs";
import { FiBarChart, FiFileText } from 'react-icons/fi';

const Home = ({ selectedForm, setFormSelectModal }) => {
  const [files, setFiles] = useState([]);
  const [currentFormName, setCurrentFormName] = useState('');

  // Получение названия текущей формы
  useEffect(() => {
    const fetchCurrentFormName = async () => {
      try {
        const api = process.env.API;
        const response = await fetch(`${api}/api/v2/forms/${selectedForm}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных формы');
        
        const form = await response.json();
        setCurrentFormName(form.name);
      } catch (error) {
        console.error('Ошибка при получении данных формы:', error);
        setCurrentFormName('Неизвестная форма');
      }
    };

    if (selectedForm) {
      fetchCurrentFormName();
    }
  }, [selectedForm]);

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
      <div 
        className={styles.formSelector}
        onClick={() => setFormSelectModal(true)}
        title="Сменить форму отчетности"
      >
        <FiFileText size={20} />
        <span>Текущая форма: {currentFormName || 'Загрузка...'}</span>
      </div>

      <h1 className={styles.title}>Добро пожаловать!</h1>
      <p className={styles.subtitle}>
        Выберите действие ниже — загрузите новые файлы или перейдите к анализу данных.
      </p>
      <div className={styles.buttonsWrapper}>
        <NavLink to="/upload" className={styles.button}>
          <BsCloudUpload size={20} />
          Загрузить файлы
        </NavLink>
        <NavLink to="/table" className={styles.button}>
          <FiBarChart size={20} />
          Анализ данных
        </NavLink>
      </div>
      <UploadedFilesArea selectedForm={selectedForm} />
    </div>
  );
};

export default Home;
