import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
} from 'react-native-paper';
import * as React from 'react';
import { useWindowDimensions } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Scanner({ visible, onClose, onScanned, scanned }) {
  const height = useWindowDimensions().height;
  return <Dialog visible={visible} onDismiss={onClose}>
    <Dialog.Content style={{ height: height * 0.8 }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : onScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </Dialog.Content>
    <Dialog.Actions>
      <Button
        mode="text"
        style={styles.button}
        onPress={onClose}
      >
        Close
      </Button>
    </Dialog.Actions>
  </Dialog>;
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    width: 100,
  },
});