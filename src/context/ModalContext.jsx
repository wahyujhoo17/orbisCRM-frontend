import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modal) => {
    const id = Date.now() + Math.random();
    setModals((prev) => [...prev, { ...modal, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map((modal) => (
        <modal.component
          key={modal.id}
          onClose={() => closeModal(modal.id)}
          {...modal.props}
        />
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
