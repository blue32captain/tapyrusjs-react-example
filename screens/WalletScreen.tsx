import { StyleSheet, ScrollView} from 'react-native';
import {
  ActivityIndicator,
  Portal,
  Appbar,
  FAB,
} from 'react-native-paper';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from '../components/Themed';
import Header from '../components/Header';
import Token, { TokenStore } from '../models/Token';
import AddTokenDialog from './AddTokenDialog';
import BalanceCard from './BalanceCard';

import * as tapyrus from 'tapyrusjs-lib';
import * as wallet from 'tapyrusjs-wallet';

export default function WalletScreen({ navigation }) {
  const tokenStore = new TokenStore();

  const [keyPair, setKeyPair] = useState<tapyrus.ECPair.ECPairInterface>();
  const keyStore = new wallet.KeyStore.ReactKeyStore(tapyrus.networks.dev);
  const dataStore = new wallet.DataStore.ReactDataStore();
  const config = new wallet.Config({
    host: 'localhost',
    port: 3000,
    path: '',
    network: 'dev',
  });
  const currentWallet = new wallet.Wallet.BaseWallet(
    keyStore,
    dataStore,
    config,
  );

  const [addTokenDialogVisible, setAddTokenDialogVisible] = React.useState(false);

  const createOrFirstKey = async () => {
    const keys = await keyStore.keys();
    if (keys.length > 0) {
      const keyPair = tapyrus.ECPair.fromPrivateKey(
        Buffer.from(keys[0], 'hex'),
        { network: tapyrus.networks.dev },
      );
      setKeyPair(keyPair);
    } else {
      const newKeyPair = tapyrus.ECPair.makeRandom({
        network: tapyrus.networks.dev,
      });
      setKeyPair(newKeyPair);
      keyStore.addPrivateKey(newKeyPair.toWIF());
    }
  };

  const [tpc, setTpc] = useState<wallet.Balance>(new wallet.Balance(wallet.Wallet.BaseWallet.COLOR_ID_FOR_TPC, 0, 0));
  const [tokens, setTokens] = useState<[Token, wallet.Balance][]>([]);

  const removeAllTokens = () => {
    return tokenStore.clear();
  };

  const addToken = (tokenType: number, colorId: string, name: string, ticker: string) => {
    tokenStore.add({colorId, tokenType, name, ticker}).then(() => {
      refreshTokens();
    }).then(() =>{
      setAddTokenDialogVisible(false);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const sync = () => {
    currentWallet.update().then(reload);
  };
  const reload = () => {
    createOrFirstKey();
    currentWallet.balance().then((balance) => {
      setTpc(balance);
    });
    refreshTokens();
  };

  const refreshTokens = () => {
    tokenStore.tokens().then((tokens: Token[]) => {
      return Promise.all(
        tokens.map((token: Token) => {
          return new Promise<[Token, wallet.Balance]>((resolve, reject) => {
            currentWallet.balance(token.colorId).then((balance: wallet.Balance) => {
              resolve([token, balance]);
            }).catch((reason) => {
              resolve([token, new wallet.Balance(token.colorId, 0, 0)]);
            });
          });
        })
      ).then((tokenAndBalances: [Token, wallet.Balance][]) => {
        setTokens(_ => tokenAndBalances);
      });
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ scene, navigation }) => (
        <Header scene={scene} navigation={navigation} actions={[
          <Appbar.Action
            icon="reload"
            onPress={sync}
          />,
          <Appbar.Action
            icon="delete"
            onPress={() => {
              removeAllTokens().then(() => {
                setTokens(_ => []);
              });
            }}
          />
        ]} />
      ),
    });
  }, [navigation]);

  const nativeToken = new Token({
    colorId: wallet.Wallet.BaseWallet.COLOR_ID_FOR_TPC,
    tokenType: 0,
    name: "TPC",
    ticker: "TPC",
  });
  return keyPair ? (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        <BalanceCard token={nativeToken} balance={tpc} currentWallet={currentWallet} keyPair={keyPair} />
        {
          tokens.map(([token, balance]) => {
            return <BalanceCard token={token} balance={balance} currentWallet={currentWallet} keyPair={keyPair} />;
          })
        }
      </ScrollView>
      <FAB icon="plus" style={styles.fab} onPress={() => {
        setAddTokenDialogVisible(true);
      }}/>
      <Portal>
        <AddTokenDialog visible={addTokenDialogVisible} onClose={() => setAddTokenDialogVisible(false)} onAdd={(tokenType: number, colorId: string, name: string, ticker: string) => addToken(tokenType, colorId, name, ticker)} />
      </Portal>
    </View>
  ) : (
    <ActivityIndicator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%'
  },
  button: {
    margin: 8,
    width: 100,
  },
  card: {
    margin: 8,
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
  fab: {
    position: 'absolute',
    margin: 32,
    right: 0,
    bottom: 0,
  },
});
