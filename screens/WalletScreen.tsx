import { StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
  IconButton,
} from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { View, Text } from '../components/Themed';
import Header from '../components/Header';
import { useWindowDimensions } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import QRCode from 'react-native-qrcode-svg';

import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function WalletScreen({ navigation }) {
  const [keyPair, setKeyPair] = useState<tapyrus.ECPair.ECPairInterface>();
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

  const [sendDialogVisible, setSendDialogVisible] = React.useState(false);
  const [qrDialogVisible, setQrDialogVisible] = React.useState(false);

  const [hasPermission, setHasPermission] = useState<boolean | undefined>(
    undefined,
  );
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const createOrFirstKey = async () => {
    const keys = await keyStore.keys();
    if (keys.length > 0) {
      const keyPair = tapyrus.ECPair.fromPrivateKey(
        Buffer.from(keys[0], 'hex'),
        { network: tapyrus.networks.dev },
      );
      setKeyPair(keyPair);
    } else {
      const newKeyPair = tapyrus.ECPair.makeRandom({
        network: tapyrus.networks.dev,
      });
      setKeyPair(newKeyPair);
      keyStore.addPrivateKey(newKeyPair.toWIF());
    }
  };

  const address = (keyPair: tapyrus.ECPair.ECPairInterface) => {
    return tapyrus.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: tapyrus.networks.dev,
    }).address!;
  };

  useEffect(() => {
    createOrFirstKey();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, navigation }) => (
        <Header scene={scene} navigation={navigation} actions={[]} />
      ),
    });
  }, [navigation]);

  const [amountToSend, setAmountToSend] = React.useState<number>(0);
  const [addressToSend, setAddressToSend] = React.useState('');

  const transfer = (keyPair: tapyrus.ECPair.ECPairInterface) => {
    setProcessing(true);
    const changePubkeyScript = tapyrus.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: tapyrus.networks.dev,
    }).output!;
    const param = {
      colorId: wallet.Wallet.BaseWallet.COLOR_ID_FOR_TPC,
      amount: new Number(amountToSend).valueOf(),
      toAddress: addressToSend,
    };
    currentWallet
      .update()
      .then(() => {
        return currentWallet.transfer([param], changePubkeyScript);
      })
      .finally(() => {
        setProcessing(false);
        setSendDialogVisible(false);
      });
  };

  const [scanned, setScanned] = useState(false);
  const [scannerVisible, setScannerVisible] = React.useState(false);
  const openScanner = () => {
    setSendDialogVisible(false);
    setScannerVisible(true);
  };

  const closeScanner = () => {
    setScannerVisible(false);
    setSendDialogVisible(true);
  };

  const [processing, setProcessing] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const address = data.replace(/^tapyrus:/, '');
    setAddressToSend(address);
    closeScanner();
  };

  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return keyPair ? (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexBasis: 'auto',
        }}
      >
        <Button
          style={styles.button}
          mode="outlined"
          onPress={() => {
            setSendDialogVisible(true);
          }}
        >
          Send
        </Button>
        <Button
          style={styles.button}
          mode="outlined"
          onPress={() => {
            setQrDialogVisible(true);
          }}
        >
          Receive
        </Button>
      </View>
      <Portal>
        <Dialog visible={scannerVisible} onDismiss={() => closeScanner()}>
          <Dialog.Content style={{ height: height * 0.8 }}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="text"
              style={styles.button}
              onPress={() => closeScanner()}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={sendDialogVisible}
          onDismiss={() => setSendDialogVisible(false)}
        >
          {processing && (
            <View style={styles.processing}>
              <ActivityIndicator />
            </View>
          )}
          <Dialog.Title>Send</Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                label="Address"
                value={addressToSend}
                onChangeText={address => setAddressToSend(address)}
              />
              <IconButton
                icon="camera"
                onPress={() => {
                  openScanner();
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                label="Amount to send"
                value={amountToSend}
                onChangeText={amount => setAmountToSend(amount)}
                keyboardType={'numeric'}
              />
              <Text style={{ margin: 8 }}>tap</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => transfer(keyPair)}
            >
              Send
            </Button>
            <Button
              style={styles.button}
              onPress={() => setSendDialogVisible(false)}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={qrDialogVisible}
          onDismiss={() => setQrDialogVisible(false)}
        >
          <Dialog.Title>Receive</Dialog.Title>
          <Dialog.Content style={styles.qr}>
            <QRCode value={`tapyrus:${address(keyPair)}`} size={width * 0.7} />
            <Text style={{ fontSize: 12, margin: 8 }}>{address(keyPair)}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setQrDialogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  qr: {
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  send: {
    flexBasis: 'auto',
    alignItems: 'center',
  },
  button: {
    margin: 8,
    width: 100,
  },
  processing: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    zIndex: 1000,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
