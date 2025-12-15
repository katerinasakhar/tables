import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useState } from 'react';

export const useTableData = (api, limit) => {

  // ===== ФИЛЬТРЫ (аналог dfilter.filters) =====
  const [filters, setFilters] = useState([]);

  // ===== ФОРМЫ (как у тебя) =====
  const [forms] = useState(["1-ФК", "3-ФК"]);
  const [currentForm, setCurrentForm] = useState("1-ФК");

  // ===== ОСНОВНОЙ INFINITE QUERY =====
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['table-data', filters, currentForm, limit],
    

    queryFn: ({ pageParam = 0 }) =>
      axios
        .post(`${api}/api/v2/filtered-data`, {
          filters,
          limit,
          offset: pageParam,
        })
        .then(res => res.data),

    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.length * limit;
      return loaded < lastPage.max_size ? loaded : undefined;
    },
  });

  // ===== СКЛЕИВАЕМ СТРАНИЦЫ ДЛЯ UI =====
  const strings = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  // ===== HEADERS И MAX SIZE =====
  const thead = data?.pages?.[0]?.headers ?? [];
  const maxSize = data?.pages?.[0]?.max_size ?? 0;

  // ===== API, СОВМЕСТИМОЕ С ТВОИМ КОДОМ =====
  return {
    strings,
    thead,

    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    loadingMoreData: isFetchingNextPage,
    isLoading,

    // аналоги твоих методов
    setDfilter: setFilters,
    getMaxSize: () => maxSize,

    forms,
    currentForm,
    setCurrentForm,

    error,
  };
};
