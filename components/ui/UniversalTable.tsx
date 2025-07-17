import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput } from 'react-native';
import { globalStyles, tableStyles } from '@/styles';
import { Ionicons } from '@expo/vector-icons';

export interface TableColumn {
  key: string;
  title: string;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  editType?: 'text' | 'number' | 'select' | 'date';
  selectOptions?: string[];
  render?: (value: any, row: any, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  onEdit?: (row: any, newValue: any) => Promise<void> | void;
}

export interface TableAction {
  icon: string;
  label: string;
  onPress: (row: any) => void;
  color?: string;
  visible?: (row: any) => boolean;
}

interface UniversalTableProps<T = any> {
  data: T[];
  columns: TableColumn[];
  actions?: TableAction[];
  onRowPress?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T) => string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => Promise<void>;
  alternateRowColors?: boolean;
  maxHeight?: number;
  stickyHeader?: boolean;
  horizontal?: boolean;
}

export const UniversalTable = <T extends Record<string, any>>({
  data = [],
  columns = [],
  actions = [],
  onRowPress,
  loading = false,
  emptyMessage = 'No data available',
  keyExtractor = (item) => item.id || Math.random().toString(),
  sortable = true,
  filterable = false,
  searchable = false,
  refreshable = false,
  onRefresh,
  alternateRowColors = true,
  maxHeight,
  stickyHeader = true,
  horizontal = false,
}: UniversalTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState<{rowId: string, columnKey: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectDropdownOpen, setSelectDropdownOpen] = useState<string | null>(null);

  // Sorting logic
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(current => ({
      key: columnKey,
      direction: current?.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter logic
  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [columnKey]: value }));
    setActiveFilter(null);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Get unique values for filter dropdown
  const getUniqueValues = (columnKey: string) => {
    return [...new Set(data.map(item => item[columnKey]).filter(Boolean))].sort();
  };

  // Inline editing functions
  const startEdit = (row: T, column: TableColumn) => {
    const cellId = `${keyExtractor(row)}-${column.key}`;
    setEditingCell({ rowId: keyExtractor(row), columnKey: column.key });
    setEditValue(String(row[column.key] || ''));
    setSelectDropdownOpen(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
    setSelectDropdownOpen(null);
  };

  const saveEdit = async (row: T, column: TableColumn) => {
    if (!column.onEdit) return;
    
    try {
      let finalValue: any = editValue;
      
      // Convert value based on editType
      if (column.editType === 'number') {
        finalValue = parseFloat(editValue) || 0;
      }
      
      await column.onEdit(row, finalValue);
      setEditingCell(null);
      setEditValue('');
    } catch (error) {
      console.error('Error saving edit:', error);
      // You might want to show an error message here
    }
  };

  // Render editable cell
  const renderEditableCell = (value: any, row: T, column: TableColumn) => {
    const rowId = keyExtractor(row);
    const isEditing = editingCell?.rowId === rowId && editingCell?.columnKey === column.key;
    
    if (isEditing) {
      if (column.editType === 'select' && column.selectOptions) {
        return (
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={{
                padding: 8,
                backgroundColor: '#f0f8ff',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#007AFF',
                minHeight: 36,
                justifyContent: 'center'
              }}
              onPress={() => setSelectDropdownOpen(selectDropdownOpen === rowId ? null : rowId)}
            >
              <Text style={{ fontSize: 14, color: '#007AFF' }}>
                {editValue || 'Select...'}
              </Text>
            </TouchableOpacity>
            
            {selectDropdownOpen === rowId && (
              <View style={{
                position: 'absolute',
                top: 40,
                left: 0,
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#E5E5EA',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                zIndex: 1000,
                maxHeight: 200
              }}>
                <ScrollView>
                  {column.selectOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}
                      onPress={() => {
                        setEditValue(option);
                        setSelectDropdownOpen(null);
                        saveEdit(row, column);
                      }}
                    >
                      <Text style={{ fontSize: 14, color: editValue === option ? '#007AFF' : '#333' }}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );
      }
      
      // Text/Number input
      return (
        <TextInput
          value={editValue}
          onChangeText={setEditValue}
          onBlur={() => saveEdit(row, column)}
          onSubmitEditing={() => saveEdit(row, column)}
          autoFocus
          keyboardType={column.editType === 'number' ? 'numeric' : 'default'}
          style={{
            fontSize: 14,
            padding: 8,
            backgroundColor: '#f0f8ff',
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#007AFF',
            minHeight: 36,
            color: '#333'
          }}
        />
      );
    }

    // Display mode - show as editable if column is editable
    if (column.editable && column.onEdit) {
      return (
        <TouchableOpacity
          onPress={() => startEdit(row, column)}
          style={{ 
            flex: 1, 
            minHeight: 36, 
            justifyContent: 'center',
            paddingVertical: 4
          }}
        >
          <Text style={[
            tableStyles.tableCellText, 
            { color: '#007AFF', textDecorationLine: 'underline' }
          ]}>
            {String(value || 'Tap to edit')}
          </Text>
        </TouchableOpacity>
      );
    }

    // Regular cell - not editable
    return column.render ? column.render(value, row, 0) : (
      <Text style={tableStyles.tableCellText}>
        {String(value || '')}
      </Text>
    );
  };

  // Process data (sort, filter, search)
  const processedData = React.useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchable) {
      result = result.filter(item =>
        columns.some(col => 
          String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => 
          String(item[key] || '').toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig, columns]);

  // Render filter button
  const renderFilterButton = (column: TableColumn) => {
    if (!column.filterable || !filterable) return null;
    
    const uniqueValues = getUniqueValues(column.key);
    const currentValue = filters[column.key] || '';
    const isActive = activeFilter === column.key;
    
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={{
            marginLeft: 8,
            padding: 4,
            borderRadius: 4,
            backgroundColor: currentValue ? '#007AFF' : '#E5E5EA'
          }}
          onPress={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            setDropdownPosition({
              top: pageY + 30,
              left: Math.max(20, pageX - 90)
            });
            setActiveFilter(isActive ? null : column.key);
          }}
        >
          <Ionicons 
            name="filter" 
            size={12} 
            color={currentValue ? '#FFFFFF' : '#8E8E93'} 
          />
        </TouchableOpacity>
        
        {isActive && (
          <Modal 
            transparent 
            animationType="none" 
            visible={isActive}
            onRequestClose={() => setActiveFilter(null)}
          >
            <TouchableOpacity 
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}
              activeOpacity={1}
              onPress={() => setActiveFilter(null)}
            >
              <View 
                style={{
                  position: 'absolute',
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 12,
                  minWidth: 180,
                  maxHeight: 300,
                  borderWidth: 1,
                  borderColor: '#E5E5EA',
                }}
                onStartShouldSetResponder={() => true}
              >
                <TouchableOpacity
                  style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}
                  onPress={() => handleFilterChange(column.key, '')}
                >
                  <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: !currentValue ? '600' : 'normal' }}>
                    All {column.title}
                  </Text>
                </TouchableOpacity>
                <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
                  {uniqueValues.map((value) => (
                    <TouchableOpacity
                      key={String(value)}
                      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}
                      onPress={() => handleFilterChange(column.key, value)}
                    >
                      <Text style={{ 
                        fontSize: 14, 
                        color: currentValue === value ? '#007AFF' : '#333',
                        fontWeight: currentValue === value ? '600' : 'normal'
                      }}>
                        {String(value)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  };

  // Render table header
  const renderHeader = () => (
    <View style={tableStyles.tableHeader}>
      {columns.map((column, index) => (
        <View 
          key={column.key}
          style={[
            tableStyles.tableHeaderCell,
            { flex: column.flex || 1 },
            index === columns.length - 1 && tableStyles.tableHeaderCellLast
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              onPress={() => handleSort(column.key)}
              disabled={!column.sortable || !sortable}
            >
              <Text style={tableStyles.tableHeaderText}>{column.title}</Text>
              {sortable && column.sortable && sortConfig?.key === column.key && (
                <Ionicons 
                  name={sortConfig.direction === 'asc' ? 'chevron-up' : 'chevron-down'} 
                  size={14} 
                  color="#666" 
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>
            {renderFilterButton(column)}
          </View>
        </View>
      ))}
      {actions && actions.length > 0 && (
        <View style={[tableStyles.tableHeaderCell, tableStyles.tableHeaderCellLast, { flex: 1 }]}>
          <Text style={tableStyles.tableHeaderText}>Actions</Text>
        </View>
      )}
    </View>
  );

  // Render table row
  const renderRow = ({ item, index }: { item: T; index: number }) => {
    const isEven = index % 2 === 0;
    const rowStyle = [
      tableStyles.tableRow,
      alternateRowColors && (isEven ? tableStyles.tableRowEven : tableStyles.tableRowOdd),
      index === processedData.length - 1 && tableStyles.tableRowLast
    ];

    // Use View instead of TouchableOpacity to prevent interference with action buttons
    const RowContainer = onRowPress ? TouchableOpacity : View;
    
    return (
      <RowContainer
        style={rowStyle}
        onPress={onRowPress ? () => onRowPress(item) : undefined}
        activeOpacity={onRowPress ? 0.7 : 1}
      >
        {columns.map((column, colIndex) => (
          <View 
            key={column.key}
            style={[
              tableStyles.tableCell,
              { flex: column.flex || 1 },
              colIndex === columns.length - 1 && !actions?.length && tableStyles.tableCellLast
            ]}
          >
            {renderEditableCell(item[column.key], item, column)}
          </View>
        ))}
        
        {actions && actions.length > 0 && (
          <View style={[tableStyles.tableCell, tableStyles.tableCellLast, tableStyles.actionsCell, { flex: 1 }]}>
            <View 
              style={tableStyles.tableActions}
              onStartShouldSetResponder={() => true} // Prevent row press when touching actions
            >
              {actions.map((action, actionIndex) => {
                if (action.visible && !action.visible(item)) return null;
                
                return (
                  <TouchableOpacity
                    key={actionIndex}
                    style={[
                      globalStyles.iconButton,
                      { backgroundColor: action.color || '#007AFF' },
                      actionIndex < actions.length - 1 && globalStyles.actionButtonSpacing
                    ]}
                    onPress={(e) => {
                      e.stopPropagation(); // Prevent row press
                      action.onPress(item);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={action.icon as any} size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </RowContainer>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={{ padding: 40, alignItems: 'center' }}>
      <Ionicons name="document-outline" size={48} color="#C7C7CC" />
      <Text style={[tableStyles.tableCellText, { color: '#666', marginTop: 16, textAlign: 'center' }]}>
        {emptyMessage}
      </Text>
    </View>
  );

  const hasActiveFilters = Object.values(filters).some(f => f !== '') || searchTerm !== '';

  return (
    <View style={[tableStyles.table, maxHeight ? { maxHeight } : undefined]}>
      {/* Filter Controls */}
      {hasActiveFilters && (
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'flex-end', 
          paddingHorizontal: 8, 
          paddingVertical: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5EA'
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF3B30',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center'
            }}
            onPress={clearAllFilters}
          >
            <Ionicons name="close" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '500' }}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Table Content */}
      <View style={{ flex: 1 }}>
        {stickyHeader && renderHeader()}
        
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={tableStyles.tableCellText}>Loading...</Text>
          </View>
        ) : processedData.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={processedData}
            renderItem={renderRow}
            keyExtractor={keyExtractor}
            ListHeaderComponent={!stickyHeader ? renderHeader : undefined}
            stickyHeaderIndices={!stickyHeader ? [0] : undefined}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={horizontal}
          />
        )}
      </View>
    </View>
  );
};

export default UniversalTable;
