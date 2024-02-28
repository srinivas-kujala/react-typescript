import { BootstrapTableOptions } from 'bootstrap-table';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface ICommonTableProps<T> {
    createHRef: string
    data: T[],
    onDelete: (entities: T[]) => void
}

const CommonTable: React.FC<ICommonTableProps<any>> = (props) => {

    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [extendableCollection, setExtendableCollection] = useState<any[]>();

    const $commonTable = $('#commonTable');
    const $commonDelete = $('#delete');
    const $commonStateChange = $('#changeState');

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
    }, [props.data])

    //$commonTable.on('all.bs.table', function (_e, name, args) {
    //    console.log(name, args)
    //});

    $commonDelete.on('click', function () {
        if (!extendableCollection) {
            return;
        }

        $(this).prop('disabled', true);

        let selectedItemData: any[] = [];
        selectedRowIds.forEach(rowId => {
            let indexOfItem = extendableCollection.findIndex(x => x.rowId == rowId);

            if (indexOfItem > 0) {
                selectedItemData.push(props.data[indexOfItem]);
            }
        });

        props.onDelete(selectedItemData);
        $(this).prop('disabled', false);
    });

    $commonStateChange.on('click', function () {
        $(this).prop('disabled', true);

        let listOfSelectedItems: any[] = [];
        let newArrayOfItems: any[] | undefined = extendableCollection?.filter(function (obj: any) {
            if (selectedRowIds.indexOf(obj.rowId) > -1) {
                obj.rowState = !obj.rowState;
                listOfSelectedItems.push(obj);
            }

            return obj;
        });
        setExtendableCollection(newArrayOfItems);
        setModelData();
        $(this).prop('disabled', false);
    });

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

        $commonTable.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table',
            function (e) {
                e.preventDefault();

                $commonDelete.prop('disabled', !$commonTable.bootstrapTable('getSelections').length);
                $commonStateChange.prop('disabled', !$commonTable.bootstrapTable('getSelections').length);

                // save your data, here just save the current page
                let selections = $.map($commonTable.bootstrapTable('getSelections'), function (row) {
                    return row.rowId
                })
                setSelectedRowIds(selections);
                // push or splice the selections if you want to save all data selections
            }
        );

        setModelData();
    }

    function setModelData() {
        if (extendableCollection == undefined || extendableCollection?.length <= 0)
            return;

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

    return (
        <div className="row paddingtop-10">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div id="toolbar">
                    <a className="btn btn-dark" href={props.createHRef}>
                        <i className="bi bi-plus-circle-fill"></i>
                        Create
                    </a>
                    <button id="delete" className="btn btn-danger">
                        <i className="bi bi-trash"></i>
                        Delete
                    </button>
                    <button id="changeState" className="btn btn-light">
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