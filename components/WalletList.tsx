import { Text, View } from './Themed';
import { ActivityIndicator, FlatList } from 'react-native';

import { List, Divider, useTheme } from 'react-native-paper';
import type { StackNavigationProp } from '@react-navigation/stack';

import React, { useEffect, useState } from 'react';

import * as tapyrus from 'tapyrusjs-lib';
import * as walelt from 'tapyrusjs-wallet';

export default function WalletList() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<string[]>([]);
  const keyStore = new walelt.KeyStore.ReactKeyStore(tapyrus.networks.dev);

  useEffect(() => {
    keyStore
      .keys()
      .then((keys: string[]) => {
        setData(keys);
      })
      .catch((e: any) => console.error(e))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: string }) => {
    return <List.Item title={item} />;
  };

  const keyExtractor = (id: string) => id;

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <FlatList renderItem={renderItem} keyExtractor={keyExtractor} data={data} />
  );
}
