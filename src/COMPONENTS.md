# Global Components Guide

## UI Components

### Button
```jsx
import { Button } from './components/ui';

<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>

<Button variant="secondary" loading={true}>
  Loading...
</Button>

<Button variant="danger" icon={<TrashIcon />}>
  Delete
</Button>
```

### Input
```jsx
import { Input } from './components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
/>
```

### Select
```jsx
import { Select } from './components/ui';

<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
  value={status}
  onChange={(e) => setStatus(e.target.value)}
/>
```

### Checkbox
```jsx
import { Checkbox } from './components/ui';

<Checkbox
  label="Remember me"
  checked={remember}
  onChange={(e) => setRemember(e.target.checked)}
/>
```

### Radio
```jsx
import { Radio } from './components/ui';

<Radio
  label="Option 1"
  name="options"
  value="option1"
  checked={selected === 'option1'}
  onChange={(e) => setSelected(e.target.value)}
/>
```

### Modal
```jsx
import { Modal } from './components/ui';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

### Toast (via useToast hook)
```jsx
import { useToast } from './hooks';

const toast = useToast();

toast.success('Task created successfully');
toast.error('Failed to save changes');
toast.warning('Please fill all fields');
toast.info('New updates available');
```

### Card
```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui';

<Card>
  <CardHeader>
    <CardTitle>Task Details</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Badge
```jsx
import { Badge } from './components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="danger">Urgent</Badge>
<Badge variant="primary">In Progress</Badge>
```

### Avatar
```jsx
import { Avatar, AvatarGroup } from './components/ui';

<Avatar src="/user.jpg" name="John Doe" size="md" />

<AvatarGroup
  avatars={[
    { src: '/user1.jpg', name: 'User 1' },
    { src: '/user2.jpg', name: 'User 2' },
    { src: '/user3.jpg', name: 'User 3' }
  ]}
  max={3}
/>
```

## Common Components

### DataTable
```jsx
import { DataTable } from './components/common';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status', render: (value) => <Badge>{value}</Badge> }
];

const data = [
  { id: 1, name: 'Task 1', status: 'Active' },
  { id: 2, name: 'Task 2', status: 'Done' }
];

<DataTable
  columns={columns}
  data={data}
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

### Pagination
```jsx
import { Pagination } from './components/common';

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
  totalItems={100}
  pageSize={10}
/>
```

### SearchBar
```jsx
import { SearchBar } from './components/common';

<SearchBar
  value={searchQuery}
  onChange={(value) => setSearchQuery(value)}
  onClear={() => setSearchQuery('')}
  placeholder="Search tasks..."
/>
```

## Custom Hooks

### useDebounce
```jsx
import { useDebounce } from './hooks';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // This will only trigger 300ms after user stops typing
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

### useLocalStorage
```jsx
import { useLocalStorage } from './hooks';

const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### useModal
```jsx
import { useModal } from './hooks';

const modal = useModal();

modal.openModal({
  component: ConfirmModal,
  props: {
    message: 'Are you sure?',
    onConfirm: handleConfirm
  }
});
```

## Import Shortcuts

```jsx
// Import all UI components
import { Button, Input, Modal, Card } from './components/ui';

// Import all common components
import { DataTable, Pagination, SearchBar } from './components/common';

// Import all hooks
import { useToast, useModal, useDebounce } from './hooks';
```
