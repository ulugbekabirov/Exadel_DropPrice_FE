export interface Ticket {
  firstName: string;
  lastName: string;
  patronymic?: string;
  discountName: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  discountAmount: number;
  orderDate: Date;
  promoCode?: string;
  isExpired: boolean;
  discountActivity: boolean;
  discountId: number;
  vendorId: number;
  isSavedDiscount: boolean;
  discountAvailable?: boolean;
}
