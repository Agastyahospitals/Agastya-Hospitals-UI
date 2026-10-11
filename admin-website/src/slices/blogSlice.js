import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  BLOGS_API,
  CREATE_BLOGS_API,
  DELETE_BLOGS_API,
  UPDATE_BLOGS_API,
} from "../api";

import { queryClient } from "../api/queryClient";

// Async thunks
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (options = {}) => {
    const forceRefresh =
      typeof options === "boolean" ? options : Boolean(options?.forceRefresh);

    if (forceRefresh) {
      queryClient.removeQueries({ queryKey: ["blogs"] });
    }

    const data = await queryClient.fetchQuery({
      queryKey: ["blogs"],
      queryFn: async () => {
        const response = await axios.get(BLOGS_API);
        return response.data;
      },
      staleTime: forceRefresh ? 0 : 1000 * 60 * 5,
    });
    return data;
  }
);

export const addBlog = createAsyncThunk("blogs/addBlog", async (blogData) => {
  const response = await axios.post(CREATE_BLOGS_API, blogData);
  queryClient.removeQueries({ queryKey: ["blogs"] });
  return response.data;
});

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }) => {
    const response = await axios.put(
      `${UPDATE_BLOGS_API}?blogID=${id}`,
      blogData
    );
    queryClient.removeQueries({ queryKey: ["blogs"] });
    return response.data;
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  const response = await axios.delete(`${DELETE_BLOGS_API}?blogID=${id}`);
  queryClient.removeQueries({ queryKey: ["blogs"] });
  return response.message;
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
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        const blogsList = Array.isArray(state.blogs)
          ? state.blogs
          : state.blogs?.data;
        if (Array.isArray(blogsList)) {
          blogsList.push(action.payload);
        }
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updatedBlog = action.payload?.data || action.payload;
        const targetId =
          updatedBlog?.blogID || updatedBlog?._id || updatedBlog?.id;
        const blogsList = Array.isArray(state.blogs)
          ? state.blogs
          : state.blogs?.data;
        if (Array.isArray(blogsList)) {
          const index = blogsList.findIndex(
            (blog) =>
              (blog.blogID || blog._id || blog.id) === targetId
          );
          if (index !== -1) {
            blogsList[index] = updatedBlog;
          }
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const targetId = action.payload;
        if (Array.isArray(state.blogs)) {
          state.blogs = state.blogs.filter(
            (blog) => (blog.blogID || blog._id || blog.id) !== targetId
          );
        } else if (Array.isArray(state.blogs?.data)) {
          state.blogs.data = state.blogs.data.filter(
            (blog) => (blog.blogID || blog._id || blog.id) !== targetId
          );
        }
      });
  },
});

export default blogSlice.reducer;
