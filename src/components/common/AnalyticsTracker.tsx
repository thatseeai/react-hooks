import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const AnalyticsTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 배포 환경(Production)이고 측정 ID가 있을 때만 초기화
    const isProduction = import.meta.env.PROD;
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (isProduction && measurementId) {
      ReactGA.initialize(measurementId);
      setInitialized(true);
    } else if (!isProduction) {
      console.log('[Analytics] Development mode: Tracking disabled');
    } else {
      console.warn('[Analytics] Measurement ID missing');
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [initialized, location]);

  return null;
};

export default AnalyticsTracker;
