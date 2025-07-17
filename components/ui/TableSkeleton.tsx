import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { globalStyles } from '@/styles';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        startAnimation();
      });
    };

    startAnimation();
  }, []);

  const renderSkeletonRow = (rowIndex: number) => (
    <View key={rowIndex} style={[globalStyles.tableRow, { paddingVertical: 16 }]}>
      {Array(columns).fill(0).map((_, colIndex) => (
        <View key={colIndex} style={[globalStyles.tableCell, { flex: 1 }]}>
          <Animated.View
            style={{
              height: 16,
              backgroundColor: '#E5E5EA',
              borderRadius: 4,
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
              width: colIndex === 0 ? '80%' : '60%',
            }}
          />
          {rowIndex % 2 === 0 && colIndex === 0 && (
            <Animated.View
              style={{
                height: 12,
                backgroundColor: '#F0F0F0',
                borderRadius: 4,
                marginTop: 4,
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0.5],
                }),
                width: '40%',
              }}
            />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={globalStyles.table}>
      {/* Skeleton Header */}
      <View style={[globalStyles.tableHeader, { paddingVertical: 16 }]}>
        {Array(columns).fill(0).map((_, index) => (
          <View key={index} style={[globalStyles.tableHeaderCell, { flex: 1 }]}>
            <Animated.View
              style={{
                height: 14,
                backgroundColor: '#D1D1D6',
                borderRadius: 4,
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 0.8],
                }),
                width: '70%',
              }}
            />
          </View>
        ))}
      </View>

      {/* Skeleton Rows */}
      {Array(rows).fill(0).map((_, index) => renderSkeletonRow(index))}
    </View>
  );
};
