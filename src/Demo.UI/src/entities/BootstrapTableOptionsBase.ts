import { BootstrapTableColumn, BootstrapTableOptions } from "bootstrap-table";
import $ from 'jquery'

export interface IBootstrapTableOptionsBase extends BootstrapTableOptions { }

export default class BootstrapTableOptionsBase implements IBootstrapTableOptionsBase {

    // #region Public Properties

    clickToSelect?: boolean;

    multipleSelectRow?: boolean;

    columns?: BootstrapTableColumn[];

    search?: boolean;

    showColumns?: boolean;

    showColumnsToggleAll?: boolean;

    showFullscreen?: boolean;

    idField?: string;

    showToggle?: boolean;

    detailView?: boolean;

    minimumCountColumns?: number;

    showFooter?: boolean;

    // #endregion

    // #region Constructor

    constructor() {
        this.idField = "id";
        this.search = true;
        this.showToggle = true;
        this.showFullscreen = true;
        this.showColumns = true;
        this.showColumnsToggleAll = true;
        this.detailView = true;
        this.clickToSelect = true;
        this.minimumCountColumns = 2;
        this.showFooter = false;
        this.clickToSelect = true;
        this.multipleSelectRow = true;
        this.detailFormatter = this.tableDetailFormatter;
        this.columns = [
            {
                align: 'center',
                valign: 'middle',
                field: 'state',
                checkbox: true
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Active',
                field: 'active',
                sortable: true,
                formatter: this.activeFormatter
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Id',
                field: 'id',
                visible: false
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Created By',
                field: 'createdBy',
                visible: false,
                sortable: true
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Created At',
                field: 'createdAt',
                visible: false,
                sortable: true,
                formatter: this.datatimeFormatter
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Modified By',
                field: 'modifiedBy',
                visible: false,
                sortable: true
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Modified At',
                field: 'modifiedAt',
                visible: false,
                sortable: true,
                formatter: this.datatimeFormatter
            }
        ]
    }

    // #endregion

    // #region Public Methods

    detailFormatter?: (
        index: number,
        row: any,
        $element: JQuery<HTMLElement>
    ) => string;


    tableDetailFormatter(_index: number, row: any, _element: JQuery<HTMLElement>) {
        let html: any[] = [];
        $.each(row, function (key: any, value: any) {
            html.push(`<p><b>${key}:</b> ${JSON.stringify(value, null, '\t')}</p>`)
        })
        return html.join('')
    }

    activeFormatter(value: any, row: any, _index: number) {
        let styleClass = 'text-danger-glow blink';

        if (value && (row.active)) {
            styleClass = 'text-success-glow';
        }
        return `<div><i class="bi bi-circle-fill ${styleClass}"></i></div>`
    };

    datatimeFormatter(value: any, _row: JQuery<HTMLElement>, _index: number) {
        if (!value) {
            return "-"
        }

        let date = new Date(value);

        if (date.getFullYear() === -1899) {
            return "-"
        }

        return date.toLocaleString();
    }

    getRowEditHtml(_value: any, _row: any, _index: number) {
        return [
            '<a class="row-edit" title="Edit" > ',
            '<i class="bi bi-pen"></i>',
            '</a>  '
        ].join('')
    }

    // #endregion 

}