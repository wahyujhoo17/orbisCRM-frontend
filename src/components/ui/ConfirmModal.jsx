import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  isLoading = false
}) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
          <Trash2 className="h-5 w-5 text-rose-600" aria-hidden="true" />
        </div>;
      case 'warning':
        return <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
        </div>;
      case 'info':
      default:
        return <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
          <Info className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        </div>;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'danger': return 'danger';
      case 'warning': return 'secondary'; // Or a custom warning variant if exists
      case 'info':
      default: return 'primary';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? undefined : onClose} size="sm" showCloseButton={false}>
      <div className="sm:flex sm:items-start p-2">
        {getIcon()}
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
          <h3 className="text-base font-semibold leading-6 text-stone-900" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-stone-500">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
        <Button
          variant={getConfirmButtonVariant()}
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="mt-3 sm:mt-0 w-full sm:w-auto"
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}
