import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/styles';

interface SwipeableTableRowProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  showApprove?: boolean;
  style?: any;
}

export const SwipeableTableRow: React.FC<SwipeableTableRowProps> = ({
  children,
  onEdit,
  onDelete,
  onApprove,
  showApprove = false,
  style
}) => {
  const translateX = new Animated.Value(0);
  const rowOpacity = new Animated.Value(1);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -100) {
        // Swipe left - show actions
        Animated.spring(translateX, {
          toValue: -120,
          useNativeDriver: true,
        }).start();
      } else if (translationX > 100 && onApprove && showApprove) {
        // Swipe right - approve action
        Animated.spring(translateX, {
          toValue: 120,
          useNativeDriver: true,
        }).start();
      } else {
        // Return to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      // Animate row out before deleting
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -400,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rowOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDelete();
      });
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 200,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onApprove();
      });
    }
  };

  return (
    <View style={[{ position: 'relative', overflow: 'hidden' }, style]}>
      {/* Action Buttons Background */}
      <View style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 10,
      }}>
        {onEdit && (
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              borderRadius: 8,
              padding: 12,
              marginRight: 8,
            }}
            onPress={onEdit}
          >
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: '#FF3B30',
            borderRadius: 8,
            padding: 12,
          }}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Approve Action (Left Side) */}
      {showApprove && onApprove && (
        <View style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#34C759',
          paddingHorizontal: 10,
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#34C759',
              borderRadius: 8,
              padding: 12,
            }}
            onPress={handleApprove}
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Main Row Content */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            opacity: rowOpacity,
            backgroundColor: '#FFFFFF',
          }}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
