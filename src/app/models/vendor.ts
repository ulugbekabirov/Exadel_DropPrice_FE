export interface Vendor {
  vendorId: number;
  vendorName: string;
  address: string;
  description: string;
  email: string;
  phone: string;
  socialLinks: {
    instagram: string,
    facebook: string,
    website: string,
    otherSocialLink: string,
  } | string;
  vendorRating: number;
  ticketCount: number;
}
