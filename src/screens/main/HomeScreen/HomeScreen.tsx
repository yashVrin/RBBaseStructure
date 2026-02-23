import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '@store/slices/postsSlice';
import ScreenContainer from '@components/ScreenContainer';
import { Loader } from '@components/Loader';
import { hp, moderateScale, normalizeFont, wp } from '@utils/responsive';
import useNetworkStatus from '@hooks/useNetworkStatus';
import NoInternet from '@components/NoInternet';
import AnimatedListItem from '@components/AnimatedListItem';
import SkeletonLoader from '@components/SkeletonLoader';
import type { RootState, AppDispatch } from '../../../store/store'; // Adjust this path
import type { PostModel } from '../../../types/PostModel'; // <-- Update this path if needed

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );
  const isConnected = useNetworkStatus();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [-20, 0],
    extrapolate: 'clamp',
  });

  // ... inside HomeScreen component
  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} style={[styles.card, { backgroundColor: 'transparent', elevation: 0 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
                <SkeletonLoader width="40%" height={20} />
              </View>
              <SkeletonLoader width="100%" height={16} style={{ marginBottom: 6 }} />
              <SkeletonLoader width="100%" height={16} style={{ marginBottom: 6 }} />
              <SkeletonLoader width="60%" height={16} />
            </View>
          ))}
        </View>
      </ScreenContainer>
    );
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

  const renderItem = ({ item, index }: { item: PostModel; index: number }) => (
    <AnimatedListItem index={index}>
      <TouchableOpacity onPress={() => { }}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.body}</Text>
        </View>
      </TouchableOpacity>
    </AnimatedListItem>
  );

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>Home Feed</Text>
        </Animated.View>

        <Animated.FlatList
          data={posts}
          keyExtractor={(item: PostModel) => item.id.toString()}
          contentContainerStyle={[styles.container, { paddingTop: 60 }]}
          renderItem={renderItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
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
  header: { // New header style
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { // New header title style
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
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
