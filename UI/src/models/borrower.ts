export class Borrower {
    public id: string;
    public firstName: string = "";
    public middleName: string = "";
    public lastName: string = "";
    public image: string = "assets/imgs/user-placeholder.jpg";
    public address: string = "";
    public cellNumber: string = "";
    public messengerId: string = "";
    public skypeId: string = "";
    public status: BorrowerStatus = BorrowerStatus.ACTIVE;

    constructor(init?: Partial<Borrower>) {
        Object.assign(this, init);
    }

    get name() {
        return `${this.firstName} ${this.lastName}`;
    }

    get singleName() {
        if (this.firstName) {
            return this.firstName;
        }
        if (this.lastName) {
            return this.lastName;
        }
        if (this.id) {
            return this.id;
        }
        return "Unknown";
    }
}

export enum BorrowerStatus {
    ACTIVE,
    DELETED
}