
import { ActivityIndicator, FlatList } from 'react-native';

import { List } from 'react-native-paper';

import React, { useEffect, useState } from 'react';

import * as tapyrus from 'tapyrusjs-lib';
import * as walelt from 'tapyrusjs-wallet';

export default function KeyList() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<string[]>([]);
  const keyStore = new walelt.KeyStore.ReactKeyStore(tapyrus.networks.dev);

  useEffect(() => {
    keyStore.keys().then((keys) => {
      setData(keys);
    }).catch((e) => console.error(e))
    .finally(() => { setLoading(false) })
  }, []);

  const renderItem = ({ item }: { item: string }) => {
    return <List.Item title={ item } />
  };

  const keyExtractor = (id: string) => id;

  return isLoading ? <ActivityIndicator/> : 
    <FlatList
      renderItem={ renderItem }
      keyExtractor={ keyExtractor }
      data={ data }
    />
  ;
}