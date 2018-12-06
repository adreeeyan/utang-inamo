import { Borrower } from "./borrower";

export class Debt {
    public id: string;
    public type: DebtType = DebtType.PAYABLE;
    // If type is Payable, then borrower means the person you borrowed to
    // else, then the person who borrowed money from you
    public borrower: Borrower;
    public amount: number;
    public interest: number = 0;
    public status: DebtStatus = DebtStatus.UNPAID;
    public dueDate: Date;
    public borrowedDate: Date = new Date();

    constructor(init?: Partial<Debt>) {
        Object.assign(this, init);
    }

    get total() {
        return (this.amount * this.interest) + this.amount;
    }

    get dueDateString() {
        let options = {  year: "numeric", month: "long", day: "numeric" };
        return this.dueDate.toLocaleDateString("en-US", options);
    }
}

export enum DebtType {
    PAYABLE,
    RECEIVABLE
}

export enum DebtStatus {
    PAID,
    UNPAID
}