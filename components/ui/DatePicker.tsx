import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '@/styles';

// Import CSS for web
if (Platform.OS === 'web') {
  require('./DatePicker.css');
}

interface DatePickerProps {
  value: Date | null;
  onDateChange: (date: Date) => void;
  onBlur?: () => void;
  placeholder?: string;
  style?: any;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  onBlur,
  placeholder = 'Select date',
  style,
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      onDateChange(selectedDate);
    }
    
    if (Platform.OS === 'ios') {
      setShowPicker(false);
    }
  };

  if (Platform.OS === 'web') {
    // For web, use HTML5 date input with CSS classes
    return (
      <View style={style}>
        <input
          type="date"
          value={value ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            if (e.target.value) {
              onDateChange(new Date(e.target.value));
            }
          }}
          onBlur={() => {
            if (onBlur) {
              onBlur();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={placeholder}
          className="date-picker-input"
        />
      </View>
    );
  }

  // For mobile platforms
  return (
    <View style={style}>
      <TouchableOpacity
        style={[
          globalStyles.input,
          {
            justifyContent: 'center',
            backgroundColor: disabled ? '#f5f5f5' : 'white',
          },
        ]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Text
          style={{
            color: value ? (disabled ? '#888' : '#000') : '#999',
            fontSize: 16,
          }}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker}
          onRequestClose={() => {
            setShowPicker(false);
            if (onBlur) {
              onBlur();
            }
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            activeOpacity={1}
            onPress={() => {
              setShowPicker(false);
              if (onBlur) {
                onBlur();
              }
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}} // Prevent closing when touching inside the modal
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 20,
                margin: 20,
                maxWidth: 300,
                width: '80%',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                Select Date
              </Text>

              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateSelect}
                style={{ width: '100%' }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}
              >
                <Pressable
                  style={[
                    globalStyles.secondaryButton,
                    { flex: 1, marginRight: 10 },
                  ]}
                  onPress={() => {
                    setShowPicker(false);
                    if (onBlur) {
                      onBlur();
                    }
                  }}
                >
                  <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[globalStyles.primaryButton, { flex: 1, marginLeft: 10 }]}
                  onPress={() => {
                    setShowPicker(false);
                  }}
                >
                  <Text style={globalStyles.primaryButtonText}>Done</Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};
