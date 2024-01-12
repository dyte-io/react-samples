import { useState, useEffect } from 'react';
import { Size } from '@dytesdk/ui-kit';

const useBreakpoint = () => {
  const getBreakpoint = (width: number) => {
    if (width < 640) return 'sm';
    if (width >= 640 && width < 768) return 'md';
    if (width >= 768 && width < 1024) return 'lg';
    return 'xl';
  };

  const [breakpoint, setBreakpoint] = useState(getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint as Size;
};

export default useBreakpoint;
