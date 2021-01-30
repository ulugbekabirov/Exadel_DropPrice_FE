import { Component, ComponentFactoryResolver, OnInit, ViewChild, } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RefDirective } from '../../directives/ref.directive';
import { ModalComponent } from 'src/app/shared/components/modal.component/modal.component';


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
    private router: Router,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver
  ) {
  }
  showModal(): void {
    let position = {
      latitude: 0,
      longitude: 0,
    };
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      position.latitude = pos.coords.latitude;
      position.longitude = pos.coords.longitude;
      console.log('lat', pos.coords.latitude);
      console.log('lon', pos.coords.longitude);
    });
    console.log(position);
    const modalFactory = this.resolver.resolveComponentFactory(ModalComponent);
    this.refDir.containerRef.clear();
    const component = this.refDir.containerRef.createComponent(modalFactory);
    component.instance.title = 'Ваше Местоположение';
    component.instance.content = `longitude: ${position.latitude} longitude: ${position.longitude}`;
    component.instance.content = position;
    component.instance.confirm.subscribe(() => {
      this.refDir.containerRef.clear();
    });
    component.instance.abort.subscribe(() => {
      this.refDir.containerRef.clear();
    });
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
      .subscribe((x) => {
        this.loginForm.reset();
        this.showModal();
        const returnUrl = this.route.snapshot.queryParams['/returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
