import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SPECIALITIES_API } from "../api/services";


import { queryClient } from "../api/queryClient";

// Async thunk to fetch specialties
export const fetchSpecialties = createAsyncThunk(
  "specialty/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["specialties"],
        queryFn: async () => {
          const response = await axios.get(SPECIALITIES_API);
          return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
      });
      return { data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch specialties"
      );
    }
  }
);

const specialtySlice = createSlice({
  name: "specialty",
  initialState: {
    specialties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties = action.payload;
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default specialtySlice.reducer;