import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DocState  ={
  documentEditorValue: string;
}

const initialState: DocState = {
    documentEditorValue: "",
};

 const docValueSlice = createSlice({
  name: "documentEditor",
  initialState,
  reducers: {
    getDocumentValue(state, action: PayloadAction<string>) {
      state.documentEditorValue = action.payload;
    },
  },
});
export const { getDocumentValue } = docValueSlice.actions;
export default docValueSlice.reducer;
