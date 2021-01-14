export class UserRequest {

userName:string;
projectID: string;
projectTitle:string;
senderID:string;
receiverID:string;
 

    constructor(public status:boolean,
                public pending:boolean
                ) {

    }


    
}