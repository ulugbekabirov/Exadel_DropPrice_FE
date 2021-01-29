import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../auth/auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'
          ),
        ],
      ],
    });
  }

  onSubmit(): void {
    this.auth.login(this.loginForm.value);
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  resetLoginForm(formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    this.loginForm.reset();
  }
}