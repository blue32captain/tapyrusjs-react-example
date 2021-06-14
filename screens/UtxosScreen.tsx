import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import UtxoList from '../components/UtxoList';
import { View } from '../components/Themed';
import Header from '../components/Header';

import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function UtxosScreen({ navigation }) {
  const [utxos, setUtxos] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  const keyStore = new wallet.KeyStore.ReactKeyStore(tapyrus.networks.dev);
  const dataStore = new wallet.DataStore.ReactDataStore();
  const config = new wallet.Config({
    host: 'localhost',
    port: 3000,
    path: '',
    network: tapyrus.networks.dev,
  });
  const currentWallet = new wallet.Wallet.BaseWallet(
    keyStore,
    dataStore,
    config,
  );

  const sync = () => {
    setLoading(true);
    currentWallet
      .update()
      .then(() => {
        return currentWallet.utxos();
      })
      .then((utxos) => {
        setUtxos(utxos);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    sync();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, navigation }) => (
        <Header
          scene={scene}
          navigation={navigation}
          actions={[
            <Appbar.Action
              icon='sync'
              onPress={() => {
                sync();
              }}
            />,
            <Appbar.Action
              icon='delete'
              onPress={() => {
                removeAllUtxos().then(() => {
                  setUtxos((_) => []);
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
      <UtxoList utxos={utxos} isLoading={isLoading} />
    </View>
  );
}

const removeAllUtxos = async () => {
  const dataStore = new wallet.DataStore.ReactDataStore();
  await dataStore.clear();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
