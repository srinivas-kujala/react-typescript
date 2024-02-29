import 'bootstrap-table';
import { BootstrapTableOptions } from 'bootstrap-table';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface ICommonTableProps<T> {

    // #region Public Properties

    options: BootstrapTableOptions;

    identifier: string;

    stateIdentifier?: string;

    data: T;

    // #endregion

    // #region Methods

    onCreate?: () => void;

    onEdit?: (id: string) => void | undefined;

    onDelete?: (entities: T[]) => void

    onStatChange?: (entities: T[]) => void;

    // #endregion

}

const CommonTable: React.FC<ICommonTableProps<any>> = (props) => {

    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [extendableCollection, setExtendableCollection] = useState<any[]>([]);

    const $commonTable = $('#commonTable');

    useEffect(() => {
        setExtendableCollection(getExtendableCollection(props.data));
        initializeTable();

        const handleTableEvent = () => {
            const selections = $commonTable.bootstrapTable('getSelections').map((row: any) => row[props.identifier]);

            setIsDisabled(!selections.length);
            setIsDisabled(!selections.length);

            setSelectedRowIds(selections);
            // Your logic to save the data or perform other actions
        };

        $commonTable.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', handleTableEvent);

        window.handleCommonTableRowEdit = (id: string) => {
            if (props.onEdit)
                props.onEdit(id);
        }

        return () => {
            // Cleanup: Remove event listener when the component is unmounted
            $commonTable.off('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', handleTableEvent);

            //$commonTable.off('all.bs.table', function (_e, name, args) {
            //    console.log(name, args)
            //});
        };

    }, [props.data])

    function getExtendableCollection(data: any[]) {
        let updatedData: any[] = [];
        if (data.length > 0) {
            updatedData = data.map((item, index) => ({
                ...item,
                rowIndex: index,
                rowState: false,
                selected: false
            }));
        }

        return updatedData;
    }

    function initializeTable() {
        if (props.onEdit) {
            let actionColumn = props.options.columns?.find(x => x.field == 'operate');
            if (!actionColumn) {
                props.options.columns?.push(
                    {
                        align: 'center',
                        valign: 'middle',
                        title: 'Actions',
                        field: "operate",
                        clickToSelect: false,
                        formatter: operateFormatter,
                    });
            }
        }

        $commonTable.bootstrapTable('destroy');

        $commonTable.bootstrapTable(props.options);

        setModelData();
    }

    function setModelData() {
        if (extendableCollection.length > 0) {
            $commonTable.bootstrapTable('showLoading');
            $commonTable.bootstrapTable('load', extendableCollection);
            $commonTable.bootstrapTable('hideLoading');
        }
    }

    function getStateIdentifierFromProps() {
        return props?.stateIdentifier ? props.stateIdentifier : 'rowState';
    }

    function handleDelete() {
        setIsDisabled(true);

        let selectedItemData: any[] = [];

        const updatedExtendableCollection = extendableCollection ? [...extendableCollection] : [];
        selectedRowIds.forEach(identifier => {
            const indexOfItem = updatedExtendableCollection.findIndex(x => x[props.identifier] === identifier);
            if (indexOfItem !== -1) {

                // Setect the actual item
                selectedItemData.push(props.data[indexOfItem]);

                // Remove the extended item
                updatedExtendableCollection.splice(indexOfItem, 1);
            }
        });

        // Invode callback
        if (props.onDelete)
            props.onDelete(selectedItemData);

        // Update the state
        setExtendableCollection(updatedExtendableCollection);

        setIsDisabled(false);
    }

    function handleStateChange() {
        setIsDisabled(true);

        let selectedItemData: any[] = [];

        let updatedExtendableCollection: any[] = [];
        if (extendableCollection) {
            updatedExtendableCollection = extendableCollection.filter((item, index) => {
                let identifier = item[props.identifier];
                if (!selectedRowIds.includes(identifier)) {
                    return item;
                }
                else {
                    selectedItemData.push(props.data[index]);

                    let stateIdentifier = getStateIdentifierFromProps();

                    item[stateIdentifier] = !item[stateIdentifier]

                    return item;
                }
            })
        }

        // Invode callback
        if (props.onStatChange)
            props.onStatChange(selectedItemData);

        // Update the state
        setExtendableCollection(updatedExtendableCollection);

        setIsDisabled(false);
    }

    function operateFormatter(_value: any, row: any, _index: number) {
        return [
            `<a class="row-edit" title="Edit" onclick="handleCommonTableRowEdit('${row[props.identifier]}')" > `,
            '<i class="bi bi-pen"></i>',
            '</a>  '
        ].join('')
    }

    return (
        <div className="row paddingtop-10">
            <div className="col-lg-12 col-md-12 col-sm-12">
                <div id="toolbar">
                    <a className="btn btn-dark" onClick={props.onCreate}>
                        <i className="bi bi-plus-circle-fill"></i>
                        Create
                    </a>
                    <button id="delete" className="btn btn-danger" disabled={isDisabled} onClick={handleDelete} hidden={!props.onDelete}>
                        <i className="bi bi-trash"></i>
                        Delete
                    </button>
                    <button id="changeState" className="btn btn-light" disabled={isDisabled} onClick={handleStateChange} hidden={!props.onStatChange}>
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
