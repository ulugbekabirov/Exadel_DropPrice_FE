import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountsService } from '../../../services/discounts.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ActiveUser, Discount, LocationCoords, Tag, Town, Vendor } from '../../../models';
import { SORT_BY } from '../../../../constants';
import { TicketService } from '../../../services/ticket.service';
import { RefDirective } from '../../../directives/ref.directive';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit, OnDestroy {
  sortBy = SORT_BY;
  activeUser: ActiveUser;
  tags: Tag[];
  towns: Town[];
  vendor: Vendor;
  activeUser$: Observable<ActiveUser>;
  activeCoords: LocationCoords;
  private unsubscribe$ = new Subject<void>();
  private vendorRating;
  vendors: Vendor[];
  vendors$: Observable<Vendor[]>;
  reqOpt = {
    skip: 0,
    take: 10,
    longitude: 23.8026752,
    latitude: 53.68,
    sortBy: 'DistanceAsc',
  };
  vendorDiscounts;
  selectedValue = null;
  foodControl;

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discountsService: DiscountsService,
    private ticketService: TicketService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {

    this.vendors$ = this.discountsService.getVendors();
    const towns$ = this.discountsService.getTowns();
    const tags$ = this.discountsService.getTags(0, 10);
    this.route.paramMap
      .pipe(
        switchMap((params): any => {

          // return this.discountsService.getVendorById(+params.get('id'));
          return forkJoin(
            this.discountsService.getVendorById(+params.get('id')),
            this.vendors$,
            towns$,
            this.discountsService.getVendorsDiscounts(+params.get('id'), this.reqOpt)
          );
        }),
        tap(([vendor, vendors, towns, vendDisc]) => {
          console.log(vendor);
          console.log(vendors);
          console.log(towns);
          console.log(vendDisc);
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(([vendor, vendors, towns, vendDisc]) => {
      if (!vendor) {
        return;
      }
      this.vendor = vendor;
      this.vendors = vendors;
      this.towns = towns;
      this.foodControl = new FormControl(this.vendor.vendorName);
      this.selectedValue = vendor;
      this.vendorDiscounts = vendDisc;
      console.log(this.vendor);
    });
  }

  selectVendor({value}: any): void {
    console.log(value);
    if (!value) {
      return;
    }
    forkJoin(
      this.discountsService.getVendorById(value),
      this.discountsService.getVendorsDiscounts(value, this.reqOpt)
    )
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(([vendor, discounts]) => {
        this.vendorDiscounts = discounts;
        this.vendor = vendor;
      });
  }

  changeCoords(): void {
    this.userService.getLocation()
      .then(res => {
        this.reqOpt.latitude = res.latitude;
        this.reqOpt.longitude = res.longitude;
      }).then(res => {
      this.discountsService.getVendorsDiscounts(this.vendor.vendorId, this.reqOpt).pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe(data => this.vendorDiscounts = data);
    });
  }

  changeFavourites(discountId: any): void {
    this.discountsService.updateIsSavedDiscount(discountId).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(resp => {
        this.vendorDiscounts = this.vendorDiscounts.map((discount: Discount) => {
          return discount.discountId === resp.discountID
            ? {...discount, isSaved: resp.isSaved}
            : {...discount};
        });
      });
  }

  onSortChange({value: {sortBy}}): void {
    this.reqOpt.sortBy = sortBy;
    this.discountsService.getVendorsDiscounts(this.vendor.vendorId, this.reqOpt).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(res => this.vendorDiscounts = res);
  }

  getTicket(discountId: number): void {
    this.ticketService.getTicket(discountId, this.refDir);
  }

  onLocationChange({value: {latitude, longitude}}): void {
    this.reqOpt.latitude = latitude;
    this.reqOpt.longitude = longitude;
    console.log(this.vendor.vendorId);
    console.log(this.reqOpt);
    this.discountsService.getVendorsDiscounts(this.vendor.vendorId, this.reqOpt).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(res => this.vendorDiscounts = res);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
