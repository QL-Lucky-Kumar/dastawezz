import { createSlice, PayloadAction } from "@reduxjs/toolkit";

 interface AuthState {
  accessToken: string | null;
  userId:string;
}

const initialState: AuthState = {
  accessToken: null,
  userId:"",
};

 const loginSlice = createSlice({
  name: "loginToken",
  initialState,
  reducers: {
    logoutAction: (): AuthState => initialState,
    accessAdminToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    getUserIdForUniqueUser(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
  },
});

export const { accessAdminToken, logoutAction,getUserIdForUniqueUser} = loginSlice.actions;
export default loginSlice.reducer;
