import { BaseEntity, IBaseEntity } from "./BaseEntity";

export interface IWeather extends IBaseEntity {

    // #region Properties

    date: Date;

    temperatureC: number;

    temperatureF: number;

    summary: string;

    // #endregion
}

export class Weather extends BaseEntity implements IWeather {

    // #region Public Properties

    public date: Date;

    public temperatureC: number;

    public temperatureF: number;

    public summary: string;

    // #endregion

    // #region Constructor

    constructor() {
        super();
        this.date = new Date();
        this.temperatureC = 0;
        this.temperatureF = 0;
        this.summary = "";
    }

    // #endregion

}