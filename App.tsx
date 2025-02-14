import React from 'react';
import TimerScreen from './src/screens/TimerScreen';
import { NavigationContainer } from '@react-navigation/native';
import OptionsScreen from './src/screens/OptionsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenLockProvider } from './src/components/ScreenLockContext';

const App = () => {
    const Stack = createNativeStackNavigator();
 return(
  <ScreenLockProvider>
    <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="TimerScreen" component={TimerScreen} />
        <Stack.Screen 
  name="OptionsScreen" 
  component={OptionsScreen} 
  options={{ 
    title: 'Settings', 
    headerStyle: {
      backgroundColor: '#3d4d66',
    },
    headerTintColor: '#ffffff', // Color of back button and title
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 20,
    },
    headerShadowVisible: true, // Adds shadow to header
    headerTitleAlign: 'center', // Centers the title
    headerTransparent: false,
    headerBlurEffect: 'dark', // Adds a blur effect (works on iOS)
  }} 
/>       
 </Stack.Navigator>
    </NavigationContainer>
    </ScreenLockProvider>
 )
};

export default App;