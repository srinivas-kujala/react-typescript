import { IWeather } from "../entities/Weather";
import { BaseDataService } from "./baseDataService";

class WeatherDataService extends BaseDataService<IWeather> {

    //#region Constructor

    constructor() {
        super("weather")
    }

    //#endregion

    //#region Public Methods

    async getForcastes(): Promise<IWeather[]> {
        const response = await fetch('/api/weather/getweatherforecast');
        const data = await response.json();
        return data;
    }

    //#endregion

}

export default new WeatherDataService();