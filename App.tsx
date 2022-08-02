import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';

import { LogBox, StatusBar } from 'react-native';
LogBox.ignoreLogs(["EventEmitter.removeListener"]);

import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from 'styled-components';

import { Routes } from './src/routes';

import { AuthProvider, useAuth } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const { userStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded || userStorageLoading) {
    return null
  }

  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
          <StatusBar barStyle="light-content" />
            <AuthProvider>
                <Routes />
            </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
