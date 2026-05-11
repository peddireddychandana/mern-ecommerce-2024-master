import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "@/config/api";

const initialState = { stats: null, isLoading: false };

const getMessage = (err) => {
  const data = err.response?.data;
  if (data && typeof data === "object") return data.message || "Something went wrong";
  return err.message || "Something went wrong";
};

export const getDashboardStats = createAsyncThunk("/dashboard/getDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
    return response.data;
  } catch (err) {
    return rejectWithValue({ message: getMessage(err) });
  }
});

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => { state.isLoading = true; })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state) => { state.isLoading = false; state.stats = null; });
  },
});

export default adminDashboardSlice.reducer;
