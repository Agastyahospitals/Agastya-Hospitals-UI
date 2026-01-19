import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BLOGS_API } from "../api/services";

import { queryClient } from "../api/queryClient";

// Async thunks
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axios.get(BLOGS_API);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
  return data;
});

// Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default blogSlice.reducer;
