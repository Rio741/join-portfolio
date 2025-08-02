import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, MatButtonModule,
    MatInputModule, MatCardModule, ReactiveFormsModule, MatIconModule, RouterModule,],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})

export class LogInComponent implements OnInit {

  showContainer = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.classList.add('animate-logo');
      }
    }, 100);
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get emailFormControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordFormControl() {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value as string;
      const password = this.loginForm.get('password')?.value as string;

      this.authService.login(email, password).subscribe(
        response => {
          if (response && response.token) {
            const userData = {
              token: response.token,
              username: response.username,
              email: response.email,
            };
            sessionStorage.setItem('user_data', JSON.stringify(userData));
            this.authService.setLoggedIn(true);
            this.authService.setToken(response.token);
            if (window.innerWidth < 1080) {
              this.router.navigate(['/kanban/summary'], { queryParams: { showContainer: true } });
            } else {
              this.router.navigate(['/kanban/summary']);
            }
          } else {
            alert('Falsche Login-Daten!');
          }
        },
        error => {
          alert('Login fehlgeschlagen. Überprüfen Sie Ihre Daten.');
        }
      );
    }
  }

  onGuestLogin() {
    this.authService.guestLogin().subscribe({
      next: (response: any) => {
        if (response && response.access) {
          this.authService.saveGuestUserData(response.access);

          if (window.innerWidth < 1080) {
            this.router.navigate(['/kanban/summary'], { queryParams: { showContainer: true } });
          } else {
            this.router.navigate(['/kanban/summary']);
          }
        } else {
          alert('Gastzugang fehlgeschlagen.');
        }
      },
      error: (error) => {
        console.error('Gast-Login fehlgeschlagen', error);
        alert('Gastzugang fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    });
  }
}  
