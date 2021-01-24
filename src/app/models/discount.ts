export interface Discount {
  id?: number;
  name?: string;
  description?: string;
  discountAmount?: number;
  startDate?: Date;
  endDate?: Date;
  activityStatus?: boolean;
  promoCode?: string;
  imagePath?: string;
}
