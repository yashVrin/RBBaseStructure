import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const useNetworkStatus = (): boolean => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true); // fallback to true if undefined
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};

export default useNetworkStatus;
