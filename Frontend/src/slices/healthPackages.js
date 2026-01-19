import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { HEALTH_PACKAGES_API } from '../api/services';

import { queryClient } from "../api/queryClient";

export const fetchHealthPackages = createAsyncThunk(
    'healthPackages/fetchHealthPackages',
    async (_, thunkAPI) => {
        try {
            const data = await queryClient.fetchQuery({
                queryKey: ["healthPackages"],
                queryFn: async () => {
                    const response = await axios.get(HEALTH_PACKAGES_API);
                    return response.data;
                },
                staleTime: 1000 * 60 * 5,
            });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

const healthPackagesSlice = createSlice({
    name: 'healthPackages',
    initialState: {
        packages: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHealthPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHealthPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(fetchHealthPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default healthPackagesSlice.reducer;