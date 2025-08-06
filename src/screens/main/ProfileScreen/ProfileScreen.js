import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Fonts from '@assets/Fonts.js';
import Colors from '@assets/Colors.js';
import ScreenContainer from '@components/ScreenContainer.js';
import { wp } from '@utils/responsive.js';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedOut } from '@store/slices/authSlice.js';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const NavigationView = () => {
    return (
      <>
        <View style={styles.backgroundColorr}>
          <Text style={styles.textProfile}>{'Profile'}</Text>
        </View>
      </>
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
          {'Logger File'}
        </Text>
        <Text
          onPress={() => {
            isLoggedIn
              ? dispatch(setLoggedOut())
              : navigation.navigate('Login');
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
        {NavigationView()}
        {HeaderView()}
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
