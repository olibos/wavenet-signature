import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import './app.css';
import './styles.scss';

const router = getRouter()
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
