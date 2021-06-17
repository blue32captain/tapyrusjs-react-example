import { StyleSheet, ScrollView} from 'react-native';
import {
  Button,
  Portal,
  Card,
} from 'react-native-paper';
import * as React from 'react';
import { Text } from '../components/Themed';
import QRCodeDialog from './QRCodeDialog';
import SendTokenDialog from './SendTokenDialog';

import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function BalanceCard({ token, balance, currentWallet, keyPair}) {
  const isNative = token.colorId === wallet.Wallet.BaseWallet.COLOR_ID_FOR_TPC;

  const [sendDialogVisible, setSendDialogVisible] = React.useState(false);
  const [qrDialogVisible, setQrDialogVisible] = React.useState(false);

  const address = (keyPair: tapyrus.ECPair.ECPairInterface) => {
    if (isNative) {
      return tapyrus.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: tapyrus.networks.dev,
      }).address!;
    } else {
      return tapyrus.payments.cp2pkh({
        colorId: Buffer.from(token.colorId, 'hex'),
        pubkey: keyPair.publicKey,
        network: tapyrus.networks.dev,
      }).address!;
    }
  };

  const transfer = async (addressToSend: string, amountToSend: number, keyPair: tapyrus.ECPair.ECPairInterface) => {
    const changePubkeyScript = tapyrus.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: tapyrus.networks.dev,
    }).output!;
    const param = {
      colorId: token.colorId,
      amount: new Number(amountToSend).valueOf(),
      toAddress: addressToSend,
    };
    return currentWallet
      .update()
      .then(() => {
        return currentWallet.transfer([param], changePubkeyScript);
      })
      .finally(() => {
        setSendDialogVisible(false);
      });
  };

  return <Card style={styles.card} mode="elevated">
    <Card.Title title={ token.name } />
      { isNative ?
        <Card.Content>
          <Text style={styles.confirmed}>{balance.confirmed/100000000} TPC</Text>
          <Text style={styles.unconfirmed}>(unconfirmed {balance.unconfirmed/100000000} TPC)</Text>
        </Card.Content>
      :
        <Card.Content>
          <Text style={styles.confirmed}>{balance.confirmed || 0} {token.ticker}</Text>
          <Text style={styles.unconfirmed}>(unconfirmed {balance.unconfirmed || 0} {token.ticker})</Text>
        </Card.Content>
      }
    <Card.Actions>
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
    </Card.Actions>
    <Portal>
      <SendTokenDialog visible={sendDialogVisible} ticker={ isNative ? "tap" : token.ticker } onClose={() => setSendDialogVisible(false)} onSend={(address, amount) => transfer(address, amount, keyPair)} />
      <QRCodeDialog visible={qrDialogVisible} onClose={() => setQrDialogVisible(false)} address={address(keyPair)} />
    </Portal>
  </Card>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 8,
    width: 100,
  },
  card: {
    margin: 16,
  },
  confirmed: {
    margin: 8,
    fontSize: 20,
  },
  unconfirmed: {
    margin: 8,
    fontSize: 16,
    color: 'gray'
  },
});
