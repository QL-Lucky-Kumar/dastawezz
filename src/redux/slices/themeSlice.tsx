import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeColorState = {
  colorCode: string;
}

const initialState: ThemeColorState = {
  colorCode: "",
};

const themeSlice = createSlice({
  name: "themeColor",
  initialState,
  reducers: {
    getColorCode(state, action : PayloadAction<string>) {
      state.colorCode = action.payload;
    },
  },
});
export const { getColorCode } = themeSlice.actions;
export default themeSlice.reducer;
