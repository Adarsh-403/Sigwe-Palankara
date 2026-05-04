import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
 name: 'auth',
 initialState: {
 user: null, // { uid, email, role }
 isAuthenticated: false,
 loading: true,
 },
 reducers: {
 setUser: (state, action) => {
 state.user = action.payload;
 state.isAuthenticated = !!action.payload;
 state.loading = false;
 },
 setLoading: (state, action) => {
 state.loading = action.payload;
 },
 },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
