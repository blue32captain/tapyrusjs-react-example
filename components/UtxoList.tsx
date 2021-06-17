import { StyleSheet, SectionList, ActivityIndicator, View } from 'react-native';

import { List, Card, Chip, Text, TextInput} from 'react-native-paper';

import * as React from 'react';

import { useThemeColor } from './Themed';
import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function KeyList({ utxos, isLoading }) {
  const backgroundColor = useThemeColor({}, "tint");

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card style={styles.card} mode="elevated">
        <TextInput style={styles.label} label="colorId" value={`${item.colorId}`} disabled={false}></TextInput>
        <TextInput style={styles.label} label="txid" value={`${item.txid}`} disabled={false} ></TextInput>
        <TextInput style={styles.label} label="vout" value={`${item.index}`} disabled={false}></TextInput>
        <TextInput style={styles.label} label="value" value={`${item.value}`} disabled={false}></TextInput>
        <TextInput style={styles.label} label="scriptPubkey" value={`${item.scriptPubkey}`} disabled={false}></TextInput>
      </Card>
    );
  };
  let data: { [key: string]: any } = {};
  utxos.forEach((utxo: wallet.Utxo) => {
    if (utxo.colorId === wallet.Wallet.BaseWallet.COLOR_ID_FOR_TPC) {
      const payment = tapyrus.payments.p2pkh({
        output: Buffer.from(utxo.scriptPubkey, 'hex'),
        network: tapyrus.networks.dev,
      });
      data[payment.address!] = data[payment.address!] || [];
      data[payment.address!].push(utxo);
    } else {
      const payment = tapyrus.payments.cp2pkh({
        colorId: Buffer.from(utxo.colorId, 'hex'),
        output: Buffer.from(utxo.scriptPubkey, 'hex'),
        network: tapyrus.networks.dev,
      });
      data[payment.address!] = data[payment.address!] || [];
      data[payment.address!].push(utxo);
    }
    
  });
  let sections = [];
  for (const [key, value] of Object.entries(data)) {
    sections.push({
      title: key,
      data: value,
    });
  }
  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <SectionList
      style={styles.list}
      sections={sections}
      keyExtractor={(item, index) => item + index}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <Chip style={[{ backgroundColor }, styles.chip]} mode="outlined">{title}</Chip>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 4,
  },
  label: {
    backgroundColor: '#fff',
  },
  chip: {
    margin: 16,
  },
});
