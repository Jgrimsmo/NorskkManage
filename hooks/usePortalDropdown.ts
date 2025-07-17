import { useEffect, useRef } from 'react';
import { usePortal } from '../components/ui/Portal';

export const usePortalDropdown = () => {
  const { registerPortal, unregisterPortal } = usePortal();
  const portalId = useRef(`portal-${Math.random().toString(36).substr(2, 9)}`).current;

  const showPortal = (content: React.ReactNode) => {
    registerPortal(portalId, content);
  };

  const hidePortal = () => {
    unregisterPortal(portalId);
  };

  useEffect(() => {
    return () => {
      hidePortal();
    };
  }, []);

  return { showPortal, hidePortal };
};
