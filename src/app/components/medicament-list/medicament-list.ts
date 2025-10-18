import { Component, OnInit } from '@angular/core';
import { Medicament } from '../../core/models/medicament';
import { MedicamentsService } from '../../services/medicament/medicament';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medicament-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicament-list.html',
  styleUrls: ['./medicament-list.scss']
})
export class MedicamentList implements OnInit {
  medicaments: Medicament[] = [];
  medicamentsFaibleStock: Medicament[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(private medicamentService: MedicamentsService) {}

  ngOnInit(): void {
    this.loadMedicaments();
  }

  loadMedicaments(): void {
    this.loading = true;
    this.medicamentService.getMedicaments().subscribe({
      next: (data) => { this.medicaments = data || []; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
    this.medicamentService.getLowStockAlerts().subscribe({
      next: (data) => (this.medicamentsFaibleStock = data || []),
      error: (err) => console.error(err)
    });
  }

  deleteMedicament(id: string | number | undefined): void {
    if (id != undefined && confirm('Voulez-vous vraiment supprimer ce médicament ?')) {
      this.medicamentService.deleteMedicament(id).subscribe({
        next: () => {
          this.medicaments = this.medicaments.filter(m => m.id !== id);
          this.medicamentsFaibleStock = this.medicamentsFaibleStock.filter(m => m.id !== id);
          alert('Médicament supprimé avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert("Impossible de supprimer le médicament.");
        }
      });
    }
  }

  isLowStock(medicament: Medicament): boolean {
    return this.medicamentsFaibleStock.some(m => m.id === medicament.id);
  }

  get filteredMedicaments(): Medicament[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.medicaments;
    return this.medicaments.filter(m =>
      (m.name || '').toLowerCase().includes(term)
      || (m.category || '').toLowerCase().includes(term)
      || String(m.id || '').includes(term)
    );
  }

  formatPrice(price: number | undefined): string {
    if (price == null || isNaN(Number(price))) return '-';
    return Number(price).toFixed(2) + ' FCFA';
  }

  trackById(index: number, item: Medicament): number | undefined {
    return item?.id;
  }
}
