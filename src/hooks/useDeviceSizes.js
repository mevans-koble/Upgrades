import { useMediaQuery } from 'react-device-sizes';

export const useDeviceSizes = () => {
  const isMobileDevice = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isLaptops = useMediaQuery({ minWidth: 1224 });
  const is900 = useMediaQuery({ width: 900 });
  const sizeWithQuery = useMediaQuery({ query: '(min-width: 576px) and (max-width: 767.98px)' });

  return {
    isMobileDevice,
    isTablet,
    isLaptops,
    is900,
    sizeWithQuery
  };
};