import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionState {
    isPremium: boolean;
    offerings: any | null;
    customerInfo: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    isPremium: false,
    offerings: null,
    customerInfo: null,
    loading: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setPremiumStatus: (state, action: PayloadAction<boolean>) => {
            state.isPremium = action.payload;
        },
        setOfferings: (state, action: PayloadAction<any>) => {
            state.offerings = action.payload;
        },
        setCustomerInfo: (state, action: PayloadAction<any>) => {
            state.customerInfo = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setLoading,
    setPremiumStatus,
    setOfferings,
    setCustomerInfo,
    setError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
