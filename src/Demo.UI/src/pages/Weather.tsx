import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import '../assets/css/weather.css';
import { IForecast } from '../interfaces/IForecats';
import { addOrUpdateForecast, deleteForecast, fetchForecastes } from '../store/features/forecastSlice';
import { AppDispatch, RootState, useAppDispatch } from '../store/store';

export default function Weather() {

    const dispatch: AppDispatch = useAppDispatch();
    const weatherForecasts = useSelector((state: RootState) => state.forecast.forecasts);
    const loading = useSelector((state: RootState) => state.forecast.loading);
    const error = useSelector((state: RootState) => state.forecast.error);

    const [show, setshow] = useState(false);

    const [readOnly, setReadOnly] = useState(false);

    const [date, setDate] = useState('');

    const [tempC, setTempC] = useState(0);

    const [tempF, setTempF] = useState(0);

    const [summary, setSummary] = useState('');

    useEffect(() => { dispatch(fetchForecastes()) }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleShow = () => {
        setshow(true);
    }

    const handleClose = () => {
        setshow(false);
    }

    const handleForecastDate = (e: any) => {
        setDate(e.target.value);
    };

    const handleForecastTempC = (e: any) => {
        setTempC(e.target.value);
    };

    const handleForecastTempF = (e: any) => {
        setTempF(e.target.value);
    };

    const handleForecastSummary = (e: any) => {
        setSummary(e.target.value);
    };

    const handleSaveForecast = () => {
        const weatherData: IForecast = {
            date: date,
            temperatureC: tempC,
            temperatureF: tempF,
            summary: summary
        };

        dispatch(addOrUpdateForecast(weatherData));
        handleClose();
        setReadOnly(false);
    }

    const handleUpdateForecast = (forecast: IForecast) => {
        handleShow();
        setReadOnly(true);
        setDate(forecast.date);
        setSummary(forecast.summary);
        setTempC(forecast.temperatureC);
        setTempF(forecast.temperatureF);
    }

    const handleDeleteForecast = (forecast: IForecast) => {
        dispatch(deleteForecast(forecast));
    }

    return (
        <div className="row paddingtop-10">
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <label htmlFor="date">Date *</label>
                            <input type="datetime-local" id="date" className="form-control" value={date} onChange={handleForecastDate} readOnly={readOnly} />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <label htmlFor="summary">Summary *</label>
                            <input type="text" id="summary" className="form-input" value={summary} onChange={handleForecastSummary} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <label htmlFor="temperatureC">temperatureC *</label>
                            <input type="number" id="temperatureC" className="form-input" value={tempC} onChange={handleForecastTempC} />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <label htmlFor="temperatureF">temperatureF *</label>
                            <input type="number" id="temperatureF" className="form-input" value={tempF} onChange={handleForecastTempF} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-dark btn-sm" onClick={handleSaveForecast}>
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="row" id="toolbar">
                    <div className="col-lg-2 col-md-2 col-sm-2">
                        <a className="form-control btn btn-dark" id="addWeather" onClick={handleShow}>
                            <i className="bi bi-play-fill" />
                            Add
                        </a>
                    </div>
                </div>
                <table className="table table-striped" aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp. (C)</th>
                            <th>Temp. (F)</th>
                            <th>Summary</th>
                            <th>Actions</th>
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
                                    <td>
                                        <button className="btn btn-labeled btn-secondary" onClick={() => handleUpdateForecast(forecast)}>Edit</button>
                                        <button className="btn btn-labeled btn-danger" onClick={() => handleDeleteForecast(forecast)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );

}