import { gooeyToast } from 'goey-toast';

export function ToastProvider({ children }) {
  // ToastProvider is now a no-op since goey-toast is global
  return <>{children}</>;
}

export function useToast() {
  return gooeyToast;
}
