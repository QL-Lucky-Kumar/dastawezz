import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  colorCode: string;
}

const initialState: AuthState = {
  colorCode: "#fff",
};

const themeSlice: any = createSlice({
  name: "themeColor",
  initialState,
  reducers: {
    getColorCode(state, action) {
      state.colorCode = action.payload;
    },
  },
});
export const { getColorCode } = themeSlice.actions;
export default themeSlice.reducer;
