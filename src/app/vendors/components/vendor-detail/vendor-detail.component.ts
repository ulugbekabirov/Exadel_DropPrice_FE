import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PointOfSales } from '../../../models/point-of-sales';
import { Sort } from '../../../models/sort';
import { Observable, Subject } from 'rxjs';
import { Discount, Town, Vendor } from '../../../models';
import { TownsService } from '../../../services/towns/towns.service';
import { RefDirective } from '../../../directives/ref/ref.directive';
import { VendorsFacadeService } from '../../services/vendors-facade.service';
import { VendorsRequestStore } from '../../services/vendors-request-store';
import { VendorsStore } from '../../services/vendors-store';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  panelOpenState = false;

  vendor$: Observable<Vendor>;
  vendorsList$: Observable<Vendor[]>;
  vendorDiscounts$: Observable<Discount[]>;
  vendorId: number;
  towns$: Observable<Town[]>;
  sorts$: Observable<Sort[]>;
  sortBySelected$: Observable<Sort>;
  locationSelected$: Observable<Town>;
  pointsOfSales$: Observable<PointOfSales[]>;
  vendorSelect = new FormControl();
  private unsubscribe$ = new Subject<void>();
  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private facade: VendorsFacadeService,
    private store: VendorsStore,
    private sortStore: VendorsRequestStore,
    private location: Location,
    private townsService: TownsService
  ) {
    this.vendor$ = this.store.select('activeVendor');
    this.vendorsList$ = this.store.select('vendors');
    this.towns$ = this.townsService.select('towns');
    this.sorts$ = this.store.select('sorts');
    this.vendorDiscounts$ = this.store.select('vendorDiscounts');
    this.locationSelected$ = this.sortStore.select('location');
    this.sortBySelected$ = this.sortStore.select('sortBy');
    this.pointsOfSales$ = this.store.select('pointsOfSales');
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap): Observable<any> => {
          this.vendorId = +params.get('id');
          return this.facade.loadData(this.vendorId);
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
    this.vendorSelect.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(vendorId => {
        this.selectVendor(vendorId);
      });
  }

  onEditVendor(vendorId: number): void {
    this.router.navigate(['add-new/vendors/edit', vendorId]);
  }

  selectVendor(vendorId: any): void {
    if (!vendorId) {
      return;
    }
    this.router.navigate(['/vendors', vendorId]);
  }

  changeFavourites(discountId: any): void {
    this.facade.toggleFavourites(discountId)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(resp => {
      const value: Discount[] = this.store.value.vendorDiscounts;
      const discounts = value.map((discount: Discount) => {
        return discount.discountId === resp.discountID
          ? {...discount, isSaved: resp.isSaved}
          : {...discount};
      });
      this.store.set('vendorDiscounts', discounts);
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSortChange(sortBy): void {
    this.sortStore.set('sortBy', sortBy);
  }

  getTicket(discountId: number): void {
    this.facade.requestTicket(discountId, this.refDir);
  }

  onLocationChange(location): void {
    this.sortStore.set('location', location);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.store.set('activeVendor', {});
  }
}
