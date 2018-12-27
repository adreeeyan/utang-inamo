export class Borrower {
    public id: string;
    public firstName: string = "";
    public middleName: string = "";
    public lastName: string = "";
    public image: string = "";
    public address: string = "";
    public cellNumber: string = "";
    public messengerId: string = "";
    public skypeId: string = "";
    public status: BorrowerStatus = BorrowerStatus.ACTIVE;

    constructor(init?: Partial<Borrower>) {
        Object.assign(this, init);
    }

    get name(){
        return `${this.firstName} ${this.lastName}`;
    }
}

export enum BorrowerStatus {
    ACTIVE,
    DELETED
}