import { BootstrapTableOptions } from 'bootstrap-table';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface ICommonTableProps<T> {
    createHRef: string
    data: T[],
    onDelete: (entities: T[]) => void
}

const CommonTable: React.FC<ICommonTableProps<any>> = (props) => {

    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [extendableCollection, setExtendableCollection] = useState<any[]>();

    const $commonTable = $('#commonTable');

    let options: BootstrapTableOptions = {
        multipleSelectRow: true,
        clickToSelect: true,
        detailFormatter: detailFormatter,
        columns: [
            {
                checkbox: true,
                align: 'center',
                valign: 'middle',
                class: '',
                sortable: false,
                clickToSelect: false,
            },
            {
                title: 'Active',
                align: 'center',
                valign: 'middle',
                class: '',
                clickToSelect: false,
                formatter: activeFormatter
            },
            {
                title: 'Date',
                field: 'date',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: datatimeFormatter
            },
            {
                title: 'Temp. (C)',
                field: 'temperatureC',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title: 'Temp. (F)',
                field: 'temperatureF',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title: 'Summary',
                field: 'summary',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title: 'Actions',
                align: 'center',
                valign: 'middle',
                class: '',
                sortable: false,
                clickToSelect: false,
                formatter: rowEditFormatter
            }
        ]
    };

    useEffect(() => {
        setExtendableCollection(getExtendableCollection(props.data));
        initializeTable();

        const handleTableEvent = () => {
            const selections = $commonTable.bootstrapTable('getSelections').map((row: any) => row['rowId']);

            setIsDisabled(!selections.length);
            setIsDisabled(!selections.length);

            setSelectedRowIds(selectedRowIds);
            // Your logic to save the data or perform other actions
        };
        $commonTable.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', handleTableEvent);

        //$commonTable.on('all.bs.table', function (_e, name, args) {
        //    console.log(name, args)
        //});
        return () => {
            // Cleanup: Remove event listener when the component is unmounted
            $commonTable.off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', handleTableEvent);

            //$commonTable.off('all.bs.table', function (_e, name, args) {
            //    console.log(name, args)
            //});
        };

    }, [props.data])

    function getExtendableCollection(data: any[]) {
        if (data.length > 0) {
            return data.map((item, index) => ({
                ...item,
                selected: false,
                rowId: index,
                rowState: false
            }));
        }
    }

    function initializeTable() {

        $commonTable.bootstrapTable('destroy');

        $commonTable.bootstrapTable(options);

        setModelData();
    }

    function setModelData() {

        $commonTable.bootstrapTable('showLoading');
        $commonTable.bootstrapTable('load', extendableCollection);
        $commonTable.bootstrapTable('hideLoading');
    }

    function activeFormatter(value: any, row: any, _index: number) {
        let styleClass = 'text-danger-glow blink';

        if (value && row.active) {
            styleClass = 'text-success-glow';
        }
        return `<div><i class="bi bi-circle-fill ${styleClass}"></i></div>`
    };

    function datatimeFormatter(value: any, _row: JQuery<HTMLElement>, _index: number) {
        let date = new Date(value);

        if (date.getFullYear() === -1899) {
            return "--"
        }

        return date.toLocaleString();
    }

    function detailFormatter(_index: number, row: any, _element: JQuery<HTMLElement>) {
        let html: any[] = [];
        $.each(row, function (key: any, value: any) {
            html.push(`<p><b>${key}:</b> ${value}</p>`)
        })
        return html.join('')
    }

    function getRowEditHtml(url: string, id: string | number) {
        return [
            `<a class="like" href="${url}/${id}" title="Edit" target="_blank">`,
            '<i class="bi bi-pen"></i>',
            '</a>  '
        ].join('')
    }

    function rowEditFormatter(_index: number, _value: any, row: any) {
        return getRowEditHtml('', row.rowId);
    }

    function handleDelete() {
        setIsDisabled(true);

        let selectedItemData: any[] = [];
        selectedRowIds.forEach(rowId => {
            let indexOfItem = extendableCollection?.findIndex(x => x.rowId == rowId);

            if (indexOfItem !== undefined && indexOfItem > 0) {
                selectedItemData.push(props.data[indexOfItem]);
            }
        });

        props.onDelete(selectedItemData);

        setIsDisabled(false);
    }

    return (
        <div className="row paddingtop-10">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div id="toolbar">
                    <a className="btn btn-dark" href={props.createHRef}>
                        <i className="bi bi-plus-circle-fill"></i>
                        Create
                    </a>
                    <button id="delete" className="btn btn-danger" disabled={isDisabled} onClick={handleDelete}>
                        <i className="bi bi-trash"></i>
                        Delete
                    </button>
                    <button id="changeState" className="btn btn-light" disabled={isDisabled}>
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