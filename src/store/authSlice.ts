import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
};
// Create a slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string, userId: string }>) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout(state) {
      state.token = null;
      state.userId = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
