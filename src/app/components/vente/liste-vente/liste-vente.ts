import { Component, OnInit } from '@angular/core';
import { Vente } from '../../../core/models/vente';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VenteService } from '../../../services/vente/vente-service';

@Component({
  selector: 'app-liste-vente',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './liste-vente.html',
  styleUrl: './liste-vente.scss'
})
export class ListeVente implements OnInit{

  constructor(private venteService: VenteService, private router: Router){}
  listeVente: Vente[] = [];
  
  ngOnInit(): void {
    this.loadVentes();
  }
  //Methode pour initialiser les ventes
  loadVentes() : void{
     this.venteService.getVentes().subscribe(data =>{
        this.listeVente = data
    })
  }
  //Methode pour suprimer les ventes
  deleteVente(id: number | undefined){
    if(id !== undefined && confirm("Confirmez vous la supression de cette vente?")){
      //on appllela methode de supression
      this.venteService.deleteVente(id).subscribe({
        next : () =>{
          this.listeVente.filter(v => v.id == id)
        },
        error: (e) => {
          console.log(`Erreur lors de la supresison de cette vente ${e}`);
          alert("Impossible de suprimer cette vente");
        }
      })
    }
    
  }
  // Placeholder pour le bouton "Ajouter Vente" (ne fait rien pour l'instant)
addVente(){
  return this.router.navigate(['/new/vente'])
}


// Getter calculant le total de toutes les ventes affichées
get totalVentes(): number{
return this.listeVente.reduce((sum, v) => sum + (v?.total ?? 0), 0);
}
}
