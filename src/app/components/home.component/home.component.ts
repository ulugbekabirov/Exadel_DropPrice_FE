import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ActiveUser } from '../../models';
import { AuthService } from '../../auth/auth.service';
import { ModalComponent } from '../../shared/components/modal.component/modal.component';
import { RefDirective } from '../../shared/directives/ref.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeUser$ = this.auth.activeUser;
  activeUser;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private auth: AuthService,
    private resolver: ComponentFactoryResolver
  ) {
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
