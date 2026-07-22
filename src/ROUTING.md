# Routing Guide

## Overview
React Router v6 telah di-setup dengan struktur yang proper dan siap digunakan.

## Struktur Routes

### Public Routes
- `/login` - Halaman login

### Protected Routes (dengan AppLayout)
- `/` - Redirect ke `/dashboard`
- `/dashboard` - Dashboard utama
- `/tasks` - List tasks
- `/tasks/:taskId` - Detail task
- `/contacts` - List contacts
- `/companies` - List companies
- `/deals` - List deals
- `/reports` - Reports & analytics
- `/settings` - Settings umum
- `/settings/:section` - Settings dengan section spesifik

### 404
- `*` - Halaman not found

## Cara Menggunakan

### Navigasi Programmatic
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/tasks')}>
      Go to Tasks
    </button>
  );
}
```

### Link Component
```jsx
import { Link } from 'react-router-dom';

<Link to="/dashboard">Dashboard</Link>
<Link to={`/tasks/${taskId}`}>View Task</Link>
```

### Mendapatkan Parameter
```jsx
import { useParams } from 'react-router-dom';

function TaskDetail() {
  const { taskId } = useParams();
  return <div>Task ID: {taskId}</div>;
}
```

### Mendapatkan Current Location
```jsx
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  console.log(location.pathname); // '/dashboard'
}
```

## Authentication Flow

1. User mengakses protected route
2. `ProtectedRoute` component cek `localStorage.getItem('auth_token')`
3. Jika tidak ada token → redirect ke `/login`
4. Jika ada token → render AppLayout dengan Outlet

### Login
```jsx
// Setelah login berhasil
localStorage.setItem('auth_token', 'your_token_here');
navigate('/dashboard');
```

### Logout
```jsx
localStorage.removeItem('auth_token');
navigate('/login');
```

## Menambah Route Baru

### 1. Buat Page Component
```jsx
// src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

### 2. Tambahkan di routes/index.jsx
```jsx
// Lazy load
const NewPage = lazy(() => import('../pages/NewPage'));

// Tambahkan route
<Route path="/new-page" element={<NewPage />} />
```

### 3. Update Sidebar (jika perlu)
```jsx
// src/components/layout/Sidebar.jsx
const getRoutePath = (name) => {
  const routes = {
    // ... existing routes
    'New Page': '/new-page'
  };
  return routes[name] || '#';
};
```

## Active State di Sidebar

Sidebar otomatis mendeteksi active state berdasarkan `location.pathname`:
```jsx
const isActive = location.pathname === routePath || 
                 location.pathname.startsWith(routePath + '/');
```

## Nested Routes

Untuk nested routes, gunakan struktur seperti ini:
```jsx
<Route path="/settings" element={<Settings />}>
  <Route path="profile" element={<ProfileSettings />} />
  <Route path="notifications" element={<NotificationSettings />} />
</Route>
```

## Query Parameters

```jsx
import { useSearchParams } from 'react-router-dom';

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  
  return (
    <button onClick={() => setSearchParams({ filter: 'active' })}>
      Filter Active
    </button>
  );
}
```

## Route Guards (Advanced)

Untuk custom route guards:
```jsx
function AdminRoute({ children }) {
  const user = getUser();
  if (!user.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

// Usage
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  } 
/>
```

## Best Practices

1. **Lazy Loading** - Semua page di-lazy load untuk performance
2. **Protected Routes** - Gunakan `ProtectedRoute` wrapper untuk authenticated pages
3. **Active State** - Sidebar otomatis handle active state
4. **404 Handling** - Semua undefined routes redirect ke NotFound page
5. **Loading State** - Gunakan `LoadingSpinner` saat lazy loading

## Testing Routes

```jsx
import { MemoryRouter } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/dashboard']}>
    <App />
  </MemoryRouter>
);
```
