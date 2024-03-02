import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { WeatherSlice } from "./features/WeatherSlice";

export const store = configureStore({
    reducer: {
        weather: WeatherSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()