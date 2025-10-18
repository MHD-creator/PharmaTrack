import { Routes } from '@angular/router';
import { MedicamentList } from './components/medicament-list/medicament-list';
import { MedicamentForm } from './components/medicament-form/medicament-form';
import { ListeVente } from './components/vente/liste-vente/liste-vente';
import { VenteForm } from './components/vente/vente-form/vente-form';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login/login.component';
import { AuthGuard } from './guard/auth/auth.guard';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{path: '', component: DashboardComponent, canActivate: [AuthGuard]},
	{path: 'medicaments', component: MedicamentList},
	{ path: 'new', component: MedicamentForm },
  	{ path: 'edit/:id', component: MedicamentForm },

	{path: 'ventes', component: ListeVente},
	{path: 'new/vente', component: VenteForm}

];
