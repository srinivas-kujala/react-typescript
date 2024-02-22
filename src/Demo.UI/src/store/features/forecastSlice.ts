import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IForecast } from "../../interfaces/IForecats";
import weatherDataService from "../../services/weatherDataService";

export const fetchForecastes = createAsyncThunk<IForecast[], void, { rejectValue: string }>(
    "weather/Forecasts",
    async (_, thunkAPI) => {
        try {
            return weatherDataService.getForcastes()
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to fetch.");
        }
    }
);

export interface ForecastState {
    forecasts: IForecast[];
    loading: boolean;
    error: string | null;
}

const initialState: ForecastState = {
    forecasts: [],
    loading: false,
    error: null,
};

export const ForecastSlice = createSlice({
    name: "ForeCastes",
    initialState,
    reducers: {
        addForecast: (state, action: PayloadAction<IForecast>) => {
            state.forecasts = [...state.forecasts, action.payload]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchForecastes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForecastes.fulfilled, (state, action) => {
                state.loading = false;
                state.forecasts = action.payload;
            })
            .addCase(fetchForecastes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            });
    },
})

export const { addForecast } = ForecastSlice.actions;
export default ForecastSlice.reducer;