import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from '../../../services/user/user.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hide = true;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
  }

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
    this.auth.login(this.loginForm.value)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => {
          return this.userService.activeUser$;
        })
      )
      .subscribe(resp => {
        if (!resp) {
          return;
        }
        const returnUrl = this.route.snapshot.queryParams['/returnUrl'] || '/';
        this.loginForm.reset();
        this.router.navigate([returnUrl]);
      });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
