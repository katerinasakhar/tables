import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Table from "/src/pages/Table/Table1.jsx";
import Home from "/src/pages/Home/Home.jsx";
import UploadedFiles from "/src/pages/Upload/UploadPage.jsx";
import FormSelectorModal from "/src/components/FormSelectorModal.jsx";

const api = process.env.API;;

const App = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loadingForms, setLoadingForms] = useState(true);
  const [formSelectModal, setFormSelectModal] = useState(false);
  const [error, setError] = useState(null);
  const [showInitialModal, setShowInitialModal] = useState(false);

  // Загрузка форм при монтировании
  useEffect(() => {
    const loadForms = async () => {
      try {
        setError(null);
        const response = await fetch(`${api}/api/v2/forms`);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки форм: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.forms || !Array.isArray(data.forms)) {
          throw new Error('Некорректный ответ от сервера');
        }
        setForms(data.forms || []);
        
        // Проверяем, есть ли сохраненная форма
        const savedFormId = localStorage.getItem('selectedFormId');
        const savedForm = data.forms.find(f => f.id === savedFormId);
        
        if (savedForm) {
          setSelectedForm(savedFormId);
          setShowInitialModal(false);
        } else if (data.forms.length === 0) {
          // Если форм нет, показываем модальное окно для создания первой формы
          setShowInitialModal(true);
        } else {
          // Если формы есть, но не выбрана, показываем модальное окно выбора
          setShowInitialModal(true);
        }
        
        setLoadingForms(false);
      } catch (err) {
        console.error('Ошибка загрузки форм:', err);
        setError(err.message || 'Не удалось загрузить формы');
        setLoadingForms(false);
        setShowInitialModal(true);
      }
    };

    loadForms();
  }, []);

  // Создание стандартной формы
  const createStandardForm = async (formName, skipSheets = []) => {
    try {
      const response = await fetch(`${api}/api/v2/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formName,
          requisites: {
            skip_sheets: skipSheets
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка создания формы');
      }
      
      const newForm = await response.json();
      
      // Обновляем список форм
      const formsResponse = await fetch(`${api}/api/v2/forms`);
      const formsData = await formsResponse.json();
      setForms(formsData.forms || []);
      
      // Выбираем созданную форму
      setSelectedForm(newForm.id);
      localStorage.setItem('selectedFormId', newForm.id);
      
      return newForm;
    } catch (error) {
      console.error('Ошибка создания формы:', error);
      throw error;
    }
  };

  // Обработчик выбора формы
  const handleFormSelect = (formId) => {
    setSelectedForm(formId);
    localStorage.setItem('selectedFormId', formId);
  };

  // Обработчик сохранения и перезагрузки
  const handleSaveAndReload = () => {
    window.location.reload();
  };

  if (loadingForms) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ textAlign: 'center', fontSize: '18px' }}>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error && forms.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    { 
      path: "/", 
      element: <Home selectedForm={selectedForm} setFormSelectModal={setFormSelectModal} /> 
    },
    { 
      path: "/table", 
      element: <Table selectedForm={selectedForm} setFormSelectModal={setFormSelectModal} /> 
    },
    { 
      path: "/upload", 
      element: <UploadedFiles selectedForm={selectedForm} setFormSelectModal={setFormSelectModal} /> 
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      
      {/* Модальное окно для начального выбора формы */}
      <FormSelectorModal
        active={showInitialModal}
        setActive={setShowInitialModal}
        forms={forms}
        selectedForm={selectedForm}
        onSelectForm={handleFormSelect}
        onSave={handleSaveAndReload}
        onCreateForm={createStandardForm}
        isInitial={true}
      />
      
      {/* Модальное окно для смены формы */}
      <FormSelectorModal
        active={formSelectModal}
        setActive={setFormSelectModal}
        forms={forms}
        selectedForm={selectedForm}
        onSelectForm={handleFormSelect}
        onSave={handleSaveAndReload}
        onCreateForm={createStandardForm}
        isInitial={false}
      />
    </>
  );
};

export default App;