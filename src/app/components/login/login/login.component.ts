import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Import de FormGroup
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  
})
export class LoginComponent {

  error = '';
  form: FormGroup; 

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    if (!username || !password) return;
    this.auth.login(username, password).subscribe(state => {
      if (state.token) {
        if (state.role === 'admin') this.router.navigate(['/']);
        else this.router.navigate(['/']);
      } else {
        this.error = 'Identifiants invalides. Essaie admin/admin ou user/user';
      }
    });
  }
}