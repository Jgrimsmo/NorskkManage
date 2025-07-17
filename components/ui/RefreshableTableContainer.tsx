import React, { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { globalStyles } from '@/styles';

interface RefreshableTableContainerProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
}

export const RefreshableTableContainer: React.FC<RefreshableTableContainerProps> = ({
  children,
  onRefresh,
  refreshing: externalRefreshing = false,
}) => {
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const isRefreshing = externalRefreshing || internalRefreshing;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setInternalRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setInternalRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#007AFF']} // Android
          tintColor="#007AFF" // iOS
          title="Pull to refresh..."
          titleColor="#666"
        />
      }
    >
      <View style={globalStyles.container}>
        {children}
      </View>
    </ScrollView>
  );
};
