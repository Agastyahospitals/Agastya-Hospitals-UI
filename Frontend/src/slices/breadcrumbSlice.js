// src/store/breadcrumbSlice.js
import { createSlice } from "@reduxjs/toolkit";

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: {
    trail: ["Home"], // store breadcrumb path
    title: "",   // store breadcrumb title
  },
  reducers: {
    setBreadcrumb: (state, action) => {
      console.log("ACTION::: ", action);
      state.trail = action.payload; // action.payload should be an array of breadcrumb parts
      state.title = action.payload[action.payload.length - 1];
    },
  },
});

export const { setBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
