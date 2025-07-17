import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors, gradients } from '@/styles';

interface PageHeaderProps {
  title: string;
  icon: string;
  rightContent?: React.ReactNode;
  gradient?: readonly string[]; // Allow custom gradient
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  icon, 
  rightContent,
  gradient = gradients.professional.corporate // Default to same as sidebar
}) => {
  return (
    <LinearGradient
      colors={gradient as any} // Type assertion for gradient compatibility
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={globalStyles.pageHeader}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color="#FFFFFF" 
          style={{ marginRight: 12 }} 
        />
        <Text style={[globalStyles.pageTitle, { color: '#FFFFFF' }]}>{title}</Text>
      </View>
      {rightContent && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {rightContent}
        </View>
      )}
    </LinearGradient>
  );
};
