import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
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
  position = {
    latitude: 0,
    longitude: 0,
  };

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private auth: AuthService,
    private resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.position.latitude = position.coords.latitude;
      this.position.longitude = position.coords.longitude;
      console.log('lat', position.coords.latitude);
      console.log('lon', position.coords.longitude);
    });
    // this.watchPosition();
  }

  watchPosition(): void {
    const desLat = 0;
    const desLong = 0;
    const id = navigator.geolocation.watchPosition(position => {
      console.log('lat', position.coords.latitude);
      console.log('lon', position.coords.longitude);
      if (position.coords.latitude === desLat) {
        navigator.geolocation.clearWatch(id);
      }
    }, (err) => {
      console.log(err);
    }, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    });
  }

  getUserInfo(): any {
  }

  showModal(): void {
    const modalFactory = this.resolver.resolveComponentFactory(ModalComponent);
    this.refDir.containerRef.clear();
    const component = this.refDir.containerRef.createComponent(modalFactory);
    component.instance.title = 'Ваше Местоположение';
    component.instance.content = this.position;
    component.instance.confirm.subscribe(() => {
      this.refDir.containerRef.clear();
    });
    component.instance.abort.subscribe(() => {
      this.refDir.containerRef.clear();
    });
  }
}
