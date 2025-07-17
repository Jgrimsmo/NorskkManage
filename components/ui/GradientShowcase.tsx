import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, gradientSets, pageGradients } from '@/styles';

interface GradientShowcaseProps {
  onGradientSelect?: (gradient: readonly string[], name: string) => void;
}

export const GradientShowcase: React.FC<GradientShowcaseProps> = ({ onGradientSelect }) => {
  const renderGradientSample = (gradient: readonly string[], name: string, category: string) => (
    <TouchableOpacity
      key={`${category}-${name}`}
      onPress={() => onGradientSelect?.(gradient, `${category}-${name}`)}
      style={{
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
        <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 12 }}>
          {category}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategory = (categoryName: string, categoryGradients: Record<string, readonly string[]>) => (
    <View key={categoryName} style={{ marginBottom: 24 }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 12, 
        color: '#333',
        textTransform: 'capitalize'
      }}>
        {categoryName} Gradients
      </Text>
      {Object.entries(categoryGradients).map(([name, gradient]) =>
        renderGradientSample(gradient, name, categoryName)
      )}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
        Gradient Palette
      </Text>
      
      {/* Recommended Page Gradients */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          marginBottom: 12, 
          color: '#333'
        }}>
          Recommended Page Gradients
        </Text>
        {Object.entries(pageGradients).map(([pageName, gradient]) =>
          renderGradientSample(gradient, pageName, 'recommended')
        )}
      </View>

      {/* All Categories */}
      {Object.entries(gradients).map(([categoryName, categoryGradients]) =>
        renderCategory(categoryName, categoryGradients)
      )}

      {/* Gradient Sets */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          marginBottom: 12, 
          color: '#333'
        }}>
          Curated Sets
        </Text>
        {Object.entries(gradientSets).map(([setName, setGradients]) => (
          <View key={setName} style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              marginBottom: 8, 
              color: '#666'
            }}>
              {setName.charAt(0).toUpperCase() + setName.slice(1)} Set
            </Text>
            {setGradients.map((gradient, index) =>
              renderGradientSample(gradient, `option-${index + 1}`, setName)
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
