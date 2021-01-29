export interface Discount {
  discountId: number;
  vendorId: number;
  discountName: string;
  vendorName: string;
  discountMetres: number;
  discountRating: number;
  discountAmount: number;
  endDate: Date;
  isSaved: boolean;
}
