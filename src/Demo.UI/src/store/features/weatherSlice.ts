import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IForecast } from "../../interfaces/IForecats"

export interface WeatherInitialState {
    weathers: IForecast[]
}

const initialState: WeatherInitialState = {
    weathers: []
}

export const WeatherSlice = createSlice({
    name: 'Weather',
    initialState,
    reducers: {
        get: (state, action: PayloadAction<IForecast[]>) => {
            state.weathers = action.payload;
        },
        add: (state, action: PayloadAction<IForecast>) => {
            state.weathers = [...state.weathers, action.payload]
        },
        update: (state, action: PayloadAction<IForecast>) => {
            state.weathers.map((forecast) => {
                if (forecast.id === action.payload.id) {
                    return {
                        ...state.weathers,
                        ...action.payload,
                    };
                } else {
                    return state.weathers;
                }
            });
        },
        deleteById: (state, action: PayloadAction<number>) => {
            state.weathers.filter(({ id }) => id !== action.payload);
        }
    }
})

export const { get, add, update, deleteById } = WeatherSlice.actions
export default WeatherSlice.reducer