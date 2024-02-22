function ConfirmationModal() {

    const contents =
        <div
            className="modal fade text-center"
            id="confirmation-modal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* Modal Header (1/3) */}
                    <div className="modal-header">
                        <h3 id="modal-header-label">Confirmation</h3>
                    </div>
                    {/* Modal Body (2/3)*/}
                    <div className="modal-body" id="confirmation-modal-body"></div>
                    {/* Modal Footer (3/3) */}
                    <div className="modal-footer">
                        <div className="container">
                            <div className="row">
                                <div className="form-group col-lg-6">
                                    <button
                                        type="button"
                                        className="btn btn-labeled btn-danger"
                                        id="confirmation-modal-no"
                                    >
                                        <span className="btn-label">
                                            <i className="glyphicon glyphicon-remove" />
                                        </span>
                                        No
                                    </button>
                                </div>
                                <div className="form-group col-lg-6">
                                    <button
                                        type="button"
                                        className="btn btn-labeled btn-success"
                                        id="confirmation-modal-yes"
                                    >
                                        <span className="btn-label">
                                            <i className="glyphicon glyphicon-ok-sign" />
                                        </span>
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;

    return (
        <>
            {contents}
        </>
    );
}

export default ConfirmationModal;