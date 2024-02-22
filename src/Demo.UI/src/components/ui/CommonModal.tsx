import React from "react";
import { Modal } from "react-bootstrap";

const CommonModal = ({
    isModalOpen,
    closeModal,
    modalBody
}: {
    isModalOpen: boolean;
    closeModal: () => void;
    modalBody: React.ReactNode;
}) => {

    //const handleClose = () => setShow(false);

    return (
        <>
            <Modal
                show={isModalOpen}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                {modalBody}
            </Modal>
        </>
    );
}

export default CommonModal;