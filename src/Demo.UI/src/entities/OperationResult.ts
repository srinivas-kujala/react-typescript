export interface IOperationResult<T> {

    // #region Properties

    success: boolean

    errorMessage: string

    value: T

    // #endregion

}

export class OperationResult<T> implements IOperationResult<T> {

    // #region Public Properties

    public success: boolean

    public errorMessage: string

    public value: T

    // #endregion

    // #region Constructor

    public constructor(TCreator: new () => T) {
        this.success = false;
        this.value = new TCreator();
        this.errorMessage = '';
    }

    // #endregion

}