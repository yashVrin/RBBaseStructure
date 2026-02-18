import { Platform } from 'react-native';
import Purchases, {
    PurchasesOffering,
    PurchasesPackage,
    CustomerInfo,
    LOG_LEVEL,
} from 'react-native-purchases';
import store from '../store/store';
import {
    setCustomerInfo,
    setOfferings,
    setPremiumStatus,
    setLoading,
    setError,
} from '../store/slices/subscriptionSlice';
import { LoggerService } from './LoggerService';

// Your RevenueCat API keys
const REVENUECAT_API_KEYS = {
    apple: 'test_FUzCYjCeRaeEyFkdyCnkTLwGODi',
    google: 'test_FUzCYjCeRaeEyFkdyCnkTLwGODi',
};

class RevenueCatService {
    /**
     * Initialize RevenueCat SDK
     */
    async initialize() {
        try {
            Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

            if (Platform.OS === 'android') {
                await Purchases.configure({ apiKey: REVENUECAT_API_KEYS.google });
            } else {
                await Purchases.configure({ apiKey: REVENUECAT_API_KEYS.apple });
            }

            // Optional: Set up listener for customer info updates
            Purchases.addCustomerInfoUpdateListener(info => {
                this.updateCustomerInfo(info);
            });

            // Fetch initial customer info
            const customerInfo = await Purchases.getCustomerInfo();
            this.updateCustomerInfo(customerInfo);

            this.loadOfferings();

            LoggerService.log({ message: 'RevenueCat initialized successfully' });
        } catch (error) {
            LoggerService.log({ message: 'RevenueCat initialization failed', error });
            store.dispatch(setError('Failed to initialize RevenueCat'));
        }
    }

    /**
     * Update Redux store with latest customer info and entitlement status
     */
    private updateCustomerInfo(info: CustomerInfo) {
        store.dispatch(setCustomerInfo(info));
        // Replace 'premium' with your actual entitlement ID from RevenueCat dashboard
        const isPremium = info.entitlements.active['premium'] !== undefined;
        store.dispatch(setPremiumStatus(isPremium));
    }

    /**
     * Load available offerings from RevenueCat
     */
    async loadOfferings() {
        store.dispatch(setLoading(true));
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current !== null) {
                store.dispatch(setOfferings(offerings.current));
            }
            store.dispatch(setLoading(false));
        } catch (error) {
            LoggerService.log({ message: 'Error fetching offerings', error });
            store.dispatch(setError('Failed to fetch offerings'));
            store.dispatch(setLoading(false));
        }
    }

    /**
     * Purchase a package
     */
    async purchasePackage(pkg: PurchasesPackage) {
        store.dispatch(setLoading(true));
        try {
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            this.updateCustomerInfo(customerInfo);
            store.dispatch(setLoading(false));
            return { success: true, customerInfo };
        } catch (error: any) {
            if (!error.userCancelled) {
                LoggerService.log({ message: 'Purchase failed', error });
                store.dispatch(setError(error.message || 'Purchase failed'));
            }
            store.dispatch(setLoading(false));
            return { success: false, error };
        }
    }

    /**
     * Restore previous purchases
     */
    async restorePurchases() {
        store.dispatch(setLoading(true));
        try {
            const customerInfo = await Purchases.restorePurchases();
            this.updateCustomerInfo(customerInfo);
            store.dispatch(setLoading(false));
            return { success: true, customerInfo };
        } catch (error: any) {
            LoggerService.log({ message: 'Restore failed', error });
            store.dispatch(setError(error.message || 'Restore failed'));
            store.dispatch(setLoading(false));
            return { success: false, error };
        }
    }

    /**
     * Identify user in RevenueCat (useful for cross-platform)
     */
    async identify(appUserId: string) {
        try {
            const { customerInfo } = await Purchases.logIn(appUserId);
            this.updateCustomerInfo(customerInfo);
        } catch (error) {
            LoggerService.log({ message: 'Error identifying user', error });
        }
    }

    /**
     * Log out from RevenueCat
     */
    async logOut() {
        try {
            const customerInfo = await Purchases.logOut();
            this.updateCustomerInfo(customerInfo);
        } catch (error) {
            LoggerService.log({ message: 'Error logging out', error });
        }
    }
}

export default new RevenueCatService();
