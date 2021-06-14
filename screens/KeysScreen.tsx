import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import KeyList from '../components/KeyList';
import { View } from '../components/Themed';
import Header from '../components/Header';

import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function KeysScreen({ navigation }) {
  const [keys, setKeys] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const keyStore = new wallet.KeyStore.ReactKeyStore(tapyrus.networks.dev);

  useEffect(() => {
    keyStore
      .keys()
      .then(setKeys)
      .catch((e: any) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, navigation }) => (
        <Header
          scene={scene}
          navigation={navigation}
          actions={[
            <Appbar.Action
              icon="plus"
              onPress={() => {
                addKey().then(key => {
                  setKeys(keys => [...keys, key]);
                });
              }}
            />,
            <Appbar.Action
              icon="delete"
              onPress={() => {
                removeAllKeys().then(() => {
                  setKeys(_keys => []);
                });
              }}
            />,
          ]}
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <KeyList keys={keys} isLoading={isLoading} />
    </View>
  );
}

async function removeAllKeys() {
  const keyStore = new wallet.KeyStore.ReactKeyStore(tapyrus.networks.dev);
  return await keyStore.clear();
}

async function addKey() {
  const keyStore = new wallet.KeyStore.ReactKeyStore(tapyrus.networks.dev);
  const keyPair = tapyrus.ECPair.makeRandom({ network: tapyrus.networks.dev });
  await keyStore.addPrivateKey(keyPair.toWIF());
  return keyPair.privateKey!.toString('hex');
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
