import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Weather, IWeather } from "../../entities/Weather";
import weatherDataService from "../../services/weatherDataService";

export const getWeatherApi = createAsyncThunk<IWeather[], void, { rejectValue: string }>(
    "Weather/getWeatherApi",
    async (_, thunkAPI) => {
        let errorMessage: string = '';
        try {
            let entities: IWeather[] = [];
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

export const insertWeatherApi = createAsyncThunk(
    "Weather/insertWeatherApi",
    async (data: IWeather, thunkAPI) => {
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

export const updateWeatherApi = createAsyncThunk(
    "Weather/updateWeatherApi",
    async (data: IWeather, thunkAPI) => {
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

export const bulkUpdateWeathersApi = createAsyncThunk(
    "Weather/bulkUpdateWeathersApi",
    async (data: IWeather[], thunkAPI) => {
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

export const bulkDeleteWeathersApi = createAsyncThunk(
    "Weather/bulkDeleteWeathersApi",
    async (data: IWeather[], thunkAPI) => {
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

export interface WeatherState {
    weathers: IWeather[];
    loading: boolean;
    error: string | null;
}

const initialState: WeatherState = {
    weathers: [],
    loading: false,
    error: null,
};

export const WeatherSlice = createSlice({
    name: "Weathers",
    initialState,
    reducers: {
        getWeathers: (state) => {
            let summaries: string[] =
                [
                    "Freezing",
                    "Bracing",
                    "Chilly",
                    "Cool",
                    "Mild",
                    "Warm",
                    "Balmy",
                    "Hot",
                    "Sweltering",
                    "Scorching"
                ];

            const getRandomInRange = (min: number, max: number) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let weathers = [];
            for (var i = 0; i < 15; i++) {
                let entity = new Weather();

                let temperatureC = getRandomInRange(-20, 55);
                let temperatureF = 32 + Math.trunc(temperatureC / 0.5556)
                let date = new Date(new Date());
                date.setDate(date.getDate() + i);

                entity.id = i
                entity.date = date,
                entity.temperatureC = temperatureC,
                entity.temperatureF = temperatureF,
                entity.summary = summaries[getRandomInRange(0, summaries.length)],
                entity.createdBy = 'Demo.UI'
                entity.createdAt = new Date()

                weathers.push(entity);
            }

            state.error = null;
            state.loading = false;
            state.weathers = weathers;
        },
        addOrUpdateWeather: (state, action: PayloadAction<IWeather>) => {
            state.weathers = [
                ...state.weathers.filter(weather => {
                    if (weather.id == action.payload.id) {
                    }
                    else
                        return weather;
                }),
                Object.assign({}, action.payload)
            ]
        },
        bulkUpdateWeathers: (state, action: PayloadAction<IWeather[]>) => {
            state.weathers = state.weathers.filter(weather => {
                let entity = action.payload.find(x => x.id == weather.id);

                if (!entity)
                    return weather;
                else
                    return entity;
            });
        },
        deleteWeather: (state, action: PayloadAction<IWeather>) => {
            state.weathers = state.weathers.filter(weather => weather.id !== action.payload.id);
        },
        bulkDeleteWeathers: (state, action: PayloadAction<IWeather[]>) => {
            const datesToDelete = action.payload.map(weather => weather.id);

            state.weathers = state.weathers.filter(weather => !datesToDelete.includes(weather.id));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWeatherApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWeatherApi.fulfilled, (state, action) => {
                state.loading = false;
                state.weathers = action.payload;
            })
            .addCase(getWeatherApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(insertWeatherApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.weathers = [...state.weathers, action.payload.entity]
                }
            })
            .addCase(insertWeatherApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(updateWeatherApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.weathers = [
                        ...state.weathers.filter(weather => {
                            if (weather.id !== action.payload.entity.id)
                                return weather;
                        }),
                        Object.assign({}, action.payload.entity)
                    ]
                }
            })
            .addCase(updateWeatherApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(bulkUpdateWeathersApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.weathers = state.weathers.filter(weather => {
                        let entity = action.payload.entities.find(x => x.id == weather.id);

                        if (!entity)
                            return weather;
                        else
                            return entity;
                    });
                }
            })
            .addCase(bulkUpdateWeathersApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(bulkDeleteWeathersApi.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.weathers = state.weathers.filter(weather => {
                        let entity = action.payload.entities.find(x => x.id == weather.id);

                        if (!entity)
                            return weather;
                    });
                }
            })
            .addCase(bulkDeleteWeathersApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            });
    },
})

export const
    {
        getWeathers,
        addOrUpdateWeather,
        bulkUpdateWeathers,
        deleteWeather,
        bulkDeleteWeathers
    } = WeatherSlice.actions;
export default WeatherSlice.reducer;