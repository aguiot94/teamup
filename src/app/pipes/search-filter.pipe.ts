import { Pipe, PipeTransform } from '@angular/core';
import { Projet } from '../models/projet.model';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(projets: Projet[], searchText:string): Projet[] {
    if(!projets){
      return [];
    }
    if(!searchText){
      return projets;
    }

    searchText = searchText.toLocaleLowerCase();
    return projets.filter(projet => {
      if(projet.competencesRecherchees){
        for(const competence of projet.competencesRecherchees){
          if(competence.toLocaleLowerCase().includes(searchText)){
            return true;
          }
        }
      }
    });

  }

  searchSkills(projet:Projet, searchText:string){
    if(projet.competencesRecherchees){
      for(const competence of projet.competencesRecherchees){
        if(competence.toLocaleLowerCase().includes(searchText)){
          return true;
        }
      }
    }
  }

}
