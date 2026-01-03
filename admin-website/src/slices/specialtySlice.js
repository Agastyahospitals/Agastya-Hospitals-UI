import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SPECIALITIES_API } from "../api";


// Async thunk to fetch specialties
export const fetchSpecialties = createAsyncThunk(
  "specialty/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(SPECIALITIES_API);
      // return only the data payload so reducers and components get the expected array
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch specialties");
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