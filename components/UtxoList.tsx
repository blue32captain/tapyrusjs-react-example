import { StyleSheet, SectionList, ActivityIndicator, View } from 'react-native';

import { List, Card, Chip, Text } from 'react-native-paper';

import React from 'react';

import * as tapyrus from 'tapyrusjs-lib';

export default function KeyList({ utxos, isLoading }) {
  const renderItem = ({ item }: { item: any }) => {
    const value = <Text>{item.value}</Text>;
    const outPoint = (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flexShrink: 1 }}>
          {item.txid}: {item.index}
        </Text>
      </View>
    );
    return (
      <Card style={styles.card} mode="elevated">
        <List.Item title={value} />
        <List.Item title={outPoint} />
      </Card>
    );
  };
  let data: { [key: string]: any } = {};
  utxos.forEach((utxo: any) => {
    const payment = tapyrus.payments.p2pkh({
      output: Buffer.from(utxo.scriptPubkey, 'hex'),
      network: tapyrus.networks.dev,
    });
    data[payment.address!] = data[payment.address!] || [];
    data[payment.address!].push(utxo);
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
        <Chip style={styles.chip}>{title}</Chip>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  card: {
    margin: 4,
  },
  chip: {
    margin: 16,
  },
});
