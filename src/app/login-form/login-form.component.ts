import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../auth/auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  user: User;
  loginForm: FormGroup;
  errorMsg: string = '';
  colorControl = new FormControl('primary');
  hide = true;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    public translateService: TranslateService
  ) {
    translateService.addLangs(['ru', 'en']);
    translateService.setDefaultLang('ru');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        ],
      ],
    });
  }

  onSubmit() {
    this.auth
      .login(this.loginForm.value)
      .subscribe((x) => console.log('response', x));

    this.loginForm.reset();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
