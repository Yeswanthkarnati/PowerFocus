import React from 'react';
import TimerScreen from './src/screens/TimerScreen';
import { NavigationContainer } from '@react-navigation/native';
import OptionsScreen from './src/screens/OptionsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenLockProvider } from './src/components/ScreenLockContext';
import RNBootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ScreenLockProvider>
      <NavigationContainer
        onReady={() => {
          RNBootSplash.hide({ fade: true }).catch(error => {
            console.error('Failed to hide BootSplash:', error);
          });
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="TimerScreen"
            component={TimerScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="OptionsScreen"
            component={OptionsScreen}
            options={{
              title: 'Settings',
              headerStyle: {
                backgroundColor: '#3d4d66',
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 20,
              },
              headerShadowVisible: true,
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ScreenLockProvider>
  );
};

export default App;