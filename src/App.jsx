import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Table from "/src/pages/Table/Table1.jsx";
import Home from "/src/pages/Home/Home.jsx";
import UploadedFiles from "/src/pages/Upload/UploadPage.jsx";
import FormSelectorModal from "/src/components/FormSelectorModal.jsx";
import ErrorDisplay from "/src/components/ErrorDisplay.jsx";

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
          let errorDetails = `Ошибка загрузки форм: ${response.status} ${response.statusText}`;
          let serverResponse = null;
          
          // Пытаемся получить детальную информацию об ошибке с бэкенда
          try {
            const errorData = await response.json();
            serverResponse = errorData;
            if (errorData.detail) {
              errorDetails = errorData.detail;
            }
          } catch (jsonError) {
            // Если не удалось распарсить JSON, используем статус
            serverResponse = {
              status: response.status,
              statusText: response.statusText,
              url: response.url
            };
          }
          
          const error = new Error(errorDetails);
          error.serverResponse = serverResponse;
          throw error;
        }
        const data = await response.json();
        if (!data.forms || !Array.isArray(data.forms)) {
          throw new Error('Некорректный ответ от сервера: отсутствует массив форм');
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
        
        // Определяем тип ошибки
        let errorInfo = {
          message: err.message || 'Не удалось загрузить формы',
          status: 'Ошибка загрузки форм',
          originalError: err,
          timestamp: new Date().toISOString(),
          context: 'loadForms',
          operation: 'загрузка списка доступных форм отчетности с сервера'
        };
        
        // Проверяем, является ли это ошибкой соединения с сервером
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          errorInfo.status = 'Сервер недоступен';
          errorInfo.message = 'Не удалось подключиться к серверу. Сервер может быть не запущен или недоступен.';
          errorInfo.operation = 'установление соединения с сервером';
          errorInfo.serverResponse = {
            type: 'connection_error',
            message: 'Сервер не отвечает на запросы',
            suggestion: 'Проверьте, что сервер запущен и доступен по адресу: ' + api,
            error: err.message
          };
        } else if (err.serverResponse) {
          // Если есть ответ от сервера, используем его
          errorInfo.serverResponse = err.serverResponse;
        } else {
          // Для всех остальных ошибок
          errorInfo.serverResponse = {
            message: err.message
          };
        }
        
        setError(errorInfo);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <ErrorDisplay 
          error={error}
          onRetry={() => window.location.reload()}
        />
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