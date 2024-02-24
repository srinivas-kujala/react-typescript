import React from 'react';
import { Modal } from 'react-bootstrap';


interface CommonModalProps {
    isOpen: boolean;
    closeModal: () => void;
    header: React.ReactNode;
    body: React.ReactNode;
    footer: React.ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({ isOpen, closeModal, header, body, footer }) => {

    return (
        <Modal
            show={isOpen}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
        >
            <div>
                <div>{header}</div>
                <div>{body}</div>
                <div>{footer}</div>
            </div>
        </Modal>
    );

};

export default CommonModal;