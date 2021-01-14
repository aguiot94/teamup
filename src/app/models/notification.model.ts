export class Notification {

    projectID:string;
    userPicture:string;

    constructor(public content:string,
                public receiverID:string,
                public senderID:string) {

    }
}