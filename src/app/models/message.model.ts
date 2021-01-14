export class Message {

senderName:string;
receiverName:string;
time:string;


    constructor(public senderID:string,
                public receiverID:string,
                public content:string) {

    }
}