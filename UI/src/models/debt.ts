import { Borrower } from "./borrower";

export class Debt {
    public id: string;
    public type: DebtType = DebtType.PAYABLE;
    // If type is Payable, then borrower means the person you borrowed to
    // else, then the person who borrowed money from you
    public borrower: Borrower;
    public amount: number;
    public interest: number;
    public status: DebtStatus = DebtStatus.UNPAID;
    public dueDate: Date | string;
    public borrowedDate: Date = new Date();
    public paidDate: Date;
    public description: string;

    constructor(init?: Partial<Debt>) {
        Object.assign(this, init);

        if (init && init.borrower) {
            this.borrower = new Borrower(init.borrower);
        }
    }

    get total() {
        const interest = this.interest || 0;
        return this.amount + (this.amount * (interest / 100));
    }

    get dueDateString() {
        return this.getDateString(this.dueDate);
    }

    get borrowedDateString() {
        return this.getDateString(this.borrowedDate);
    }

    get paidDateString() {
        return this.getDateString(this.paidDate);
    }

    private getDateString(dateToUse) {
        let options = { year: "numeric", month: "long", day: "numeric" };
        let useDate = dateToUse;
        if (!useDate) {
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