import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import '../assets/css/weather.css';
import CommonModal from '../components/ui/CommonModal';
import CommonTable from '../components/ui/CommonTable';
import { Forecast, IForecast } from '../entities/Forecast';
import { addOrUpdateForecast, bulkDeleteForecast, fetchForecastes } from '../store/features/forecastSlice';
import { AppDispatch, RootState, useAppDispatch } from '../store/store';

export default function Weather() {

    const dispatch: AppDispatch = useAppDispatch();
    const forecasts = useSelector((state: RootState) => state.forecast.forecasts);
    const loading = useSelector((state: RootState) => state.forecast.loading);
    const error = useSelector((state: RootState) => state.forecast.error);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isReadOnly, setIsReadOnly] = useState(false);

    const [entityData, setEntityData] = useState<IForecast>(new Forecast());

    useEffect(() => { dispatch(fetchForecastes()) }, [dispatch]);

    if (loading) {
        return (
            <div className="text-center" >
                <h1 className="display-4">Loading...</h1>
            </div >
        );
    }

    if (error) {
        return (
            <div className="text-center" >
                <h1 className="display-4">Error: {error}</h1>
            </div >
        );
    }

    const openModal = (clear: boolean = false) => {
        if (clear) {
            setEntityData(new Forecast());
        }
        setIsModalOpen(true);
    }

    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let { id, value } = e.target;
        switch (id) {
            case "date":
                setEntityData(prevData => ({ ...prevData, [id]: new Date(value).toLocaleString() }));
                break;
            default:
                setEntityData(prevData => ({ ...prevData, [id]: value }));
                break;
        }
    };

    const handleSave = () => {
        dispatch(addOrUpdateForecast(entityData));
        closeModal();
        setIsReadOnly(false);
    }

    const handleUpdateForecast = (entity: IForecast) => {
        openModal();
        setEntityData(entity);
    }

    const handleUpdateForecasts = (_entities: IForecast[]) => {
    }

    const handleDeleteForecasts = (entity: IForecast[]) => {
        dispatch(bulkDeleteForecast(entity));
    }

    const modalHeader =
        <Modal.Header closeButton>
            <Modal.Title>Forecast</Modal.Title>
        </Modal.Header>;

    const modalBody = (
        <Modal.Body>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <label htmlFor="date">Date *</label>
                    <input type="datetime-local" id="date" className="form-control" value={entityData?.date?.toLocaleString()} onChange={handleInputChange} readOnly={isReadOnly} />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <label htmlFor="summary">Summary *</label>
                    <input type="text" id="summary" className="form-input" value={entityData?.summary} onChange={handleInputChange} />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <label htmlFor="temperatureC">temperatureC *</label>
                    <input type="number" id="temperatureC" className="form-input" value={entityData?.temperatureC} onChange={handleInputChange} />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <label htmlFor="temperatureF">temperatureF *</label>
                    <input type="number" id="temperatureF" className="form-input" value={entityData?.temperatureF} onChange={handleInputChange} />
                </div>
            </div>
        </Modal.Body>
    );

    const modalFooter = (
        <Modal.Footer>
            <button className="btn btn-dark btn-sm" onClick={handleSave}>
                Save
            </button>
        </Modal.Footer>
    );

    return (
        <div className="row paddingtop-10">
            <CommonModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                header={modalHeader}
                body={modalBody}
                footer={modalFooter}
            />
            <CommonTable
                identifier="date"
                createHRef="test"
                data={forecasts}
                onDelete={handleDeleteForecasts}
            />
        </div>
    );

}