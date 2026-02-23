import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import RevenueCatService from '../../services/RevenueCatService';
import { PurchasesPackage } from 'react-native-purchases';
import AnimatedListItem from '@components/AnimatedListItem';

const PaywallScreen: React.FC = () => {
    const { offerings, loading, isPremium, error } = useSelector(
        (state: RootState) => state.subscription
    );

    const handlePurchase = async (pkg: PurchasesPackage) => {
        const result = await RevenueCatService.purchasePackage(pkg);
        if (result.success) {
            Alert.alert('Success', 'Thank you for your purchase!');
        } else if (result.error && !result.error.userCancelled) {
            Alert.alert('Error', result.error.message || 'Purchase failed');
        }
    };

    const handleRestore = async () => {
        const result = await RevenueCatService.restorePurchases();
        if (result.success) {
            Alert.alert('Success', 'Purchases restored!');
        } else {
            Alert.alert('Error', 'Failed to restore purchases');
        }
    };

    const renderPackage = ({ item, index }: { item: PurchasesPackage; index: number }) => (
        <AnimatedListItem index={index}>
            <TouchableOpacity
                style={styles.packageCard}
                onPress={() => handlePurchase(item)}
            >
                <View>
                    <Text style={styles.packageTitle}>{item.product.title}</Text>
                    <Text style={styles.packageDescription}>{item.product.description}</Text>
                </View>
                <Text style={styles.packagePrice}>{item.product.priceString}</Text>
            </TouchableOpacity>
        </AnimatedListItem>
    );

    if (loading && !offerings) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Go Premium</Text>
            {isPremium ? (
                <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>You are a Premium User! ✨</Text>
                </View>
            ) : (
                <Text style={styles.subHeader}> Unlock all features and support our development</Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={offerings?.availablePackages || []}
                renderItem={renderPackage}
                keyExtractor={(item) => item.identifier}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No offerings available at the moment.</Text> : null
                }
            />

            <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
                <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 10,
        color: '#333',
    },
    subHeader: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    premiumBadge: {
        backgroundColor: '#E8F5E9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    premiumText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
    },
    packageCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    packageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    packageDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    packagePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
    restoreButton: {
        marginTop: 20,
        padding: 15,
    },
    restoreText: {
        textAlign: 'center',
        color: '#007AFF',
        fontSize: 16,
    },
});

export default PaywallScreen;
