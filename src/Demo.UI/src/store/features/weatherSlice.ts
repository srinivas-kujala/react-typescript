import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Weather {
    id?: number;
    city: string;
    temp: number;
    createdBy: string;
    createdAt: Date;
    modifiedBy?: string;
    modifiedAt?: Date;
}

interface WeatherState {
    weathers: Weather[];
}

const initialState: WeatherState = {
    weathers: []
};

export const WeatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {
        addWeather: (state, action: PayloadAction<
            {
                city: string,
                temp: number,
                createdBy: string;
                createdAt: Date;
            }>) => {
            state.weathers.push({
                city: action.payload.city,
                temp: action.payload.temp,
                createdBy: action.payload.createdBy,
                createdAt: action.payload.createdAt
            })
        }
    }
})

export default WeatherSlice.reducer;
export const { addWeather } = WeatherSlice.actions;