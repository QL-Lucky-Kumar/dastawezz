import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "../slices/loginSlice"
import themeSlice from "../slices/themeSlice";

const rootReducer = combineReducers({
  loginSlice,
  themeSlice,
});

export default rootReducer;
