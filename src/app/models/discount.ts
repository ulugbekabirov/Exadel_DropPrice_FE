export interface Discount {
  discountId: number;
  vendorId: number;
  discountName: string;
  vendorName: string;
  distance: number;
  discountRating: number;
  vendorRating: number;
  discountAmount: number;
  endDate: Date;
  isSaved: boolean;
}
