export interface IBaseEntity {

    // #region Properties

    id: number;

    createdBy: string;

    createdAt: Date;

    modifiedBy?: string;

    modifiedAt?: Date;

    // #endregion
}

export class BaseEntity implements IBaseEntity {

    // #region Public Properties

    public id: number;

    public createdBy: string;

    public createdAt: Date;

    public modifiedBy?: string;

    public modifiedAt?: Date;

    // #endregion

    // #region Constructor

    constructor() {
        this.id = 0;
        this.createdBy = "";
        this.createdAt = new Date();
    }

    // #endregion

}