import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      // pas connecté -> vers login
      return this.router.parseUrl('/login');
    }
    if (!this.auth.isAdmin()) {
      // connecté mais pas admin -> vers /user ou page d'erreur
      return this.router.parseUrl('/user');
    }
    return true; // admin -> accès autorisé
  }
}
