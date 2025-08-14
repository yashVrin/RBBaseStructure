import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Fonts from '@assets/Fonts';
import Colors from '@assets/Colors';
import ScreenContainer from '@components/ScreenContainer';
import { wp } from '@utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedOut } from '@store/slices/authSlice';
import { RootState } from '@store/store'; // adjust this import based on your store location

// Define the type for your navigation stack params, replace with your actual stack params if available
type RootStackParamList = {
  LoggerFile: undefined;
  Login: undefined;
  // other screens if needed
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const NavigationView = () => {
    return (
      <View style={styles.backgroundColorr}>
        <Text style={styles.textProfile}>Profile</Text>
      </View>
    );
  };

  const HeaderView = () => {
    return (
      <View style={styles.backgroundColorr1}>
        <Text
          onPress={() => {
            navigation.navigate('LoggerFile');
          }}
          style={styles.textProfile1}
        >
          Logger File
        </Text>
        <Text
          onPress={() => {
            if (isLoggedIn) {
              dispatch(setLoggedOut());
            } else {
              navigation.navigate('Login');
            }
          }}
          style={styles.textProfile1}
        >
          {isLoggedIn ? 'Log Out' : 'LogIn'}
        </Text>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationView />
        <HeaderView />
      </View>
    </ScreenContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  textProfile: {
    fontFamily: Fonts.MEDIUM,
    fontSize: 15,
    color: Colors.BLACK,
  },
  listView: {
    backgroundColor: Colors.BLACK,
    marginTop: 20,
    padding: 16,
  },
  backgroundColorr: {
    backgroundColor: Colors.WHITE,
    padding: 16,
  },
  textProfile1: {
    fontFamily: Fonts.MEDIUM,
    fontSize: 15,
    color: Colors.BLACK,
    paddingVertical: wp(5),
  },
  backgroundColorr1: {
    backgroundColor: Colors.BACKGROUND,
    padding: 16,
    marginTop: 12,
  },
});
