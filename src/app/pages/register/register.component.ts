import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
  });
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const confirmPasswordControl = this.form.get('confirmPassword');
    confirmPasswordControl?.setValidators([Validators.required, Validators.minLength(4), this.matchPassword.bind(this)]);
    confirmPasswordControl?.updateValueAndValidity();
  }

  createAccount(){
    console.log('Create: ', this.form.value);
    const {firstName, lastName, email, password } = this.form.getRawValue();
    this.authService.register(firstName, lastName, email, password).subscribe();
  }

  matchPassword(control: AbstractControl) {
    const passwordControl = this.form.get('password');
    if (passwordControl?.value) {
      const password = passwordControl.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
    }
    return null;
  }

}
