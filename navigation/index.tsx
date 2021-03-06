/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import UtxosScreen from '../screens/UtxosScreen';
import KeysScreen from '../screens/KeysScreen';
import WalletScreen from '../screens/WalletScreen';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function WalletStackNavigator() {
  return <Stack.Navigator headerMode="screen">
    <Stack.Screen name="Wallet" component={WalletScreen} />
    <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
  </Stack.Navigator>
}

function KeysStackNavigator() {
  return <Stack.Navigator headerMode="screen">
    <Stack.Screen name="Keys" component={KeysScreen} />
    <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
  </Stack.Navigator>
}

function UtxosStackNavigator() {
  return <Stack.Navigator headerMode="screen">
    <Stack.Screen name="Utxos" component={UtxosScreen} />
    <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
  </Stack.Navigator>
}

function RootNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Wallet">
      <Drawer.Screen name="Wallet" component={WalletStackNavigator} />
      <Drawer.Screen name="Keys" component={KeysStackNavigator} />
      <Drawer.Screen name="Utxos" component={UtxosStackNavigator} />
    </Drawer.Navigator>
  );
}
