import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
} from 'react-native-paper';
import * as React from 'react';
import { Text } from '../components/Themed';
import { useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeDialog({ visible, onClose, address}) {
  const width = useWindowDimensions().width;
  
  return <Dialog
    visible={visible}
    onDismiss={onClose}
  >
    <Dialog.Title>Receive</Dialog.Title>
    <Dialog.Content style={ styles.qr }>
      <QRCode value={`tapyrus:${address}`} size={ width * 0.7 } />
      <Text style={{ fontSize: 12, margin: 8 }}>{address}</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={onClose}>Close</Button>
    </Dialog.Actions>
  </Dialog>;
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    width: 100,
  },
  qr: {
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
