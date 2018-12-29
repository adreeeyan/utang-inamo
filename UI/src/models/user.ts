import { Borrower } from "./borrower";

export class User extends Borrower {
    public bankAccount: string = "";
    public paypal: string = "";

    constructor(init?: Partial<User>) {
        super(init);
        Object.assign(this, init);
    }

    get profileCompleteness() {
        if (!this.firstName && !this.lastName) {
            return UserProfileCompleteness.LACKNAME;
        }

        if (!this.image) {
            return UserProfileCompleteness.LACKIMAGE;
        }

        if (!this.address) {
            return UserProfileCompleteness.LACKADDRESS;
        }

        if (!this.cellNumber && !this.skypeId && !this.messengerId) {
            return UserProfileCompleteness.LACKCONTACT;
        }

        if (!this.bankAccount && !this.paypal) {
            return UserProfileCompleteness.LACKPAYMENT;
        }

        return UserProfileCompleteness.COMPLETE;
    }

    get isComplete() {
        return this.profileCompleteness == UserProfileCompleteness.COMPLETE;
    }
}

enum UserProfileCompleteness {
    COMPLETE,
    LACKNAME,
    LACKIMAGE,
    LACKADDRESS,
    LACKCONTACT,
    LACKPAYMENT
}