import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface PortalContextType {
  registerPortal: (id: string, content: ReactNode) => void;
  unregisterPortal: (id: string) => void;
}

const PortalContext = createContext<PortalContextType | null>(null);

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

interface PortalProviderProps {
  children: ReactNode;
}

export const PortalProvider: React.FC<PortalProviderProps> = ({ children }) => {
  const [portals, setPortals] = useState<Map<string, ReactNode>>(new Map());

  const registerPortal = (id: string, content: ReactNode) => {
    setPortals(prev => new Map(prev.set(id, content)));
  };

  const unregisterPortal = (id: string) => {
    setPortals(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  return (
    <PortalContext.Provider value={{ registerPortal, unregisterPortal }}>
      <View style={styles.container}>
        {children}
        {/* Portal overlay container - only render when there are portals */}
        {portals.size > 0 && (
          <View style={styles.portalContainer}>
            {Array.from(portals.values()).map((portal, index) => (
              <React.Fragment key={index}>
                {portal}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </PortalContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  portalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    pointerEvents: 'box-none', // Allow events to pass through to children
  },
});
