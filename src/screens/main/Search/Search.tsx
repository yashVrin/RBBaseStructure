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

type PermissionKey = 'camera' | 'location' | 'storage' | 'notifications';

interface PermissionItem {
  key: PermissionKey;
  label: string;
}

const PERMISSIONS: PermissionItem[] = [
  { key: 'camera', label: 'Camera Permission' },
  { key: 'location', label: 'Location Permission' },
  { key: 'storage', label: 'Storage Permission' },
  { key: 'notifications', label: 'Notifications Permission' },
];

const Search: React.FC = () => {
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
      case 'notifications':
        result = await PermissionHandler.requestNotificationsPermission();
        break;
      default:
        return;
    }

    Alert.alert(
      `${key.charAt(0).toUpperCase() + key.slice(1)} Permission`,
      result?.message || 'Unknown result',
    );
  };

  const renderItem: ListRenderItem<PermissionItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePermissionRequest(item.key)}
    >
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
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
