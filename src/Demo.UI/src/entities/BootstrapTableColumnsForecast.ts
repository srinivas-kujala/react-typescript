import BootstrapTableOptionsBase from "./BootstrapTableOptionsBase";

export class BootstrapColumnsForecast extends BootstrapTableOptionsBase {

    // #region Constructor

    constructor() {
        super();

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
                field: 'rowState',
                sortable: true,
                formatter: this.activeFormatter
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Id',
                field: 'rowIndex',
                visible: false
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Date',
                field: 'date',
                sortable: true,
                formatter: this.datatimeFormatter
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Temp (C.)',
                field: 'temperatureC',
                sortable: true
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Temp (F.)',
                field: 'temperatureF',
                sortable: true
            },
            {
                align: 'center',
                valign: 'middle',
                title: 'Summary',
                field: 'summary',
                sortable: true
            }
        ]
    }

    // #endregion

}