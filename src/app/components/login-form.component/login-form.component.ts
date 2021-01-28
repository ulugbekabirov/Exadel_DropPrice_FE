import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from '../../shared/components/modal.component/modal.component';
import { RefDirective } from '../../shared/directives/ref.directive';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    public translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver

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
    this.auth.login(this.loginForm.value)
      .pipe(tap(() => {
        console.log('modal');
        this.showModal();
      }))
      .subscribe(res => {
        this.loginForm.reset();
        const returnUrl = this.route.snapshot.queryParams['/returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  showModal(): void {
    const modalFactory = this.resolver.resolveComponentFactory(ModalComponent);
    this.refDir.containerRef.clear();
    const component = this.refDir.containerRef.createComponent(modalFactory);
    component.instance.title = 'Определить Местоположение';
    component.instance.content = 'разрешить использовать gps';
    component.instance.confirm.subscribe(() => {
      this.refDir.containerRef.clear();
    });
    component.instance.abort.subscribe(() => {
      this.refDir.containerRef.clear();
    });
  }
}
