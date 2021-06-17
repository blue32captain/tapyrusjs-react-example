import { StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  TextInput,
  IconButton,
} from 'react-native-paper';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text } from '../components/Themed';
import Scanner from './Scanner';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function SendTokenDialog({ visible, ticker, onClose, onSend }) {

  const [amountToSend, setAmountToSend] = React.useState<number>(0);
  const [addressToSend, setAddressToSend] = React.useState('');
  const [scannerVisible, setScannerVisible] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const address = data.replace(/^tapyrus:/, '');
    setAddressToSend(address);
    closeScanner();
  };

  const openScanner = () => {
    setScannerVisible(true);
  };

  const closeScanner = () => {
    setScannerVisible(false);
  };

  const [hasPermission, setHasPermission] = useState<boolean | undefined>(
    undefined,
  );
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return <Dialog
          visible={visible}
          onDismiss={onClose}
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
                onPress={() => openScanner()}
                disabled={!hasPermission}
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
              <Text style={{ margin: 8 }}>{ticker}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                  setProcessing(true);
                  onSend(addressToSend, amountToSend);
                  setProcessing(false);
              }}
            >
              Send
            </Button>
            <Button
              style={styles.button}
              onPress={onClose}
            >Close
            </Button>
          </Dialog.Actions>
          <Portal>
            <Scanner visible={scannerVisible} onClose={closeScanner} onScanned={handleBarCodeScanned} scanned={scanned}/>
          </Portal>
        </Dialog>;
}

const styles = StyleSheet.create({
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
