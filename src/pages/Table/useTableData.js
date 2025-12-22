// === File: pages/Table/useTableData.js ===
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useState, useEffect } from 'react';

export const useTableData = (api, limit, selectedForm) => {
  // ===== ФИЛЬТРЫ =====
  const [filters, setFilters] = useState([]);
  
  // ===== ЗАГРУЗКА ФОРМ =====
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [formsLoading, setFormsLoading] = useState(true);
  const [formsError, setFormsError] = useState(null);

  // Загружаем формы при монтировании и при изменении selectedForm
  useEffect(() => {
    const loadForms = async () => {
      try {
        setFormsLoading(true);
        setFormsError(null);
        
        const response = await axios.get(`${api}/api/v2/forms`);
        const formsData = response.data.forms || [];
        
        setForms(formsData.map(form => form.name));
        
        // Устанавливаем текущую форму
        if (formsData.length > 0) {
          const savedFormName = localStorage.getItem('currentFormName');
          const defaultForm = formsData.find(f => f.name === savedFormName) || formsData[0];
          setCurrentForm(defaultForm.name);
          localStorage.setItem('currentFormName', defaultForm.name);
        }
      } catch (error) {
        console.error('Ошибка загрузки форм:', error);
        setFormsError('Не удалось загрузить формы');
      } finally {
        setFormsLoading(false);
      }
    };

    if (selectedForm) {
      loadForms();
    }
  }, [api, selectedForm]);

  // ===== ОСНОВНОЙ INFINITE QUERY =====
  const query = useInfiniteQuery({
    queryKey: ['table-data', filters, currentForm, limit, selectedForm],
    queryFn: async ({ pageParam = 0 }) => {
      if (!selectedForm) throw new Error('form_id не выбран');
      
      const response = await axios.post(`${api}/api/v2/filtered-data?form_id=${selectedForm}`, {
        filters,
        limit,
        offset: pageParam
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.length * limit;
      return loaded < lastPage.max_size ? loaded : undefined;
    },
    enabled: !!selectedForm && !!currentForm,
    staleTime: 30000, // 30 секунд кэширования
    cacheTime: 300000, // 5 минут в кэше
  });

  // ===== СКЛЕИВАЕМ СТРАНИЦЫ ДЛЯ UI =====
  const strings = useMemo(() => {
    return query.data?.pages.flatMap(page => page.data) || [];
  }, [query.data]);

  // ===== HEADERS И MAX SIZE =====
  const thead = query.data?.pages?.[0]?.headers || [];
  const maxSize = query.data?.pages?.[0]?.max_size || 0;

  // ===== ФУНКЦИИ УПРАВЛЕНИЯ =====
  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  const refetch = () => {
    query.refetch();
  };

  // ===== СОСТОЯНИЯ =====
  const isLoading = query.isLoading || formsLoading;
  const isEmpty = !isLoading && strings.length === 0 && query.isSuccess;
  const hasError = query.isError || !!formsError;
  const errorMessage = query.error?.message || formsError || 'Неизвестная ошибка';

  // ===== API, СОВМЕСТИМОЕ С ВАШИМ КОДОМ =====
  return {
    strings,
    thead,
    loadMore,
    hasMore: query.hasNextPage,
    loadingMoreData: query.isFetchingNextPage,
    isLoading,
    isEmpty,
    hasError,
    errorMessage,
    setDfilter: setFilters,
    getMaxSize: () => ({ current: maxSize }),
    forms,
    currentForm,
    setCurrentForm: (formName) => {
      setCurrentForm(formName);
      localStorage.setItem('currentFormName', formName);
    },
    refetch,
    formsLoading,
    isRefetching: query.isRefetching,
  };
};
// === End of file ===