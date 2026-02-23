import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ListRenderItem,
} from 'react-native';
import PermissionHandler from '@utils/PermissionHandler';
import ScreenContainer from '@components/ScreenContainer';
import AnimatedListItem from '@components/AnimatedListItem';
import { useI18n } from '../../../i18n/i18n';

type PermissionKey = 'camera' | 'location' | 'storage';

interface PermissionItem {
  key: PermissionKey;
  label: string;
}

const Search: React.FC = () => {
  const { t } = useI18n();

  const PERMISSIONS: PermissionItem[] = [
    { key: 'camera', label: t('cameraPermission') },
    { key: 'location', label: t('locationPermission') },
    { key: 'storage', label: t('storagePermission') },
  ];

  const handlePermissionRequest = async (key: PermissionKey) => {
    let result: { message?: string } | undefined;

    switch (key) {
      case 'camera':
        result = await PermissionHandler.requestCameraPermission();
        break;
      case 'location':
        result = await PermissionHandler.requestLocationPermission();
        break;
      case 'storage':
        result = await PermissionHandler.requestStoragePermission();
        break;
      default:
        return;
    }

    const titleMap: Record<PermissionKey, string> = {
      camera: t('cameraPermission'),
      location: t('locationPermission'),
      storage: t('storagePermission'),
    };

    Alert.alert(titleMap[key], result?.message || t('unknownResult'));
  };

  const renderItem: ListRenderItem<PermissionItem> = ({ item, index }) => (
    <AnimatedListItem index={index}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePermissionRequest(item.key)}
      >
        <Text style={styles.buttonText}>{item.label}</Text>
      </TouchableOpacity>
    </AnimatedListItem>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <FlatList
          data={PERMISSIONS}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScreenContainer>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  button: {
    backgroundColor: '#4e73df',
    padding: 16,
    marginVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
