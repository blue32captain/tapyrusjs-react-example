import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import * as React from 'react';
import { useEffect, useState } from 'react';
import UtxoList from '../components/UtxoList';
import { View } from '../components/Themed';
import Header from '../components/Header';

import Token, { TokenStore } from '../models/Token';

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
    network: 'dev',
  });
  const currentWallet = new wallet.Wallet.BaseWallet(
    keyStore,
    dataStore,
    config,
  );

  const tokenStore = new TokenStore();
  const sync = async () => {
    console.log("sync");
    setLoading(true);
    let utxos: wallet.Utxo[] = [];
    await currentWallet.update();
    const newUtxos = await currentWallet.utxos();
    utxos = utxos.concat(newUtxos);
    const tokens = await tokenStore.tokens();
    console.log(tokens);
    const tokenUtxos = await Promise.all(
      tokens.map((token: Token) => {
        return new Promise<wallet.Utxo[]>((resolve, reject) => {
          currentWallet.utxos(token.colorId).then((utxos: wallet.Utxo[]) => {
            resolve(utxos);
          });
        });
      })
    );
    console.log(tokenUtxos);
    tokenUtxos.forEach((newUtxos) => {
      utxos = utxos.concat(newUtxos);
    });
    console.log(utxos);
    setUtxos(utxos);
    setLoading(false);
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
              icon="sync"
              onPress={() => {
                sync();
              }}
            />,
            <Appbar.Action
              icon="delete"
              onPress={() => {
                removeAllUtxos().then(() => {
                  setUtxos(_ => []);
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
