// === File: App.jsx ===
import Table from "/src/pages/Table/Table1.jsx";
import Home from "/src/pages/Home/Home.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import UploadedFiles from "/src/pages/Upload/UploadPage.jsx";
import { useEffect, useState } from 'react';
import Modal from '/src/features/Modal.jsx';

const API_BASE_URL = "http://5.165.236.240:2700";

const App = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loadingForms, setLoadingForms] = useState(true);
  const [formSelectModal, setFormSelectModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/v2/forms`);
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки форм: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Полученные формы:', data);
        
        if (!data.forms || !Array.isArray(data.forms) || data.forms.length === 0) {
          throw new Error('Нет доступных форм');
        }
        
        setForms(data.forms);
        
        const savedFormId = localStorage.getItem('selectedFormId');
        const savedForm = data.forms.find(f => f.id === savedFormId);
        
        if (savedForm) {
          setSelectedForm(savedFormId);
        } else {
          setSelectedForm(data.forms[0].id);
          localStorage.setItem('selectedFormId', data.forms[0].id);
        }
        
        setLoadingForms(false);
      } catch (err) {
        console.error('Ошибка загрузки форм:', err);
        setError(err.message || 'Не удалось загрузить формы');
        setLoadingForms(false);
      }
    };

    loadForms();
  }, []);

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

  if (error) {
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

  const route = createBrowserRouter([
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
      <RouterProvider router={route} />
      
      <Modal active={formSelectModal} setActive={setFormSelectModal}>
        <div style={{ padding: '2rem', maxWidth: '500px', width: '100%' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Выберите форму отчетности</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {forms.map((form) => (
              <button
                key={form.id}
                onClick={() => {
                  setSelectedForm(form.id);
                  localStorage.setItem('selectedFormId', form.id);
                  setFormSelectModal(false);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: selectedForm === form.id ? '2px solid #3498db' : '1px solid #ddd',
                  background: selectedForm === form.id ? '#e3f2fd' : '#fff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem'
                }}>
                  {form.name}
                </div>
                {selectedForm === form.id && (
                  <div style={{ color: '#27ae60', fontSize: '0.9rem' }}>
                    Выбрано
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={() => setFormSelectModal(false)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#e0e0e0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;
// === End of file ===