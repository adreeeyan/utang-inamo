export class User {
    public id: string;
    public firstName: string = "";
    public middleName: string = "";
    public lastName: string = "";
    public image: string = "assets/imgs/user-placeholder.jpg";
    public status: UserStatus = UserStatus.ACTIVE;
    
    // contact info
    public address: string = "";
    public cellNumber: string = "";
    public messengerId: string = "";
    public skypeId: string = "";
    public email: string = "";

    // money thingy
    public bankAccount: string = "";
    public paypal: string = "";

    constructor(init?: Partial<User>) {
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

enum UserProfileCompleteness {
    COMPLETE = "complete",
    LACKNAME = "lackname",
    LACKIMAGE = "lackimage",
    LACKADDRESS = "lackaddress",
    LACKCONTACT = "lackcontact",
    LACKPAYMENT = "lackpayment"
}

export enum UserStatus {
    ACTIVE = "active",
    DELETED = "deleted"
}