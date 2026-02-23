import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ScreenContainer from '@components/ScreenContainer';
import { Loader } from '@components/Loader';
import { hp, moderateScale, normalizeFont, wp } from '@utils/responsive';
import useNetworkStatus from '@hooks/useNetworkStatus';
import NoInternet from '@components/NoInternet';
import AnimatedListItem from '@components/AnimatedListItem';
import { fetchPhotos } from '@store/slices/photosSlice';
import { RootState, AppDispatch } from '../../../store/store'; // Adjust paths accordingly

// Define the Photo type according to your PhotosModel
interface Photo {
  id: string;
  name: string;
  email: string;
  // add other properties as needed
}

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { photos, loading, error } = useSelector(
    (state: RootState) => state.photos,
  );
  const isConnected = useNetworkStatus();

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
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

  const renderItem: ListRenderItem<Photo> = ({ item, index }) => (
    <AnimatedListItem index={index}>
      <TouchableOpacity onPress={() => { }}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      </TouchableOpacity>
    </AnimatedListItem>
  );

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={photos.map(photo => ({
            ...photo,
            id: String(photo.id),
          }))}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.container}
          renderItem={renderItem}
        />
      </View>
    </ScreenContainer>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
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
    fontSize: normalizeFont(18),
    marginBottom: moderateScale(10),
  },
  error: {
    color: 'red',
  },
});
