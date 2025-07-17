import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  color: readonly string[];
  route: string;
  description?: string;
}

interface EnhancedQuickActionsProps {
  actions: QuickActionItem[];
  onActionPress: (route: string) => void;
}

export const EnhancedQuickActions: React.FC<EnhancedQuickActionsProps> = ({
  actions,
  onActionPress,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 768;
  const itemDimension = isTablet ? 180 : (screenWidth - 60) / 2 - 10;

  const renderQuickAction = ({ item }: { item: QuickActionItem }) => (
    <TouchableOpacity
      onPress={() => onActionPress(item.route)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      <LinearGradient
        colors={item.color as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120,
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 25,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Ionicons name={item.icon as any} size={26} color="#FFFFFF" />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        {item.description && (
          <Text
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
            }}
          >
            {item.description}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical: 16 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 16,
          marginHorizontal: 20,
          color: '#000',
        }}
      >
        Quick Actions
      </Text>
      <FlatGrid
        itemDimension={itemDimension}
        data={actions}
        style={{ paddingHorizontal: 20 }}
        spacing={12}
        renderItem={renderQuickAction}
        maxItemsPerRow={isTablet ? 4 : 2}
        staticDimension={screenWidth - 40}
        fixed={false}
      />
    </View>
  );
};
