import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { globalStyles } from '@/styles';
import { CustomDropdown } from './CustomDropdown';

interface PayPeriod {
  label: string;
  start: string;
  end: string;
}

interface DateSelectorProps {
  viewMode: 'payPeriod' | 'month' | 'customRange';
  onViewModeChange: (mode: 'payPeriod' | 'month' | 'customRange') => void;
  selectedPayPeriod: PayPeriod;
  onPayPeriodChange: (period: PayPeriod) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  customRange: { start: string; end: string };
  onCustomRangeChange: (range: { start: string; end: string }) => void;
  payPeriods: PayPeriod[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  viewMode,
  onViewModeChange,
  selectedPayPeriod,
  onPayPeriodChange,
  selectedMonth,
  onMonthChange,
  customRange,
  onCustomRangeChange,
  payPeriods
}) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>
          Date Range:
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {['payPeriod', 'month', 'customRange'].map((mode, index) => (
            <TouchableOpacity
              key={mode}
              style={[
                {
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  marginLeft: index > 0 ? 8 : 0,
                  backgroundColor: viewMode === mode ? '#007AFF' : '#E5E5EA'
                },
              ]}
              onPress={() => onViewModeChange(mode as 'payPeriod' | 'month' | 'customRange')}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: viewMode === mode ? '#FFFFFF' : '#666'
              }}>
                {mode === 'payPeriod' ? 'Pay Period' : mode === 'month' ? 'Month' : 'Custom'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date Selection Controls */}
      {viewMode === 'payPeriod' && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#666', marginRight: 8, minWidth: 80 }}>
            Pay Period:
          </Text>
          <View style={{ flex: 1 }}>
            <CustomDropdown
              value={selectedPayPeriod.label}
              onChange={(value) => {
                const period = payPeriods.find(p => p.label === value);
                if (period) onPayPeriodChange(period);
              }}
              options={payPeriods.map(p => ({ label: p.label, value: p.label }))}
              placeholder="Select pay period"
            />
          </View>
        </View>
      )}

      {viewMode === 'month' && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#666', marginRight: 8, minWidth: 80 }}>
            Month:
          </Text>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[globalStyles.input, { marginBottom: 0 }]}
              value={selectedMonth}
              onChangeText={onMonthChange}
              placeholder="YYYY-MM"
            />
          </View>
        </View>
      )}

      {viewMode === 'customRange' && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#666', marginRight: 8, minWidth: 80 }}>
            Range:
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[globalStyles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
              value={customRange.start}
              onChangeText={(value) => onCustomRangeChange({ ...customRange, start: value })}
              placeholder="Start Date"
            />
            <Text style={{ fontSize: 12, color: '#666', paddingHorizontal: 4 }}>to</Text>
            <TextInput
              style={[globalStyles.input, { flex: 1, marginBottom: 0, marginLeft: 8 }]}
              value={customRange.end}
              onChangeText={(value) => onCustomRangeChange({ ...customRange, end: value })}
              placeholder="End Date"
            />
          </View>
        </View>
      )}
    </View>
  );
};
