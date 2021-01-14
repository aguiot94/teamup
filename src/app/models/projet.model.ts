import { UserRequest } from '../models/user-request.model';

export class Projet {

    description: string;
    image: string;
    userID: string;
    competencesRecherchees: string[];
    contributeursIDs: string[];
    tachesAFaire = [];
    commentaires:[];
    reference:string;
    userRequests: UserRequest[];
    contributorsID:string[] = [];
    photo:string;
    active:boolean = false;
    userName:string;
    userPhoto:string;

    constructor(public titre:string,
                public termine: boolean
                ) {}
}