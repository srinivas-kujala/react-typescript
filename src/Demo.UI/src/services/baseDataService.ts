import { IOperationResult } from "../interfaces/IOperationResult"

export interface IBaseDataService<T> {

    //#region Methods

    getAll(): Promise<IOperationResult<T[]>>

    getById(id: number): Promise<IOperationResult<T>>

    insert(data: T): Promise<IOperationResult<string>>

    bulkInsert(data: T[]): Promise<IOperationResult<string>>

    update(data: T): Promise<IOperationResult<string>>

    bulkUpdate(data: T[]): Promise<IOperationResult<string>>

    delete(guid: string): Promise<IOperationResult<string>>

    bulkDelete(data: T[]): Promise<IOperationResult<string>>

    //#endregion
}

export abstract class BaseDataService<T> implements IBaseDataService<T>{

    //#region

    readonly _ApiEndpoint: string = "";

    //#endregion

    //#region Constructor

    constructor(apiEndpoint: string) {
        this._ApiEndpoint = `api/${apiEndpoint}`;
    }

    //#endregion

    //#region Public Methods

    public async getAll(): Promise<IOperationResult<T[]>> {
        const response = await fetch(`/${this._ApiEndpoint}`);
        const entities: IOperationResult<T[]> = await response.json();

        return entities;
    }

    public async getById(id: number): Promise<IOperationResult<T>> {
        const response = await fetch(`/${this._ApiEndpoint}/${id}`);
        const entity: IOperationResult<T> = await response.json();

        return entity;
    }

    public async insert(data: T) {
        const response = fetch(`/${this._ApiEndpoint}/insert`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = (await response).json();

        return result;
    }

    public async bulkInsert(data: T[]) {
        const response = fetch(`/${this._ApiEndpoint}/bulkinsert`, {
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

    public async bulkUpdate(data: T[]) {
        const response = fetch(`/${this._ApiEndpoint}/bulkupdate`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const result = (await response).json();

        return result;
    }

    public async delete(guid: string) {
        const response = fetch(`/${this._ApiEndpoint}/delete/${guid}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const result = (await response).json();

        return result;
    }

    public async bulkDelete(data: T[]) {
        const response = fetch(`/${this._ApiEndpoint}/bulkdelete`, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const result = (await response).json();

        return result;
    }

    //#endregion

}