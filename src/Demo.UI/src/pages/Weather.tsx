import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../assets/css/weather.css';
import { fetchForecastes } from '../store/features/forecastSlice';
import { AppDispatch, RootState, useAppDispatch } from '../store/store';

export default function Weather() {

    const dispatch: AppDispatch = useAppDispatch();
    const weatherForecasts = useSelector((state: RootState) => state.forecast.forecasts);
    const loading = useSelector((state: RootState) => state.forecast.loading);
    const error = useSelector((state: RootState) => state.forecast.error);

    useEffect(() => { dispatch(fetchForecastes()) }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <table className="table table-striped" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        weatherForecasts?.map(forecast =>
                            <tr key={forecast.date}>
                                <td>{forecast.date}</td>
                                <td>{forecast.temperatureC}</td>
                                <td>{forecast.temperatureF}</td>
                                <td>{forecast.summary}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );

}