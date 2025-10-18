import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { MedicamentsService } from '../../../services/medicament/medicament';
import { VenteService } from '../../../services/vente/vente-service';

interface Vente {
  id: number;
  medicamentId: number;
  quantity: number;
  date: string;
  total: number;
}

interface Medicament {
  id?: number;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  expiryDate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  medicaments: Medicament[] = [];
  ventes: Vente[] = [];
  ventesToday: Vente[] = [];
  ventesSemaine: { jour: string; dateISO: string; total: number }[] = [];

  loading = false;
  error: string | null = null;

  seuilFaibleStock = 10; 

  private destroy$ = new Subject<void>();

  constructor(
    private medicamentService: MedicamentsService,
    private venteService: VenteService
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshAll(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      meds: this.medicamentService.getMedicaments(),
      ventes: this.venteService.getVentes()
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ meds, ventes }) => {
          this.medicaments = meds || [];
          this.ventes = ventes || [];

          // on calcule les métriques à partir des données reçues
          this.computeVentesToday();
          this.computeVentesSemaine();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement dashboard', err);
          this.error = 'Impossible de charger les données. Vérifiez le serveur.';
          this.loading = false;
        }
      });
  }

//getters
  todayISOLocal(): string {
    // renvoie la date locale au format YYYY-MM-DD
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISO = new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
    return localISO;
  }

  get totalMedicaments(): number {
    return this.medicaments.length;
  }

  get totalStockValue(): number {
    return this.medicaments.reduce((sum, m) => sum + (m.price * (m.quantity || 0)), 0);
  }

  get lowStockMedicaments(): Medicament[] {
    return this.medicaments.filter(m => (m.quantity ?? 0) < this.seuilFaibleStock);
  }

  get countVentesToday(): number {
    return this.ventesToday.length;
  }

  get totalVentesToday(): number {
    return this.ventesToday.reduce((s, v) => s + (v.total || 0), 0);
  }

  get percentLowStock(): number {
    if (this.medicaments.length === 0) return 0;
    return Math.round((this.lowStockMedicaments.length / this.medicaments.length) * 100);
  }
  get totalVentesSemaine(): number {
    return this.ventesSemaine.reduce((s, x) => s + (x.total || 0), 0);
  }
  medicamentNameById(id: number | undefined): string {
    if (id == null) return '-';
    const m = this.medicaments.find(x => x.id === id);
    return m ? m.name : `#${id}`;
  }

  // calcul ventes aujourd'hui et hebdomendaire

  private computeVentesToday(): void {
    const today = this.todayISOLocal();
    this.ventesToday = this.ventes.filter(v => this.normalizeToISODate(v.date) === today);
  }

  private computeVentesSemaine(): void {
    // construit les 7 derniers jours
    const days: { jour: string; dateISO: string; total: number }[] = [];
    const weekdayShort = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = this.toISODateLocal(d);
      const jour = weekdayShort[d.getDay()];
      days.push({ jour, dateISO: iso, total: 0 });
    }

    // attribue les ventes aux jours
    for (const v of this.ventes) {
      const iso = this.normalizeToISODate(v.date);
      const slot = days.find(d => d.dateISO === iso);
      if (slot) slot.total += Number(v.total || 0);
    }

    this.ventesSemaine = days;
  }

  // normalise une dte
  private normalizeToISODate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return this.toISODateLocal(d);
  }

  private toISODateLocal(d: Date): string {
    // convertit en date locale
    const tzOffset = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - tzOffset);
    return local.toISOString().slice(0, 10);
  }

  //hauteur des barres
  barHeightPercent(dayTotal: number): number {
    const max = Math.max(...this.ventesSemaine.map(d => d.total), 1);
    return Math.round((dayTotal / max) * 100);
  }
}
