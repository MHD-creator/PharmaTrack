import { Routes } from '@angular/router';
import { MedicamentList } from './components/medicament-list/medicament-list';
import { MedicamentForm } from './components/medicament-form/medicament-form';
import { ListeVente } from './components/vente/liste-vente/liste-vente';
import { VenteForm } from './components/vente/vente-form/vente-form';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
	{path: '', component: DashboardComponent},
	{path: 'medicaments', component: MedicamentList},
	{ path: 'new', component: MedicamentForm },        // Pour CREATE
  	{ path: 'edit/:id', component: MedicamentForm },

	{path: 'ventes', component: ListeVente},
	{path: 'new/vente', component: VenteForm}

];
