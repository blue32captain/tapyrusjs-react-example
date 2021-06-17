import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  TextInput,
  RadioButton,
} from 'react-native-paper';
import * as React from 'react';
import { useState } from 'react';
import { View, Text } from '../components/Themed';

export default function AddTokenDialog({ visible, onClose, onAdd}) {

  const [tokenType, setTokenType] = useState<string>('');
  const [colorId, setColorId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ticker, setTicker] = useState<string>('');

  return <Dialog
          visible={visible}
          onDismiss={onClose}
        >
          <Dialog.Title>New Token</Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                label="Name"
                value={name}
                onChangeText={name => setName(name)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                label="Ticker"
                value={ticker}
                onChangeText={ticker => setTicker(ticker)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
              }}
            ><Text style={{margin: 8}}>token type</Text></View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
                margin: 8,
                borderColor: '#999999', 
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <RadioButton.Group onValueChange={newTokenType => setTokenType(newTokenType)} value={tokenType}>
                <RadioButton.Item label="Reissuable" value="c1" />
                <RadioButton.Item label="Non Reissuable" value="c2" />
                <RadioButton.Item label="NFT" value="c3" />
              </RadioButton.Group>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexBasis: 'auto',
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                label="Color ID"
                value={colorId}
                onChangeText={colorId => setColorId(colorId)}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                  onAdd(tokenType, colorId, name, ticker)
              }}
            >
              Create
            </Button>
            <Button
              style={styles.button}
              onPress={onClose}
            >Close
            </Button>
          </Dialog.Actions>
        </Dialog>;
}

const styles = StyleSheet.create({
  button: {
    margin: 8,
    width: 100,
  }
});
