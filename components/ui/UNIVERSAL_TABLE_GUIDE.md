# Universal Table Component - Usage Guide

## Overview

The `UniversalTable` component is a comprehensive, reusable table solution that leverages your existing table styles and provides consistent functionality across your NorskkManage app.

## Key Features

✅ **Consistent Styling** - Uses your existing `tableStyles.ts`  
✅ **Cross-Platform** - Works perfectly on mobile and web  
✅ **Performance** - Built with FlatList for efficient rendering  
✅ **Sorting** - Click headers to sort data  
✅ **Filtering** - Filter by column values  
✅ **Search** - Global search across all columns  
✅ **Actions** - Customizable row actions  
✅ **TypeScript** - Full type safety  
✅ **Responsive** - Flexible column sizing  

## Installation

The component is already created and uses libraries you already have installed:
- `react-native` (FlatList, Modal, etc.)
- `@expo/vector-icons` (for icons)
- Your existing styles from `@/styles`

## Basic Usage

```tsx
import { UniversalTable, TableColumn } from '@/components/ui/UniversalTable';

const columns: TableColumn[] = [
  { key: 'name', title: 'Name', flex: 2, sortable: true, filterable: true },
  { key: 'status', title: 'Status', flex: 1, sortable: true },
];

const data = [
  { id: '1', name: 'John Doe', status: 'Active' },
  { id: '2', name: 'Jane Smith', status: 'Inactive' },
];

<UniversalTable
  data={data}
  columns={columns}
  sortable={true}
  filterable={true}
/>
```

## Column Configuration

### Basic Column
```tsx
{
  key: 'name',        // Data property key
  title: 'Full Name', // Header display text
  flex: 2,           // Column width ratio
  sortable: true,    // Enable sorting
  filterable: true,  // Enable filtering
}
```

### Custom Render Column
```tsx
{
  key: 'status',
  title: 'Status',
  flex: 1,
  render: (value, row, index) => (
    <View style={globalStyles.statusBadge}>
      <Text style={globalStyles.statusText}>{value}</Text>
    </View>
  )
}
```

## Actions Configuration

```tsx
const actions: TableAction[] = [
  {
    icon: 'pencil',
    label: 'Edit',
    onPress: (row) => editItem(row),
    color: '#007AFF'
  },
  {
    icon: 'trash',
    label: 'Delete',
    onPress: (row) => deleteItem(row),
    color: '#FF3B30',
    visible: (row) => row.canDelete // Optional visibility condition
  }
];
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | `[]` | Array of data objects |
| `columns` | `TableColumn[]` | `[]` | Column configuration |
| `actions` | `TableAction[]` | `[]` | Row actions |
| `onRowPress` | `(row: T) => void` | `undefined` | Row press handler |
| `loading` | `boolean` | `false` | Show loading state |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `sortable` | `boolean` | `true` | Enable sorting |
| `filterable` | `boolean` | `false` | Enable filtering |
| `searchable` | `boolean` | `false` | Enable search |
| `alternateRowColors` | `boolean` | `true` | Alternate row colors |
| `maxHeight` | `number` | `undefined` | Max table height |
| `stickyHeader` | `boolean` | `true` | Sticky header |

## Real-World Examples

### 1. Equipment Management
```tsx
const equipmentColumns: TableColumn[] = [
  {
    key: 'name',
    title: 'Equipment',
    flex: 2,
    sortable: true,
    filterable: true,
    render: (value, row) => (
      <View>
        <Text style={[globalStyles.tableCellText, { fontWeight: '600' }]}>
          {value}
        </Text>
        <Text style={globalStyles.tableSubText}>S/N: {row.serialNumber}</Text>
      </View>
    )
  },
  {
    key: 'status',
    title: 'Status',
    flex: 1,
    sortable: true,
    filterable: true,
    render: (value) => (
      <View style={[
        globalStyles.statusBadge,
        value === 'Active' ? globalStyles.statusCompleted : globalStyles.statusUpcoming
      ]}>
        <Text style={globalStyles.statusText}>{value}</Text>
      </View>
    )
  }
];

const equipmentActions: TableAction[] = [
  {
    icon: 'pencil',
    label: 'Edit',
    onPress: (row) => navigation.navigate('EditEquipment', { id: row.id }),
  },
  {
    icon: 'build',
    label: 'Maintenance',
    onPress: (row) => scheduleMaintenace(row),
    color: '#FF9500'
  }
];
```

### 2. Time Tracking
```tsx
const timecardColumns: TableColumn[] = [
  { key: 'date', title: 'Date', flex: 1.5, sortable: true, filterable: true },
  { key: 'employee', title: 'Employee', flex: 2, sortable: true, filterable: true },
  { key: 'project', title: 'Project', flex: 2, sortable: true, filterable: true },
  { 
    key: 'hours', 
    title: 'Hours', 
    flex: 1, 
    sortable: true,
    render: (value) => <Text>{value.toFixed(1)}</Text>
  },
  {
    key: 'status',
    title: 'Status',
    flex: 1.5,
    sortable: true,
    filterable: true,
    render: (value, row) => (
      <View>
        {renderStatusBadge(value)}
        {row.approved && (
          <Text style={globalStyles.tableCellSubtext}>
            by {row.approvedBy}
          </Text>
        )}
      </View>
    )
  }
];
```

### 3. Project Management
```tsx
const projectColumns: TableColumn[] = [
  {
    key: 'name',
    title: 'Project',
    flex: 2.5,
    sortable: true,
    filterable: true,
    render: (value, row) => (
      <TouchableOpacity onPress={() => openProject(row.id)}>
        <Text style={[globalStyles.tableCellText, { fontWeight: '600', color: '#007AFF' }]}>
          {value}
        </Text>
        <Text style={globalStyles.tableSubText}>{row.location}</Text>
      </TouchableOpacity>
    )
  },
  {
    key: 'budget',
    title: 'Budget',
    flex: 1.5,
    sortable: true,
    render: (value) => (
      <Text style={globalStyles.tableCellText}>
        ${value.toLocaleString()}
      </Text>
    )
  },
  {
    key: 'completion',
    title: 'Progress',
    flex: 1.5,
    render: (value) => (
      <View>
        <Text style={globalStyles.tableCellText}>{value}%</Text>
        <View style={globalStyles.progressBar}>
          <View style={[globalStyles.progressFill, { width: `${value}%` }]} />
        </View>
      </View>
    )
  }
];
```

## Best Practices

### 1. Use Consistent Column Ratios
```tsx
// Good: Total flex adds up to reasonable number
{ key: 'name', flex: 2 },      // 2/6 = 33%
{ key: 'status', flex: 1 },    // 1/6 = 17%
{ key: 'date', flex: 1.5 },    // 1.5/6 = 25%
{ key: 'actions', flex: 1.5 }  // 1.5/6 = 25%
```

### 2. Optimize Performance for Large Datasets
```tsx
<UniversalTable
  data={largeDataset}
  maxHeight={400}  // Limit height for scrolling
  keyExtractor={(item) => item.id} // Ensure unique keys
/>
```

### 3. Use Type Safety
```tsx
interface Employee {
  id: string;
  name: string;
  role: string;
}

// Full type safety
<UniversalTable<Employee>
  data={employees}
  columns={columns}
  onRowPress={(employee) => console.log(employee.name)} // TypeScript knows this is Employee
/>
```

## Replacing Existing Tables

### Replace TimecardTable
```tsx
// Old
<TimecardTable
  timecards={timecards}
  onEdit={handleEdit}
  onDelete={handleDelete}
  // ... lots of props
/>

// New
<UniversalTable
  data={timecards}
  columns={timecardColumns}
  actions={timecardActions}
  sortable={true}
  filterable={true}
/>
```

### Replace Equipment Table
```tsx
// Old - Custom implementation with lots of code

// New - Clean and consistent
<UniversalTable
  data={equipment}
  columns={equipmentColumns}
  actions={equipmentActions}
  onRowPress={(item) => navigation.navigate('EquipmentDetail', { id: item.id })}
/>
```

## Migration Strategy

1. **Phase 1**: Use UniversalTable for new tables
2. **Phase 2**: Replace simple tables first  
3. **Phase 3**: Migrate complex tables like TimecardTable
4. **Phase 4**: Remove old table components

## Customization

### Adding New Features
The component is designed to be extended. You can add:
- Export functionality
- Bulk actions
- Row selection
- Drag and drop reordering
- Custom footer

### Styling
All styling uses your existing `tableStyles.ts` and `globalStyles`, ensuring consistency across the app.

## Summary

The `UniversalTable` gives you:
- ✅ **Consistency** across all tables
- ✅ **Performance** with FlatList
- ✅ **Features** like sorting, filtering, actions
- ✅ **Type Safety** with TypeScript
- ✅ **Maintainability** with single component
- ✅ **Cross-platform** compatibility

Use this component for all future tables and gradually migrate existing ones for a consistent, professional data display experience.
