import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export function useSessionGuard(isSessionActive, onConfirmExit) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (!isSessionActive) return;

    const handleRouteChange = (url) => {
      if (isNavigatingRef.current) return;
      
      // Check if navigating away from milking page
      if (url !== '/milking' && url !== router.asPath) {
        const shouldExit = window.confirm(
          '⚠️ Active Session Detected\n\nDo you want to close this session? Your current progress will be lost.'
        );
        
        if (!shouldExit) {
          router.events.emit('routeChangeError');
          throw 'Route change aborted by user';
        } else {
          isNavigatingRef.current = true;
          if (onConfirmExit) {
            onConfirmExit();
          }
        }
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Do you want to close this session? Your progress will be lost.';
      return e.returnValue;
    };

    router.events?.on('routeChangeStart', handleRouteChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSessionActive, router, onConfirmExit]);
}
