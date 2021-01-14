import { Projet } from '../models/projet.model';
import { Notification } from '../models/notification.model';

export class User {

    domaines: string[];
    competences: string[];
    projets: Projet;
    messages: string[];
    portfolio: string[];
    notifications:Notification[] = [];
    photo:string;



    constructor(public nom: string,
                public prenom: string,
                public mail: string,
                public telephone: string,
                ){}
}