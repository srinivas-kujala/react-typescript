import { IForecast } from "../interfaces/IForecats";
import { BaseDataService } from "./baseDataService";

class WeatherDataService<T> extends BaseDataService<T> {

    //#region Constructor

    constructor() {
        super("weather")
    }

    //#endregion

    //#region Public Methods

    async getForcastes(): Promise<IForecast[]> {
        const response = await fetch('weather/getweatherforecast');
        const data = await response.json();
        return data;
    }

    //#endregion

}

export default new WeatherDataService();