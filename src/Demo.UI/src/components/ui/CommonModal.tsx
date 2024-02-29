import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';

interface CommonModalProps {
    isOpen: boolean;
    content: React.ReactNode;
    closeModal: () => void;
    formSubmit: () => void;
}

const CommonModal: React.FC<CommonModalProps> = (
    {
        isOpen,
        content,
        closeModal,
        formSubmit
    }) => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            formSubmit();
        }
        setValidated(true);
    };

    return (
        <Modal
            show={isOpen}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
        >
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {content}
            </Form>
        </Modal>
    );

};

export default CommonModal;