export interface IBaseDataService<T> {

    //#region Methods

    getAll(): Promise<T[]>

    getById(id: number): Promise<T>

    create(data: T): Promise<string>

    update(data: T): Promise<string>

    delete(id: number): Promise<string>

    //#endregion
}

export abstract class BaseDataService<T> implements IBaseDataService<T>{

    //#region

    readonly _ApiEndpoint: string = "";

    //#endregion

    //#region Constructor

    constructor(apiEndpoint: string) {
        this._ApiEndpoint = apiEndpoint;
    }

    //#endregion

    //#region Public Methods

    public async getAll(): Promise<T[]> {
        const response = await fetch('/${this._ApiEndpoint}/getweatherforecast');
        const entities: T[] = await response.json();

        return entities;
    }

    public async getById(id: number): Promise<T> {
        const response = await fetch(`/${this._ApiEndpoint}/${id}`);

        const entity: T = await response.json();
        return entity;
    }

    public async create(data: T) {
        const response = fetch('/${this._ApiEndpoint}/insert', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const result = (await response).json();

        return result;
    }

    public async update(data: T) {
        const response = fetch(`/${this._ApiEndpoint}/update`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const result = (await response).json();

        return result;
    }

    public async delete(id: number) {
        const response = fetch(`/${this._ApiEndpoint}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const result = (await response).json();

        return result;
    }

    //#endregion

}