import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { ForecastSlice } from "./features/forecastSlice";

export const store = configureStore({
    reducer: {
        forecast: ForecastSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()