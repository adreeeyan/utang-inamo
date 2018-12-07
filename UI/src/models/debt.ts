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

        if (init.borrower) {
            this.borrower = new Borrower(init.borrower);
        }
    }

    get total() {
        return this.amount + (this.amount * (this.interest / 100));
    }

    get dueDateString() {
        let options = { year: "numeric", month: "long", day: "numeric" };
        let useDate = this.dueDate;
        if(!useDate){
            return "";
        }

        if (typeof useDate == "string") {
            useDate = new Date(useDate);
        }
        return useDate.toLocaleDateString("en-US", options);
    }

    get borrowedDateString() {
        let options = { year: "numeric", month: "long", day: "numeric" };
        let useDate = this.borrowedDate;
        if(!useDate){
            return "";
        }
        
        if (typeof useDate == "string") {
            useDate = new Date(useDate);
        }
        return useDate.toLocaleDateString("en-US", options);
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