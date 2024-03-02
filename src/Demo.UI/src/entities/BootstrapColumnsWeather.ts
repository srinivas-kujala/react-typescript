import BootstrapTableOptionsBase from "./BootstrapTableOptionsBase";

export class BootstrapColumnsWeather extends BootstrapTableOptionsBase {

    // #region Constructor

    constructor() {
        super();

        this.columns = this.columns?.concat([
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
        ])
    }

    // #endregion

}