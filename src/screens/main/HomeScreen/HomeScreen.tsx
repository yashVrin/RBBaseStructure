import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '@store/slices/postsSlice';
import ScreenContainer from '@components/ScreenContainer';
import { Loader } from '@components/Loader';
import { hp, moderateScale, normalizeFont, wp } from '@utils/responsive';
import useNetworkStatus from '@hooks/useNetworkStatus';
import NoInternet from '@components/NoInternet';
import type { RootState, AppDispatch } from '../../../store/store'; // Adjust this path
import type { PostModel } from '../../../types/PostModel'; // <-- Update this path if needed

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );
  const isConnected = useNetworkStatus();

  useEffect(() => {
    dispatch(fetchPosts());
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

  const renderItem = ({ item }: { item: PostModel }) => (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.body}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.container}
          renderItem={renderItem}
        />
      </View>
    </ScreenContainer>
  );
};

export default HomeScreen;

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
