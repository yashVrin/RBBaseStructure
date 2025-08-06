import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenContainer from '@components/ScreenContainer.js';
import { Loader } from '@components/Loader.js';
import { hp, moderateScale, normalizeFont, wp } from '@utils/responsive.js';
import useNetworkStatus from '@hooks/useNetworkStatus.js';
import NoInternet from '@components/NoInternet.js';
import { fetchPhotos } from '@store/slices/photosSlice.js';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector(state => state.photos);
  const isConnected = useNetworkStatus();

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  if (loading) {
    return <Loader />; // ✅ used here
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!isConnected) {
    return <NoInternet show={true} />;
  }

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={photos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => {
            /** @type {import('../../../types/common/models/PhotosModel').Photos} */
            const typedItem = item;

            return (
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.card}>
                  <Text style={styles.title}>{typedItem.name}</Text>
                  <Text>{typedItem.email}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScreenContainer>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    padding: wp(5),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: normalizeFont(18),
    marginBottom: moderateScale(10),
  },
  error: {
    color: 'red',
  },
});
