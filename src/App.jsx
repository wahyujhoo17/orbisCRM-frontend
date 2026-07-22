import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <AppRoutes />
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}