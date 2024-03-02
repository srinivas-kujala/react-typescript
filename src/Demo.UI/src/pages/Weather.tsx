import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CommonModal from '../components/ui/CommonModal';
import CommonTable from '../components/ui/CommonTable';
import { Weather as Entity, IWeather } from '../entities/Weather';
import { AppDispatch, RootState, useAppDispatch } from '../store/store';
import { addOrUpdateWeather, bulkDeleteWeathers, bulkUpdateWeathers, getWeatherApi, getWeathers } from '../store/features/WeatherSlice';
import { BootstrapColumnsWeather } from '../entities/BootstrapColumnsWeather';

export default function Weather() {

    const dispatch: AppDispatch = useAppDispatch();
    const weathers = useSelector((state: RootState) => state.weather.weathers);
    const loading = useSelector((state: RootState) => state.weather.loading);
    const error = useSelector((state: RootState) => state.weather.error);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [entityData, setEntityData] = useState<IWeather>(new Entity());

    useEffect(() => { dispatch(getWeatherApi()) }, [dispatch]);

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
            setEntityData(new Entity());
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
        dispatch(addOrUpdateWeather(entityData));
        closeModal();
    };

    const handleUpdate = (id: number) => {
        let entity = weathers.find(x => x.id == id);
        if (entity) {
            setEntityData(entity);
        }
        else {
            // TODO display error message;
        }
        openModal();
    }

    const handleBulkUpdate = (entities: IWeather[]) => {
        dispatch(bulkUpdateWeathers(entities));
    }

    const handleBulkDelete = (entities: IWeather[]) => {
        dispatch(bulkDeleteWeathers(entities));
    }

    const content =
        <>
            <Modal.Header closeButton>
                <Modal.Title>Add Weather</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-12 paddingtop-10">
                    <Form.Group as={Col} md="12">
                        <Form.Label>Summary *</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="12" >
                        <Form.Control
                            required
                            id="summary"
                            type="textarea"
                            onChange={handleInputChange}
                            value={entityData?.summary}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter summary.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-12 paddingtop-10">
                    <Form.Group as={Col} md="3" >
                        <Form.Label>Temp (C.) *</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="3" >
                        <Form.Control
                            required
                            id="temperatureC"
                            type="number"
                            placeholder="Enter temperature in celsius"
                            onChange={handleInputChange}
                            value={entityData?.temperatureC}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter numeric value.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" >
                        <Form.Label>Temp (F.) *</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="3" >
                        <Form.Control
                            required
                            id="temperatureF"
                            type="number"
                            placeholder="Enter temperature in fahrenheit"
                            onChange={handleInputChange}
                            value={entityData?.temperatureF}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter numeric value.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" onSubmit={handleSave}>Save</Button>
            </Modal.Footer>
        </>;

    return (
        <div className="row paddingtop-10">
            <CommonModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                content={content}
                formSubmit={handleSave}
            />
            <CommonTable
                options={new BootstrapColumnsWeather()}
                identifier="id"
                stateIdentifier="active"
                data={weathers}
                onCreate={openModal}
                onEdit={handleUpdate}
                onStatChange={handleBulkUpdate}
                onDelete={handleBulkDelete}
            />
        </div>
    );

}