import { Injectable, OnInit } from '@angular/core';
import { Vente } from '../../core/models/vente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VenteService {
  private listVente: Vente[] = [];
  private url: string = "http://localhost:3000/ventes";
  constructor(private http: HttpClient){}
  addVente(vente: Omit<Vente, 'id'>): Observable<Vente>{
    return this.http.post<Vente>(this.url, vente)
  }
  
  getVentes(): Observable<Vente[]>{
    return this.http.get<Vente[]>(this.url);
  }
  deleteVente(id: number): Observable<any>{
    return this.http.delete<any>(this.url);
  }
}
