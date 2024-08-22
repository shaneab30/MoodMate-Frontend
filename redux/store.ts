import { configureStore } from "@reduxjs/toolkit";
import { user } from "./features/userSlice";

export const store = configureStore({
  reducer: {
    user: user.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;