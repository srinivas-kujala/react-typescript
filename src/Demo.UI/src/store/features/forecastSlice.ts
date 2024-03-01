import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IForecast } from "../../entities/Forecast";
import weatherDataService from "../../services/weatherDataService";

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

export const bulkUpdateWeathers = createAsyncThunk(
    "Weather/bulkUpdateWeathers",
    async (data: IForecast[], thunkAPI) => {
        let response = { success: false, entities: data };
        try {
            await weatherDataService.bulkUpdate(data)
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

export const bulkDeleteWeathers = createAsyncThunk(
    "Weather/bulkDeleteWeathers",
    async (data: IForecast[], thunkAPI) => {
        let response = { success: false, entities: data };
        try {
            await weatherDataService.bulkDelete(data)
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
            state.forecasts = [
                ...state.forecasts.filter(forecast => {
                    if (forecast.date == action.payload.date) {
                    }
                    else
                        return forecast;
                }),
                Object.assign({}, action.payload)
            ]
        },
        bulkUpdateForecasts: (state, action: PayloadAction<IForecast[]>) => {
            state.forecasts = state.forecasts.filter(forecast => {
                let entity = action.payload.find(x => x.date == forecast.date);

                if (!entity)
                    return forecast;
                else
                    return entity;
            });
        },
        deleteForecast: (state, action: PayloadAction<IForecast>) => {
            state.forecasts = state.forecasts.filter(forecast => forecast.date !== action.payload.date);
        },
        bulkDeleteForecasts: (state, action: PayloadAction<IForecast[]>) => {
            const datesToDelete = action.payload.map(forcast => forcast.date);

            state.forecasts = state.forecasts.filter(forecast => !datesToDelete.includes(forecast.date));
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
            })
            .addCase(bulkUpdateWeathers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.forecasts = state.forecasts.filter(forecast => {
                        let entity = action.payload.entities.find(x => x.date == forecast.date);

                        if (!entity)
                            return forecast;
                        else
                            return entity;
                    });
                }
            })
            .addCase(bulkUpdateWeathers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(bulkDeleteWeathers.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.forecasts = state.forecasts.filter(forecast => {
                        let entity = action.payload.entities.find(x => x.date == forecast.date);

                        if (!entity)
                            return forecast;
                    });
                }
            })
            .addCase(bulkDeleteWeathers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            });
    },
})

export const { addOrUpdateForecast, bulkUpdateForecasts, deleteForecast, bulkDeleteForecasts } = ForecastSlice.actions;
export default ForecastSlice.reducer;