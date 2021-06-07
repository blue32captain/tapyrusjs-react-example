import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import KeyList from '../components/KeyList';
import { Text, View } from '../components/Themed';

import * as tapyrus from 'tapyrusjs-lib';
import * as walelt from 'tapyrusjs-wallet';

export default function KeysScreen() {
  return (
    <View style={styles.container}>
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => {
          const keyPair = tapyrus.ECPair.makeRandom();
          const keyStore = new walelt.KeyStore.ReactKeyStore(tapyrus.networks.dev);
          keyStore.addPrivateKey(keyPair.toWIF());
        }}
      />
      <KeyList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
