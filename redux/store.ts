import { configureStore } from "@reduxjs/toolkit";
import { user } from "./features/userSlice";
import storage from 'redux-persist/lib/storage'; 
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'user',
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, user.reducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;