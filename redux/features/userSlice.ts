import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
    currentUser: UserData | null;
}

const initialState = {
    currentUser: null
} as UserState;

export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset : () => initialState,
        login: (state, action: PayloadAction<UserData>) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        }
    }
})

export const {
    login,
    logout,
    reset,
} = user.actions;
export default user.reducer;