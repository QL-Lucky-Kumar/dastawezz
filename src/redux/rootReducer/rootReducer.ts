import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "../slices/loginSlice"

const rootReducer = combineReducers({
  loginSlice,
});

export default rootReducer;
