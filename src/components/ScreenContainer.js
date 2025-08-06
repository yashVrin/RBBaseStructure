import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@assets/Colors.js';

export default function ScreenContainer({ children, padding, width }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'bottom', 'left', 'right']}
        style={styles.cardView}
      >
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
});
