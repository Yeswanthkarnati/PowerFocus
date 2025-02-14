import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import KeepAwake from 'react-native-keep-awake';

interface ScreenLockContextType {
  preventScreenLock: boolean;
  setPreventScreenLock: React.Dispatch<React.SetStateAction<boolean>>;
  workLength: number;
  setWorkLength: React.Dispatch<React.SetStateAction<number>>;
  breakLength: number;
  setBreakLength: React.Dispatch<React.SetStateAction<number>>;
  longBreakEnabled: boolean;
  setLongBreakEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  longBreakLength: number;
  setLongBreakLength: React.Dispatch<React.SetStateAction<number>>;
  modifiedFrequency: number;
  setModifiedFrequency: React.Dispatch<React.SetStateAction<number>>;
  longBreakFrequency: number;
  setLongBreakFrequency: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  vibrationEnabled: boolean;
  setVibrationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ScreenLockContext = createContext<ScreenLockContextType | undefined>(undefined);

interface ScreenLockProviderProps {
  children: ReactNode;
}

export const ScreenLockProvider: React.FC<ScreenLockProviderProps> = ({ children }) => {
  const [preventScreenLock, setPreventScreenLock] = useState<boolean>(false);
  const [workLength, setWorkLength] = useState<number>(1);
  const [breakLength, setBreakLength] = useState<number>(1);
  const[longBreakLength, setLongBreakLength] = useState<number>(15);
  const[longBreakFrequency, setLongBreakFrequency] = useState<number>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [longBreakEnabled, setLongBreakEnabled] = useState<boolean>(false);
  const [modifiedFrequency, setModifiedFrequency] = useState(1);

  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  useEffect(() => {
    if (preventScreenLock) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }

    return () => {
      KeepAwake.deactivate();
    };
  }, [preventScreenLock]);

  return (
    <ScreenLockContext.Provider value ={{
      preventScreenLock,
      setPreventScreenLock,
      workLength,
      setWorkLength,
      breakLength,
      setBreakLength,
      longBreakEnabled,
      setLongBreakEnabled,
      longBreakLength,
      setLongBreakLength,
      longBreakFrequency,
      setLongBreakFrequency,
      modifiedFrequency,
      setModifiedFrequency,
      soundEnabled,
      setSoundEnabled,
      vibrationEnabled,
      setVibrationEnabled
    }}>
      {children}
    </ScreenLockContext.Provider>
  );
};


export const useScreenLock = () => {
  const context = useContext(ScreenLockContext);
  if (context === undefined) {
    throw new Error('useScreenLock must be used within a ScreenLockProvider');
  }
  return context;
};
