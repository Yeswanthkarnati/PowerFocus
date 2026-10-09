import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useRef,
} from 'react';
import KeepAwake from 'react-native-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  ringtoneUri: string | null;
  ringtoneName: string | null;
  ringtoneLoaded: boolean;
  setRingtoneSelection: (
    uri: string | null,
    name: string | null,
  ) => Promise<void>;

  vibrationEnabled: boolean;
  setVibrationEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  workColor: string;
  setWorkColor: React.Dispatch<React.SetStateAction<string>>;

  breakColor: string;
  setBreakColor: React.Dispatch<React.SetStateAction<string>>;
}

export const ScreenLockContext = createContext<
  ScreenLockContextType | undefined
>(undefined);

interface ScreenLockProviderProps {
  children: ReactNode;
}

export const ScreenLockProvider: React.FC<ScreenLockProviderProps> = ({
  children,
}) => {
  const [preventScreenLock, setPreventScreenLock] =
    useState<boolean>(false);

  const [workLength, setWorkLength] =
    useState<number>(1);

  const [breakLength, setBreakLength] =
    useState<number>(1);

  const [longBreakLength, setLongBreakLength] =
    useState<number>(15);

  const [longBreakFrequency, setLongBreakFrequency] =
    useState<number>(2);

  const [soundEnabled, setSoundEnabled] =
    useState<boolean>(true);

  const [ringtoneUri, setRingtoneUri] =
    useState<string | null>(null);

  const [ringtoneName, setRingtoneName] =
    useState<string | null>(null);

  const [ringtoneLoaded, setRingtoneLoaded] =
    useState<boolean>(false);

  const [longBreakEnabled, setLongBreakEnabled] =
    useState<boolean>(false);

  const [modifiedFrequency, setModifiedFrequency] =
    useState<number>(1);

  const [vibrationEnabled, setVibrationEnabled] =
    useState<boolean>(true);

  // Default colors
  const [workColor, setWorkColor] =
    useState<string>('#00563B');

  const [breakColor, setBreakColor] =
    useState<string>('violet');

  // Used to make sure saved colors are loaded
  // before we start saving color changes.
  const colorsLoaded = useRef(false);

  useEffect(() => {
    const loadRingtone = async () => {
      try {
        const savedSelection = await AsyncStorage.getItem(
          'ringtoneSelection',
        );

        if (savedSelection) {
          const selection: {
            uri?: unknown;
            name?: unknown;
          } = JSON.parse(savedSelection);

          if (
            typeof selection.uri === 'string' &&
            typeof selection.name === 'string'
          ) {
            setRingtoneUri(selection.uri);
            setRingtoneName(selection.name);
          }
        }
      } catch (error) {
        console.error('Error loading saved ringtone:', error);
      } finally {
        setRingtoneLoaded(true);
      }
    };

    loadRingtone();
  }, []);

  const setRingtoneSelection = async (
    uri: string | null,
    name: string | null,
  ) => {
    await AsyncStorage.setItem(
      'ringtoneSelection',
      JSON.stringify({ uri, name }),
    );
    setRingtoneUri(uri);
    setRingtoneName(name);
  };

  // --------------------------------------------------
  // Screen Lock
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Load saved colors from AsyncStorage
  // --------------------------------------------------

  useEffect(() => {
    const loadColors = async () => {
      try {
        const savedWorkColor =
          await AsyncStorage.getItem('workColor');

        const savedBreakColor =
          await AsyncStorage.getItem('breakColor');

        if (savedWorkColor) {
          setWorkColor(savedWorkColor);
        }

        if (savedBreakColor) {
          setBreakColor(savedBreakColor);
        }
      } catch (error) {
        console.log(
          'Error loading saved colors:',
          error,
        );
      } finally {
        colorsLoaded.current = true;
      }
    };

    loadColors();
  }, []);

  // --------------------------------------------------
  // Save Work Color
  // --------------------------------------------------

  useEffect(() => {
    if (!colorsLoaded.current) {
      return;
    }

    const saveWorkColor = async () => {
      try {
        await AsyncStorage.setItem(
          'workColor',
          workColor,
        );
      } catch (error) {
        console.log(
          'Error saving work color:',
          error,
        );
      }
    };

    saveWorkColor();
  }, [workColor]);

  // --------------------------------------------------
  // Save Break Color
  // --------------------------------------------------

  useEffect(() => {
    if (!colorsLoaded.current) {
      return;
    }

    const saveBreakColor = async () => {
      try {
        await AsyncStorage.setItem(
          'breakColor',
          breakColor,
        );
      } catch (error) {
        console.log(
          'Error saving break color:',
          error,
        );
      }
    };

    saveBreakColor();
  }, [breakColor]);

  // --------------------------------------------------
  // Provider
  // --------------------------------------------------

  return (
    <ScreenLockContext.Provider
      value={{
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

        ringtoneUri,
        ringtoneName,
        ringtoneLoaded,
        setRingtoneSelection,

        vibrationEnabled,
        setVibrationEnabled,

        workColor,
        setWorkColor,

        breakColor,
        setBreakColor,
      }}
    >
      {children}
    </ScreenLockContext.Provider>
  );
};

// --------------------------------------------------
// Custom Hook
// --------------------------------------------------

export const useScreenLock = () => {
  const context = useContext(ScreenLockContext);

  if (context === undefined) {
    throw new Error(
      'useScreenLock must be used within a ScreenLockProvider',
    );
  }

  return context;
};