import { useEffect, useState } from 'react';

function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera|Mini|IEMobile|WPDesktop/i));
    setIsMobile(mobile);
  }, []);

  return { isMobile };
}

export default useDeviceDetect;
