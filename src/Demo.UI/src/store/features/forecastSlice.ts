import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import weatherDataService from "../../services/weatherDataService";
import { Forecast, IForecast } from "../../entities/Forecast";

export const fetchForecastes = createAsyncThunk<IForecast[], void, { rejectValue: string }>(
    "weather/Forecasts",
    async (_, thunkAPI) => {
        let errorMessage: string = '';
        try {
            let entities: IForecast[] = [];
            await weatherDataService.getForcastes()
                .then(x => {
                    entities = x;
                })
            return entities;

        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to fecth. Error occured : [${errorMessage}]`);
        }
    }
);

export const addWeather = createAsyncThunk(
    "weather/addWeather",
    async (data: IForecast, thunkAPI) => {
        let response = { success: false, entity: data };
        try {
            await weatherDataService.insert(data)
                .then(x => {
                    if (x.success) {
                        response.success = true;
                    }
                    else {
                        thunkAPI.rejectWithValue(x.errorMessage);
                    }
                })
            return response;

        } catch (error) {
            return thunkAPI.rejectWithValue(`Error occured on api call : [${error}]`);
        }
    }
);

export const updateWeather = createAsyncThunk(
    "Weather/updateWeather",
    async (data: IForecast, thunkAPI) => {
        let response = { success: false, entity: data };
        try {
            await weatherDataService.update(data)
                .then(x => {
                    if (x.success) {
                        response.success = true;
                    }
                    else {
                        thunkAPI.rejectWithValue(x.errorMessage);
                    }
                })
            return response;

        } catch (error) {
            return thunkAPI.rejectWithValue(`Error occured on api call : [${error}]`);
        }
    }
);

export const deleteWeather = createAsyncThunk(
    "Weather/deleteWeather",
    async (date: Date, thunkAPI) => {
        let response = { success: false, date: date };
        try {
            await weatherDataService.delete(date.toLocaleString())
                .then(x => {
                    if (x.success) {
                        response.success = true;
                    }
                    else {
                        thunkAPI.rejectWithValue(x.errorMessage);
                    }
                })
            return response;

        } catch (error) {
            return thunkAPI.rejectWithValue(`Error occured on api call : [${error}]`);
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
        addOrUpdateForecast: (state, action: PayloadAction<IForecast>) => {
            let found: boolean = false;
            state.forecasts = [
                ...state.forecasts.filter(forecast => {
                    if (forecast.date == action.payload.date) {
                        found = true;
                    }
                    else
                        return forecast;
                }),
                Object.assign({}, action.payload)
            ]
        },
        deleteForecast: (state, action: PayloadAction<IForecast>) => {
            state.forecasts = state.forecasts.filter(forecast => forecast.date !== action.payload.date);
        },
        bulkDeleteForecast: (state, action: PayloadAction<IForecast[]>) => {

            let currentForecasts: Forecast[] = [...state.forecasts];
            for (var i = 0; i < action.payload.length; i++) {
                let forecast: IForecast = action.payload[i];

                let indexOfItemToDelete = currentForecasts.findIndex(x => x.date == forecast.date);

                if (indexOfItemToDelete > 0) {
                    currentForecasts.splice(indexOfItemToDelete, 1);
                }
            }
            state.forecasts = currentForecasts;
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
            })
            .addCase(addWeather.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.forecasts = [...state.forecasts, action.payload.entity]
                }
            })
            .addCase(addWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(updateWeather.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.forecasts = [
                        ...state.forecasts.filter(forecast => {
                            if (forecast.date !== action.payload.entity.date)
                                return forecast;
                        }),
                        Object.assign({}, action.payload.entity)
                    ]
                }
            })
            .addCase(updateWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            }).addCase(deleteWeather.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.forecasts = state.forecasts.filter(forecast => forecast.date !== action.payload.date);
                }
            })
            .addCase(deleteWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            });
    },
})

export const { addOrUpdateForecast, deleteForecast, bulkDeleteForecast } = ForecastSlice.actions;
export default ForecastSlice.reducer;