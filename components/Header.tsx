import { Appbar, Divider, Menu } from 'react-native-paper';
import * as React from 'react';
import {} from '@react-navigation/stack';

export default function Header({ scene, navigation, previous, actions }) {
  const openMenu = () => {
    navigation.openDrawer();
  }

  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : (
        <Appbar.Action icon="menu" color="white" onPress={openMenu} />
      )}
      <Appbar.Content title={scene.route.name} />
      {actions}
    </Appbar.Header>
  );
}
