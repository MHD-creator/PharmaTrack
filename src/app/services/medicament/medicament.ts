import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medicament } from '../../core/models/medicament';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentsService {
  //url serveur json
  private apiUrl = 'http://localhost:3000/medicaments';
  //alerte de stock
  private seuilAlerte = 10;

  constructor(private http: HttpClient){}

  //Methode pour recuperer tout les medicaments
  getMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(this.apiUrl); 
  }
  
  addMedicament(medicament: Omit<Medicament, 'id'>):  Observable<Medicament>{
    return this.http.post<Medicament>(this.apiUrl, medicament);  
  }

  updateMedicament(medicament: Medicament): Observable<Medicament> {
    const url = `${this.apiUrl}/${medicament.id}`;
    return this.http.put<Medicament>(url, medicament); 
  }
  deleteMedicament(id: number | string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url); 
  }
  getLowStockAlerts(): Observable<Medicament[]> {
    return this.getMedicaments().pipe(
      map(medicaments => {
        return medicaments.filter(m => m.quantity < this.seuilAlerte);
      })
    );
  }
}
