import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  documentEditorValue: string;
}

const initialState: AuthState = {
    documentEditorValue: "",
};

const docValueSlice: any = createSlice({
  name: "documentEditor",
  initialState,
  reducers: {
    getDocumentValue(state, action) {
      state.documentEditorValue = action.payload;
    },
  },
});
export const { getDocumentValue } = docValueSlice.actions;
export default docValueSlice.reducer;
