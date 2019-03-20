import { User } from "./user";
import * as moment from "moment";

export class Debt {
    public id: string;
    public type: DebtType = DebtType.PAYABLE;
    // If type is Payable, then borrower means the person you borrowed to
    // else, then the person who borrowed money from you
    public borrower: User;
    public amount: number = 0;
    public interest: number = 0;
    public status: DebtStatus = DebtStatus.UNPAID;
    public dueDate: Date | string;
    public borrowedDate: Date | string = moment().format();
    public paidDate: Date | string;
    public description: string;

    constructor(init?: Partial<Debt>) {
        Object.assign(this, init);

        if (this.borrower != null) {
            this.borrower = new User({ ...this.borrower });
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

    getPureObject() {
        return {
            ...(this as object),
            borrower: Object.assign({}, this.borrower)
        }
    }
}

export enum DebtType {
    PAYABLE = "payable",
    RECEIVABLE = "receivable"
}

export enum DebtStatus {
    PAID = "paid",
    UNPAID = "unpaid"
}