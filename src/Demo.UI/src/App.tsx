import { useEffect, useState } from 'react';
import './App.css';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

function App() {
    const [forecasts, setForecasts] = useState<Forecast[]>();

    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateWeatherData() {
        //const response = await fetch('demo/api/Weather/getweatherforecast');
        //const data = await response.json();
        setForecasts([
            {
                "date": "2024-02-20",
                "temperatureC": -15,
                "temperatureF": 6,
                "summary": "Cool"
            },
            {
                "date": "2024-02-21",
                "temperatureC": 23,
                "temperatureF": 73,
                "summary": "Freezing"
            },
            {
                "date": "2024-02-22",
                "temperatureC": 39,
                "temperatureF": 102,
                "summary": "Sweltering"
            },
            {
                "date": "2024-02-23",
                "temperatureC": 26,
                "temperatureF": 78,
                "summary": "Sweltering"
            },
            {
                "date": "2024-02-24",
                "temperatureC": 8,
                "temperatureF": 46,
                "summary": "Hot"
            }
        ]);
    }
}

export default App;