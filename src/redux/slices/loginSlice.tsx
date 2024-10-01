import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  userId:string;
}

const initialState: AuthState = {
  accessToken: null,
  userId:"",
};

const loginSlice: any = createSlice({
  name: "loginTokken",
  initialState,
  reducers: {
    logoutAction: (): AuthState => initialState,
    accessAdminTokken(state, action) {
      state.accessToken = action.payload;
    },
    getUserIdForUniqueUser(state, action) {
      state.userId = action.payload;
    },
  },
});
export const { accessAdminTokken, logoutAction,getUserIdForUniqueUser} = loginSlice.actions;
export default loginSlice.reducer;
