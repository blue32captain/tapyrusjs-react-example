/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import WalletsScreen from '../screens/WalletsScreen';
import KeysScreen from '../screens/KeysScreen';
import { BottomTabParamList, WalletsParamList, KeysParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Wallets"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Wallets"
        component={WalletsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Keys"
        component={KeysNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const WalletsStack = createStackNavigator<WalletsParamList>();

function WalletsNavigator() {
  return (
    <WalletsStack.Navigator>
      <WalletsStack.Screen
        name="WalletsScreen"
        component={WalletsScreen}
        options={{ headerTitle: 'Wallets' }}
      />
    </WalletsStack.Navigator>
  );
}

const KeysStack = createStackNavigator<KeysParamList>();

function KeysNavigator() {
  return (
    <KeysStack.Navigator>
      <KeysStack.Screen
        name="KeysScreen"
        component={KeysScreen}
        options={{ headerTitle: 'Keys' }}
      />
    </KeysStack.Navigator>
  );
}
