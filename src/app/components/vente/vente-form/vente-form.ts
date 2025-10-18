import { Component, OnInit } from '@angular/core';
import { VenteService } from '../../../services/vente/vente-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Vente } from '../../../core/models/vente';
import { MedicamentsService } from '../../../services/medicament/medicament';
import { Medicament } from '../../../core/models/medicament';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { switchMap, catchError, of, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-vente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vente-form.html',
  styleUrls: ['./vente-form.scss']
})
export class VenteForm implements OnInit{
  // exposés au template
  venteForm!: FormGroup;
  loading = false;
  medicaments: Medicament[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private venteService: VenteService,
    private medicamentService: MedicamentsService
  ){}

  ngOnInit(): void {
    this.venteForm = this.fb.group({
      id: [null],
      medicamentId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      date: [this.todayISODate(), Validators.required],
      total: [0, Validators.required]
    });

    this.loadMedicaments();
    this.setupAutoTotal();
  }

  private todayISODate(): string {
    const d = new Date();
    return d.toISOString().substring(0, 10);
  }

  loadMedicaments(): void {
    this.loading = true;
    this.medicamentService.getMedicaments().subscribe({
      next: (data) => { this.medicaments = data || []; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  private setupAutoTotal(){
    const medControl = this.venteForm.get('medicamentId');
    const qtyControl = this.venteForm.get('quantity');

    medControl?.valueChanges.subscribe((medId) => {
      const m = this.medicaments.find(x => x.id === Number(medId));
      this.updateTotalFrom(m, qtyControl?.value);
    });

    qtyControl?.valueChanges.subscribe((q) => {
      const m = this.medicaments.find(x => x.id === Number(medControl?.value));
      this.updateTotalFrom(m, q);
    });
  }

  private updateTotalFrom(m: Medicament | undefined, q: any){
    const qty = Number(q) || 0;
    const price = m ? Number(m.price) : 0;
    const total = price * qty;
    this.venteForm.get('total')?.setValue(Number(total.toFixed(2)), { emitEvent: false });
  }

  onSubmit() : void{
    if (!this.venteForm.valid) {
      this.venteForm.markAllAsTouched();
      return;
    }

    const raw = this.venteForm.value;
    const medicamentId = raw.medicamentId;
    const quantity = Number(raw.quantity);
    console.log(`Medicament Id est ${medicamentId}`);
    const medicament = this.medicaments.find(m => m.id === medicamentId);
    if (!medicament) {
      alert('Médicament introuvable ou non chargé.');
      return;
    }

    // Vérifier le stock disponible
    if (medicament.quantity < quantity) {
      alert(`Stock insuffisant. Stock disponible: ${medicament.quantity}, demandé: ${quantity}`);
      return;
    }

    const venteToCreate: Vente = {
      id: raw.id ?? 0,
      medicamentId: medicamentId,
      quantity: quantity,
      date: String(raw.date),
      total: Number(raw.total)
    };

    this.loading = true;

    this.venteService.addVente(venteToCreate).pipe(
      switchMap((createdVente: any) => {
        const createdId = (createdVente && createdVente.id) ? createdVente.id : null;
        const updatedMed: Medicament = {
          ...medicament,
          quantity: Math.max(0, medicament.quantity - quantity) // sécurité non-négatif
        };

        return this.medicamentService.updateMedicament(updatedMed).pipe(
          switchMap(() => of(createdVente)),
          catchError((medErr) => {
            // si la mise à jour du médicament échoue,  supprimer la vente cree
            console.error('Erreur mise à jour médicament:', medErr);

            if (createdId !== null) {
              // tenter suppression de la vente créée pour garder cohérence
              return this.venteService.deleteVente(createdId).pipe(
                switchMap(() => {
                  return throwError(() => new Error('La mise à jour du stock a échoué — la vente a été annulée.'));
                }),
                catchError((rollbackErr) => {
                  console.error('Rollback (suppression vente) a échoué:', rollbackErr);
                  return throwError(() => new Error('La mise à jour du stock a échoué et l\'annulation automatique de la vente a échoué. Veuillez contacter l\'administrateur.'));
                })
              );
            } else {
              return throwError(() => new Error('La mise à jour du stock a échoué ; la vente a peut-être été créée — vérifier.'));
            }
          })
        );
      }),
      catchError((err) => {
        console.error('Erreur création vente:', err);
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        alert('Vente enregistrée et stock mis à jour.');
        this.router.navigate(['/ventes']);
      },
      error: (e) => {
        this.loading = false;
        alert(`Erreur : ${e?.message || 'Opération échouée'}`);
      }
    });
  }

  cancel(){
    this.router.navigate(['/ventes']);
  }
}
