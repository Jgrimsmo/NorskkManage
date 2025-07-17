import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import { globalStyles } from '@/styles';
import { Ionicons } from '@expo/vector-icons';

interface Timecard {
  id: string;
  date: string;
  employee: string;
  project: string;
  equipment: string;
  costCode: string;
  workType: string;
  hours: number;
  notes: string;
  status: string;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: string;
  createdBy: string;
  createdDate: string;
}

interface TimecardTableProps {
  timecards: Timecard[];
  onEdit: (timecard: Timecard) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  currentUser?: any;
  isManager: boolean;
  filters?: {
    date: string;
    employee: string;
    project: string;
    equipment: string;
    costCode: string;
    workType: string;
    status: string;
  };
  onFiltersChange?: (filters: any) => void;
}

export const TimecardTable: React.FC<TimecardTableProps> = ({
  timecards,
  onEdit,
  onDelete,
  onApprove,
  onStatusChange,
  currentUser,
  isManager,
  filters = { date: '', employee: '', project: '', equipment: '', costCode: '', workType: '', status: '' },
  onFiltersChange
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  // Available status options
  const statusOptions = ['draft', 'submitted', 'approved', 'rejected'];

  // Close dropdown when filters change externally
  useEffect(() => {
    setActiveFilter(null);
    setStatusDropdownOpen(null);
  }, [filters]);

  // Get unique values for filter dropdowns
  const getUniqueValues = (field: keyof Timecard) => {
    return [...new Set(timecards.map(tc => tc[field]).filter(Boolean))].sort();
  };

  const handleFilterChange = (field: string, value: string) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, [field]: value });
    }
    // Force close the dropdown
    setActiveFilter(null);
  };

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        date: '', employee: '', project: '', equipment: '', 
        costCode: '', workType: '', status: ''
      });
    }
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const openFilter = (field: string, event: any) => {
    // Get the button position for better dropdown placement
    if (event?.nativeEvent) {
      const { pageX, pageY } = event.nativeEvent;
      setDropdownPosition({
        top: pageY + 30,
        left: Math.max(20, pageX - 90) // Ensure it doesn't go off screen
      });
    } else {
      // Fallback positioning
      setDropdownPosition({ top: 120, left: 20 });
    }
    setActiveFilter(activeFilter === field ? null : field);
  };

  const getFilterDisplayName = (field: string) => {
    switch (field) {
      case 'date': return 'Dates';
      case 'employee': return 'Employees';
      case 'project': return 'Projects';
      case 'equipment': return 'Equipment';
      case 'costCode': return 'Cost Codes';
      case 'workType': return 'Work Types';
      case 'status': return 'Statuses';
      default: return 'Items';
    }
  };

  const renderFilterButton = (field: string, currentValue: string) => {
    const uniqueValues = getUniqueValues(field as keyof Timecard);
    const isActive = activeFilter === field;
    
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={{
            marginLeft: 8,
            padding: 4,
            borderRadius: 4,
            backgroundColor: currentValue ? '#007AFF' : '#E5E5EA'
          }}
          onPress={(event) => openFilter(field, event)}
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
                  onPress={() => handleFilterChange(field, '')}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: currentValue ? 'normal' : '600' }}>
                    All {getFilterDisplayName(field)}
                  </Text>
                </TouchableOpacity>
                <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
                  {uniqueValues.map((value) => (
                    <TouchableOpacity
                      key={String(value)}
                      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}
                      onPress={() => handleFilterChange(field, value as string)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ 
                        fontSize: 14, 
                        color: currentValue === value ? '#007AFF' : '#333',
                        fontWeight: currentValue === value ? '600' : 'normal'
                      }}>
                        {value}
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
  const renderTableHeader = () => (
    <View style={globalStyles.tableHeader}>
      <View style={[globalStyles.tableHeaderCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Date</Text>
        {onFiltersChange && renderFilterButton('date', filters.date)}
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Employee</Text>
        {onFiltersChange && renderFilterButton('employee', filters.employee)}
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Project</Text>
        {onFiltersChange && renderFilterButton('project', filters.project)}
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Equipment</Text>
        {onFiltersChange && renderFilterButton('equipment', filters.equipment)}
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Cost Code</Text>
        {onFiltersChange && renderFilterButton('costCode', filters.costCode)}
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Work Type</Text>
        {onFiltersChange && renderFilterButton('workType', filters.workType)}
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 1 }]}>
        <Text style={globalStyles.tableHeaderText}>Hours</Text>
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 2 }]}>
        <Text style={globalStyles.tableHeaderText}>Notes</Text>
      </View>
      <View style={[globalStyles.tableHeaderCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={globalStyles.tableHeaderText}>Status</Text>
        {onFiltersChange && renderFilterButton('status', filters.status)}
      </View>
      <View style={[globalStyles.tableHeaderCell, globalStyles.tableHeaderCellLast, { flex: 2 }]}>
        <Text style={globalStyles.tableHeaderText}>Actions</Text>
      </View>
    </View>
  );

  const renderStatusBadge = (timecard: Timecard) => {
    const { status, approved, id } = timecard;
    let badgeStyle: any = globalStyles.statusBadge;
    let statusText = status;

    if (approved) {
      badgeStyle = [globalStyles.statusBadge, globalStyles.statusCompleted];
      statusText = 'Approved';
    } else {
      switch (status) {
        case 'submitted':
          badgeStyle = [globalStyles.statusBadge, globalStyles.statusActive];
          break;
        case 'draft':
          badgeStyle = [globalStyles.statusBadge, globalStyles.statusUpcoming];
          break;
        case 'rejected':
          badgeStyle = [globalStyles.statusBadge, globalStyles.statusDelayed];
          break;
        default:
          badgeStyle = [globalStyles.statusBadge, globalStyles.statusUpcoming];
      }
    }

    const handleStatusChange = (newStatus: string) => {
      if (onStatusChange && !approved) {
        onStatusChange(id, newStatus);
      }
      setStatusDropdownOpen(null);
    };

    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={[
            badgeStyle,
            // Add visual indication for clickable status
            onStatusChange && !approved && {
              borderWidth: 1,
              borderColor: 'rgba(0, 122, 255, 0.3)'
            }
          ]}
          onPress={() => {
            if (onStatusChange && !approved) {
              setStatusDropdownOpen(statusDropdownOpen === id ? null : id);
            }
          }}
          disabled={approved || !onStatusChange}
          activeOpacity={onStatusChange && !approved ? 0.7 : 1}
        >
          <Text style={globalStyles.statusText}>{statusText}</Text>
          {onStatusChange && !approved && (
            <Ionicons 
              name="chevron-down" 
              size={12} 
              color={globalStyles.statusText.color} 
              style={{ marginLeft: 4 }} 
            />
          )}
        </TouchableOpacity>

        {/* Status Dropdown */}
        {statusDropdownOpen === id && onStatusChange && !approved && (
          <>
            {/* Overlay to catch outside clicks */}
            <Modal
              transparent
              animationType="none"
              visible={true}
              onRequestClose={() => setStatusDropdownOpen(null)}
            >
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'transparent' }}
                activeOpacity={1}
                onPress={() => setStatusDropdownOpen(null)}
              />
            </Modal>
            
            {/* Dropdown positioned relative to the badge */}
            <View style={{
              position: 'absolute',
              top: 32, // Position below the badge
              left: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#E5E5EA',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 10,
              zIndex: 9999,
              minWidth: 120,
              maxWidth: 150,
            }}>
              {statusOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: index < statusOptions.length - 1 ? 1 : 0,
                    borderBottomColor: '#f0f0f0',
                  }}
                  onPress={() => handleStatusChange(option)}
                >
                  <Text style={{
                    fontSize: 14,
                    color: status === option ? '#007AFF' : '#333',
                    fontWeight: status === option ? '600' : 'normal'
                  }}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  const renderTimecardRow = ({ item, index }: { item: Timecard; index: number }) => {
    const isEven = index % 2 === 0;
    const rowStyle = [
      globalStyles.tableRow,
      isEven ? globalStyles.tableRowEven : globalStyles.tableRowOdd,
      index === timecards.length - 1 ? globalStyles.tableRowLast : {}
    ];

    return (
      <View style={rowStyle}>
        <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
          <Text style={globalStyles.tableCellText}>{item.date}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 2 }]}>
          <Text style={globalStyles.tableCellText}>{item.employee}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 2 }]}>
          <Text style={globalStyles.tableCellText}>{item.project}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
          <Text style={globalStyles.tableCellText}>{item.equipment}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
          <Text style={globalStyles.tableCellText}>{item.costCode}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 1 }]}>
          <Text style={globalStyles.tableCellText}>{item.workType}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 1 }]}>
          <Text style={globalStyles.tableCellText}>{item.hours.toFixed(1)}</Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 2 }]}>
          <Text style={globalStyles.tableCellText} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
        <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
          {renderStatusBadge(item)}
          {item.approved && item.approvedBy && (
            <Text style={globalStyles.tableCellSubtext}>
              by {item.approvedBy}
            </Text>
          )}
        </View>
        <View style={[globalStyles.tableCell, globalStyles.tableCellLast, globalStyles.actionsCell, { flex: 2 }]}>
          <TouchableOpacity
            style={[globalStyles.iconButton, globalStyles.actionEditButton, globalStyles.actionButtonSpacing]}
            onPress={() => onEdit(item)}
          >
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          {!item.approved && isManager && (
            <TouchableOpacity
              style={[globalStyles.iconButton, globalStyles.actionViewButton, globalStyles.actionButtonSpacing]}
              onPress={() => onApprove(item.id)}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[globalStyles.iconButton, globalStyles.actionDeleteButton]}
            onPress={() => onDelete(item.id)}
          >
            <Ionicons name="trash" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.table}>
      <View style={{ flex: 1 }}>
        {hasActiveFilters() && onFiltersChange && (
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
                Clear All Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {renderTableHeader()}
        <FlatList
          data={timecards}
          renderItem={renderTimecardRow}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};
