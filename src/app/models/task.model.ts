export class Task {

    description: string;
    userID: string;
    contributeursID: string[];
    commentaires: string[];

    constructor(public titre: string,
                public terminee: boolean = false) {}
}