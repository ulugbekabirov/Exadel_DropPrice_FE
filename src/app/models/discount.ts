export interface Discount {
  discountId: number;
  vendorId: number;
  discountName: string;
  vendorName: string;
  description: string;
  distanceInMeters: number;
  discountRating: number;
  discountAmount: number;
  startDate: Date;
  endDate: Date;
  promoCode?: string;
  activityStatus: boolean;
  isSaved: boolean;
  isOrdered: boolean;
  address: string;
  tags: string[];
}
