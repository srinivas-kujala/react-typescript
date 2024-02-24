export interface IForecast {

    // #region Properties

    date: Date;

    temperatureC: number;

    temperatureF: number;

    summary: string;

    // #endregion
}

export class Forecast implements IForecast {

    // #region Public Properties

    date: Date;
    temperatureC: number;
    temperatureF: number;
    summary: string;

    // #endregion

    // #region Constructor

    constructor() {
        this.date = new Date();
        this.temperatureC = 0;
        this.temperatureF = 0;
        this.summary = "";
    }

    // #endregion

}