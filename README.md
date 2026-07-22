# Orbis CRM

![Orbis CRM Dashboard Mockup](frontend/public/img/mockup/mockup_login.png)

Modern CRM (Customer Relationship Management) application.
This project is structured as a monorepo containing both the frontend and (in the future) the backend services.

## Project Structure

- `/frontend` - React application built with Vite and Tailwind CSS.
- `/backend` - (To be added) Backend services.

## Getting Started

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used (Frontend)

- React 18 & Vite
- Tailwind CSS
- React Router DOM
- **Framer Motion & Goey Toast** (for animated toasts)
- Phosphor Icons / Lucide React

## Notifications (Goey Toast)

This project uses [goey-toast](https://github.com/goey-toast) for all notifications to provide a premium, smooth morphing animation.

**Example Usage:**
```jsx
import { useToast } from '../context/ToastContext';

// Inside your component
const toast = useToast();

toast.success('Data saved successfully!');
toast.error('Failed to connect to the server.');
```

## License
MIT
