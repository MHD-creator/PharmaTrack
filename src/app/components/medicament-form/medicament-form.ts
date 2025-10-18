import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentsService } from '../../services/medicament/medicament';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Medicament } from '../../core/models/medicament';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-medicament-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule
],
  templateUrl: './medicament-form.html',
  styleUrl: './medicament-form.scss'
})
export class MedicamentForm implements OnInit{
    medicamentForm!: FormGroup;
    isEditing: boolean = false;
    medicamentId: number | null = null;
    pageTitle: string = 'Ajouter un Nouveau Médicament';
    
    constructor(
    private fb: FormBuilder,
    private medicamentService: MedicamentsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
    ngOnInit(): void {
        this.medicamentForm = this.fb.group({
        id: [null],
        name: ['', Validators.required],
        category: ['', Validators.required],
        price: [null, [Validators.required, Validators.min(0)]],
        quantity: [null, [Validators.required, Validators.min(0)]],
        expiryDate: ['', Validators.required]
      });
    }
    loadMedicament(id: number): void {
    
    this.medicamentService.getMedicaments().subscribe(medicaments => {
        const medicamentToEdit = medicaments.find(m => m.id === id);
        
        if (medicamentToEdit) {
            const formattedDate = medicamentToEdit.expiryDate.substring(0, 10);
            this.medicamentForm.patchValue({
                ...medicamentToEdit,
                dateExpiration: formattedDate 
            });
        }
      });
    }

    onSubmit(): void {
    if (this.medicamentForm.valid) {
      const medicament: Medicament = this.medicamentForm.value;
      if (this.isEditing) {
        this.medicamentService.updateMedicament(medicament).subscribe({
            next: () => {
                alert('Médicament mis à jour avec succès !');
                this.router.navigate(['/']);
            },
            error: (err) => console.error("Erreur de modification", err)
        });
      } else {
        delete medicament.id; 
        this.medicamentService.addMedicament(medicament).subscribe({
            next: () => {
                alert('Médicament créé avec succès !');
                this.router.navigate(['/']);
            },
            error: (err) => console.error("Erreur de création", err)
        });
      }
      } else {
        alert('Veuillez remplir tous les champs obligatoires correctement.');
      }
    }
  }
