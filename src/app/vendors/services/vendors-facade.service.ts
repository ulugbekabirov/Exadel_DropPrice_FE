import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SORTS } from '../../../constants';
import { ActiveUser, Tag, Town } from '../../models';
import { Sort } from '../../models/sort';
import { ApiDataService } from '../../services/api-data.service';
import { DiscountsService } from '../../services/discounts.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { VendorsService } from '../../services/vendors.service';
import { VendorsRequestStore } from './vendors-request-store';
import { VendorsStore } from './vendors-store';

@Injectable({
  providedIn: 'root'
})
export class VendorsFacadeService {

  constructor(
    private vendorsService: VendorsService,
    private userService: UserService,
    private store: VendorsStore,
    private requestVendorsStore: VendorsRequestStore,
    private ticketService: TicketService,
    private restApi: ApiDataService,
    private discountsService: DiscountsService,
  ) { }

  isCurrentUserLocation(): boolean {
    return !!(this.userService.activeUserValue.latitude && this.userService.activeUserValue.longitude);
  }

  getUserLocation(): any {
    const userCurrentLocation: Town = {
      townName: 'My location',
      longitude: this.userService.activeUserValue.longitude,
      latitude: this.userService.activeUserValue.latitude,
    };
    const userOfficeLocation: Town = {
      townName: 'My Office Location',
      longitude: this.userService.activeUserValue.officeLongitude,
      latitude: this.userService.activeUserValue.officeLatitude,
    };
    return this.isCurrentUserLocation()
      ? [userCurrentLocation, userOfficeLocation]
      : [userOfficeLocation];
  }

  ifLocationDefined(): boolean {
    return (this.requestVendorsStore.value.request.location.latitude && this.requestVendorsStore.value.request.location.longitude);
  }

  loadData(vendorId): Observable<any> {
    if (!this.ifLocationDefined()) {
      const user: ActiveUser = this.userService.activeUserValue;
      const location = {
        townName: 'My location',
        latitude: user.latitude ? user.latitude : user.officeLatitude,
        longitude: user.longitude ? user.longitude : user.officeLongitude,
      };
      this.requestVendorsStore.set('location', location);
    }
    return forkJoin(this.getSorts(), this.getTowns()).pipe(
      switchMap(() => {
        return this.loadVendorsData(vendorId);
      })
    );
  }

  getTowns(): Observable<Town[]> {
    return this.discountsService.getTowns()
      .pipe(
        map(towns => [...this.getUserLocation(), ...towns]),
        tap(towns => this.store.set('towns', towns))
      );
  }

  getSorts(): Observable<Sort[]> {
    return of(SORTS)
      .pipe(
        tap(sorts => this.store.set('sorts', sorts))
      );
  }

  getVendor(vendorId): Observable<any> {
    return this.vendorsService.getVendorById(vendorId)
      .pipe(
        map(vendor => {
          const parseSocials = vendor.socialLinks ? JSON.parse(vendor.socialLinks) : '';
          return {
            ...vendor,
            socialLinks: Object
              .keys(parseSocials)
              .filter(value => !!parseSocials[value])
              .map(key => ({name: key, path: parseSocials[key]}))
          };
        }),
        tap(vendor => this.store.set('activeVendor', vendor)),
      );
  }

  getVendors(): Observable<any> {
    return this.vendorsService.getVendors().pipe(
      tap(vendors => this.store.set('vendors', vendors))
    );
  }

  getVendorDiscounts(vendorId, reqOpt): Observable<any> {
    return this.vendorsService.getVendorsDiscounts(vendorId, reqOpt).pipe(
      tap(discounts => this.store.set('vendorDiscounts', discounts))
    );
  }

  loadVendorsData(vendorId): Observable<any> {
    return this.requestVendorsStore.requestData$
      .pipe(
        switchMap((request) => {
          const reqOpt = {
            ...request,
            sortBy: request.sortBy.sortBy,
            latitude: request.location.latitude,
            longitude: request.location.longitude,
          };
          return forkJoin(
            this.getVendor(vendorId),
            this.getVendors(),
            this.getVendorDiscounts(vendorId, reqOpt)
          );
        })
      );
  }

  requestTicket(discountId, ref): void {
    this.restApi.getTicket(discountId)
      .subscribe(ticket => {
        this.ticketService.createTicket(ticket, ref);
      });
  }

  toggleFavourites(discountId): Observable<any> {
    return this.discountsService.updateIsSavedDiscount(discountId);
  }
}