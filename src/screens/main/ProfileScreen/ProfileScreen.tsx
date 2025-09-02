import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Fonts from '@assets/Fonts';
import Colors from '@assets/Colors';
import ScreenContainer from '@components/ScreenContainer';
import { wp } from '@utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedOut } from '@store/slices/authSlice';
import { RootState } from '@store/store';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useI18n } from '../../../i18n/i18n';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { t } = useI18n();

  const NavigationView = () => {
    return (
      <View style={styles.backgroundColorr}>
        <Text style={styles.textProfile}>{t('profile')}</Text>
      </View>
    );
  };

  const HeaderView = () => {
    return (
      <View style={styles.backgroundColorr1}>
        <TouchableOpacity onPress={() => navigation.navigate('LoggerFile')}>
          <Text style={styles.textProfile1}>{t('loggerFile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Language')}>
          <Text style={styles.textProfile1}>{t('changeLanguage')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (isLoggedIn) {
              dispatch(setLoggedOut());
            } else {
              navigation.navigate('Login');
            }
          }}
        >
          <Text style={styles.textProfile1}>{isLoggedIn ? t('logout') : t('login')}</Text>
        </TouchableOpacity>
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