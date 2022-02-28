import { useEffect, useState } from 'react';

interface IUseCountdownTimerProps {
  seconds: number;
}

function useCountdownTimer({ seconds }: IUseCountdownTimerProps) {
  const [display, setDisplay] = useState<boolean>(true);

  useEffect(() => {
    const hidden = window.setTimeout(() => {
      setDisplay(false);
    }, seconds * 1000);
    return () => window.clearTimeout(hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return display;
}

export default useCountdownTimer;
