export interface ActiveUser {
  roles: string[];
  officeLatitude?: number;
  officeLongitude?: number;
  latitude?: number;
  longitude?: number;
  fio: string;
  phone: string;
  email: string;
  office: string;
  defaultLanguage: string;
}
