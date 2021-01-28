export interface Ticket {

  firstName: string;
  lastName: string;
  patronymic?: string;
  nameDiscount: string;
  nameVendor: string;
  email: string;
  phone: string;
  discountAmount: number;
  endDate: Date;
  promoCode?: string;
}
