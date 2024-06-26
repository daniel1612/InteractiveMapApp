import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './mapSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import unitReducer from './unitSlice';

const store = configureStore({
  reducer: {
    map: mapReducer,
    auth: authReducer,
    theme: themeReducer,
    unit: unitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
