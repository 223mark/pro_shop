import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import  cartSliceReducer  from './slices/cartSlice';


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer
    },
    // ?
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    // in development mode
    devTools: true,
});

export default store;