import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '@assets/Colors';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default styles;
