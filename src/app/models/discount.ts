export interface Discount {
  discountId: number;
  vendorId: number;
  discountName: string;
  vendorName: string;
  distanceInMeters: number;
  discountRating: number;
  vendorRating: number;
  discountAmount: number;
  endDate: Date;
  isSaved: boolean;
}
