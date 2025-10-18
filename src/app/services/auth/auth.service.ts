import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common';           
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface AuthState {
  token: string | null;
  role: 'admin' | 'user' | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authSubject = new BehaviorSubject<AuthState>({ token: null, role: null });
  auth$ = this.authSubject.asObservable();
  private isBrowser: boolean; 

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const saved = localStorage.getItem('auth');
      if (saved) {
        this.authSubject.next(JSON.parse(saved));
      }
    }
  }

  // Méthode utilitaire pour encapsuler la lecture/écriture sécurisée
  private safeSetItem(key: string, value: string) {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private safeRemoveItem(key: string) {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  // simule un login
  login(username: string, password: string): Observable<AuthState> {
    if (username === 'admin' && password === 'admin') {
      const state: AuthState = { token: 'fake-admin-token-123', role: 'admin' };
      this.setAuth(state);
      return of(state);
    }
    if (username === 'user' && password === 'user') {
      const state: AuthState = { token: 'fake-user-token-456', role: 'user' };
      this.setAuth(state);
      return of(state);
    }
    return of({ token: null, role: null });
  }

  private setAuth(state: AuthState) {
    this.authSubject.next(state);
    this.safeSetItem('auth', JSON.stringify(state)); 
  }

  logout() {
    this.safeRemoveItem('auth');
    this.authSubject.next({ token: null, role: null });
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this.authSubject.value.token;
  }

  get role(): 'admin' | 'user' | null {
    return this.authSubject.value.role;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}