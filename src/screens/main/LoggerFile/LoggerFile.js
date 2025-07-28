import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LoggerService } from '../../../services/LoggerService';

export default function LoggerFile() {
  const [logs, setLogs] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState(new Set());
  const [measuredHeights, setMeasuredHeights] = useState({});

  const animatedControllers = useRef([]);

  useEffect(() => {
    const fetchedLogs = LoggerService.getLogs();
    setLogs(fetchedLogs);
    animatedControllers.current = fetchedLogs.map(() => new Animated.Value(0));
  }, []);

  const toggleExpand = index => {
    const controller = animatedControllers.current[index];
    const isExpanded = expandedIndexes.has(index);
    const targetHeight = measuredHeights[index] || 0;

    Animated.timing(controller, {
      toValue: isExpanded ? 0 : targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpandedIndexes(prev => {
      const newSet = new Set(prev);
      isExpanded ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const renderItem = ({ item, index }) => {
    const heightAnim = animatedControllers.current[index];

    return (
      <View style={styles.logEntry}>
        <TouchableOpacity onPress={() => toggleExpand(index)}>
          <Text style={styles.urlText}>
            {item.url || item.username || `Item ${index}`}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[styles.animatedContainer, { height: heightAnim }]}
        >
          <View
            style={styles.detailsWrapper}
            onLayout={event => {
              const height = event.nativeEvent.layout.height;
              if (!measuredHeights[index]) {
                setMeasuredHeights(prev => ({ ...prev, [index]: height }));
              }
            }}
          >
            <Text>Time: {item.time}</Text>
            <Text>Method: {item.method}</Text>
            <Text>Status: {item.status}</Text>
            {item.response && (
              <Text>Response: {JSON.stringify(item.response)}</Text>
            )}
            {item.error && (
              <Text style={styles.errorText}>Error: {item.error}</Text>
            )}
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoggerFile - Logs</Text>
      <View style={styles.spacer} />
      {logs.length === 0 ? (
        <Text style={styles.noLogsText}>No logs available.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.logContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  logContainer: { paddingBottom: 16 },
  logEntry: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  urlText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
  },
  animatedContainer: {
    overflow: 'hidden',
  },
  detailsWrapper: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute', // So it takes full height but doesn't stack
    width: '100%',
  },
  errorText: { color: 'red' },
  noLogsText: { fontStyle: 'italic', color: '#777', marginTop: 16 },
  spacer: { height: 8 },
});
