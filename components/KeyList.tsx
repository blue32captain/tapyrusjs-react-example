import { ActivityIndicator, FlatList } from 'react-native';

import { List, Divider } from 'react-native-paper';

import React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../components/Themed';

import * as tapyrus from 'tapyrusjs-lib';

export default function KeyList({ keys, isLoading }) {
  const renderItem = ({ item }: { item: string }) => {
    const keyPair = tapyrus.ECPair.fromPrivateKey(Buffer.from(item, 'hex'), {
      network: tapyrus.networks.dev,
    });
    const address = tapyrus.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: tapyrus.networks.dev,
    }).address!;
    console.info(address);
    return (
      <View>
        <List.Item title={address} style={{ padding: 20 }} />
        <Divider />
      </View>
    );
  };

  const keyExtractor = (id: string) => id;

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={keys}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: '100%',
  },
});
