
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css'; 
import React from "react";

import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,   // 2 мин — НЕ обращаться к серверу
      cacheTime: 10 * 60 * 1000,  // 10 мин — хранить недавно использованные
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(<QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  );
