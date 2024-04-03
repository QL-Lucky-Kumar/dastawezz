import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
};

const loginSlice: any = createSlice({
  name: "loginTokken",
  initialState,
  reducers: {
    logoutAction: (): AuthState => initialState,
    accessAdminTokken(state, action) {
      state.accessToken = action.payload;
    },
  },
});
export const { accessAdminTokken, logoutAction } = loginSlice.actions;
export default loginSlice.reducer;
