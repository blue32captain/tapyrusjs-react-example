import * as React from 'react';
import { StyleSheet } from 'react-native';

import WalletList from '../components/WalletList';
import { Text, View } from '../components/Themed';
import { List } from 'react-native-paper';

export default function WalletsScreen() {
  return (
    <View style={styles.container}>
      <WalletList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
