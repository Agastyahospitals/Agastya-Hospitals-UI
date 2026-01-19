// src/redux/slices/doctorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { DOCTORS_API } from "../api";

import { queryClient } from "../api/queryClient";

// Async thunk to fetch doctor list
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["doctors"],
        queryFn: async () => {
          const response = await axios.get(DOCTORS_API);
          return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctors/deleteDoctor",
  async (id) => {
    const response = await axios.delete(`${DOCTORS_API}?doctorID=${id}`);
    return response.message;
  }
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((dep) => dep.id !== action.payload);
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default doctorSlice.reducer;
