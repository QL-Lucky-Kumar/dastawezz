import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "../slices/loginSlice"
import themeSlice from "../slices/themeSlice";
import docValueSlice from "../slices/docValueSlice";

const rootReducer = combineReducers({
  loginSlice,
  themeSlice,
  docValueSlice,
});

export default rootReducer;
