import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@assets/Colors';

type ScreenContainerProps = {
  children: ReactNode;
  padding?: number; // Not used currently but typed if you want to use later
  width?: number; // Same as above
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  padding,
  width,
}) => {
  // You can apply padding or width to style if needed here
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
};

export default ScreenContainer;

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
});
