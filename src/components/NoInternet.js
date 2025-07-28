import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Colors from '../assets/Colors';
import { wp } from '../utils/responsive';
import Fonts from '../assets/Fonts';
import { Images } from '../assets/Images';

export default function NoInternet({ show }) {
  const [loader, showLoader] = useState(false);
  const _backAction = () => {
    Alert.alert('app_name', 'are_you_sure_want_to_exit_app', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  const styless = [
    {
      justifyContent: 'center',
      width: '100%',
      backgroundColor: Colors.PRIMARY,
      borderRadius: 10,
      alignItems: 'center',
      padding: 13,
      height: 44,
      alignSelf: 'center',
    },
  ];

  const BottomButton = () => {
    return (
      <View style={styles.bottomView1}>
        <TouchableOpacity
          style={styless}
          onPress={() => {
            showLoader(true);
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {loader ? (
              <ActivityIndicator color={Colors.WHITE} size="large" />
            ) : null}
            <Text
              style={{
                fontFamily: Fonts.EXTRA_BOLD,
                fontSize: 14,
                color: Colors.WHITE,
                textAlign: 'center',
                marginLeft: 5,
              }}
            >
              {'try again'.toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={show}
      style={{ margin: 0 }}
      coverScreen
      backdropColor={Colors.WHITE}
      deviceHeight={Dimensions.get('screen').height}
      deviceWidth={Dimensions.get('screen').width}
      onBackButtonPress={() => _backAction()}
    >
      <>
        <View style={{ flex: 1 }}>
          <View style={styles.viewStyle}>
            <Image
              source={Images.WIFI}
              resizeMode={'contain'}
              style={{ width: 380, height: 311, marginTop: 50 }}
            />
            <Text style={styles.infoStyle}>{'oops'}</Text>
            <Text style={styles.infoStyle1}>
              {'there_is_connection_error_please_check_internet_and_try_again'}
            </Text>
          </View>
          {BottomButton()}
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  infoStyle: {
    fontSize: 42,
    color: Colors.BLACK,
    textAlign: 'center',
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
  },
  viewStyle: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  infoStyle1: {
    fontSize: 16,
    color: Colors.BLACK,
    textAlign: 'center',
    fontFamily: Fonts.REGULAR,
    fontWeight: '500',
    marginTop: 14,
  },
  bottomView1: {
    shadowColor: Colors.GRAY_LIGHT,
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 4,
    elevation: 20,
    padding: 12,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: wp(10),
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
});
