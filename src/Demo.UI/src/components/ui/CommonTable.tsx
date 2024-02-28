import * as React from 'react';
import { useEffect, useState } from 'react';

interface ICommonTableProps<T> {
    createHRef: string
    data: T[]
}

const CommonTable: React.FC<ICommonTableProps<any>> = (props) => {

    const [selectedRow, setSelectedRow] = useState<number[]>([]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/src/assets/js/common-table.js'
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        }
    }, []);

    useEffect(() => {
        if (window.setTableData) {
            window.setTableData(props.data);
        }
    }, [props.data])

    const handleDelete = () => {
        let data = window.getSelectedRows();

        setSelectedRow(data);
    }

    const handleChangeState = () => {
        let data = window.getSelectedRows();
    }

    return (
        <div className="row paddingtop-10">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div id="toolbar">
                    <a className="btn btn-dark" href={props.createHRef}>
                        <i className="bi bi-plus-circle-fill"></i>
                        Create
                    </a>
                    <button id="delete" className="btn btn-danger" onClick={handleDelete}>
                        <i className="bi bi-trash"></i>
                        Delete
                    </button>
                    <button id="changeState" className="btn btn-light" onClick={handleChangeState}>
                        Activate/Deactivate
                    </button>
                </div>
                <table
                    id="commonTable"
                    data-toolbar="#toolbar"
                    data-search="true"
                    data-show-toggle="true"
                    data-show-fullscreen="true"
                    data-show-columns="true"
                    data-show-columns-toggle-all="true"
                    data-detail-view="true"
                    data-show-export="true"
                    data-click-to-select="true"
                    data-detail-formatter="detailFormatter"
                    data-minimum-count-columns={2}
                    data-show-pagination-switch="true"
                    data-pagination="true"
                    data-id-field="id"
                    data-page-list="[10, 25, 50, 100, all]"
                    data-show-footer="false"
                ></table>
            </div>
        </div>
    );
}

export default CommonTable;