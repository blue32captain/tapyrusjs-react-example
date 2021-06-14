import * as React from 'react';
import { StyleSheet } from 'react-native';

import WalletList from '../components/WalletList';
import { View } from '../components/Themed';

export default function WalletsScreen() {
  return (
    <View style={styles.container}>
      <WalletList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
