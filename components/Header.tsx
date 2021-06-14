import { Appbar, Menu } from 'react-native-paper';
import * as React from 'react';
import {} from '@react-navigation/stack';

export default function Header({ scene, navigation, previous, actions }) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }
        >
          <Menu.Item
            onPress={() => {
              navigation.navigate('Keys');
              setVisible(false);
            }}
            title="Keys"
          />
          <Menu.Item
            onPress={() => {
              navigation.navigate('Utxos');
              setVisible(false);
            }}
            title="Utxos"
          />
          <Menu.Item
            onPress={() => {
              navigation.navigate('Wallet');
              setVisible(false);
            }}
            title="Wallet"
          />
        </Menu>
      )}
      <Appbar.Content title={scene.route.name} />
      {actions}
    </Appbar.Header>
  );
}
