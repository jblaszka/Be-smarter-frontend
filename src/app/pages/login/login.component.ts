import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit(){
    console.log('SUBMIT: ', this.form.value);
    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('LOGIN DONE: ', res);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = 'Login Failed :(';
      }
    }
    );
  }

  goToRegistration(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/registration');
  }
}
