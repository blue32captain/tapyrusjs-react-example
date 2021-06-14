import { StyleSheet } from 'react-native';
import { ActivityIndicator, Appbar, Button } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { View, Text } from '../components/Themed';
import Header from '../components/Header';
import { useWindowDimensions } from 'react-native';

import QRCode from 'react-native-qrcode-svg';

import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function WalletScreen({ navigation }) {
  const [keyPair, setKeyPair] = useState<tapyrus.ECPair.ECPairInterface>();
  const keyStore = new wallet.KeyStore.ReactKeyStore(tapyrus.networks.dev);

  const newKey = () => {
    const newKeyPair = tapyrus.ECPair.makeRandom({
      network: tapyrus.networks.dev,
    });
    setKeyPair(newKeyPair);
    keyStore.addPrivateKey(newKeyPair.toWIF());
  };

  const address = (keyPair: tapyrus.ECPair.ECPairInterface) => {
    return tapyrus.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: tapyrus.networks.dev,
    }).address!;
  };

  useEffect(() => {
    newKey();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, navigation }) => (
        <Header scene={scene} navigation={navigation} />
      ),
    });
  }, [navigation]);

  const width = useWindowDimensions().width;
  return keyPair ? (
    <View style={styles.container}>
      <Text style={{ fontSize: 32, margin: 16 }}>Receive Address</Text>
      <QRCode value={`tapyrus:${address(keyPair)}`} size={width * 0.7} />
    </View>
  ) : (
    <ActivityIndicator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
