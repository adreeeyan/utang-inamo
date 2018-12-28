import { Borrower } from "./borrower";

export class User extends Borrower {
    public bankAccount: string = "";
    public paypal: string = "";

    constructor(init?: Partial<User>) {
        super(init);
        Object.assign(this, init);
    }
}