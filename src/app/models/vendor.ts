export interface Vendor {
  vendorId: number;
  vendorName: string;
  address: string;
  descriptionVendor: string;
  email: string;
  phone: string;
  socialLinks: {
    instagram: string,
    facebook: string,
    website:  string,
    otherSocialLink: string,
  },
 
  vendorRating: number;
  ticketCount: number;
}
