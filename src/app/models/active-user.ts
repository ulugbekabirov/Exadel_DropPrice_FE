export interface ActiveUser {
  id?: number;
  email?: string;
  roles: string[];
  latitude?: number;
  longitude?: number;
  userLatitude: number;
  userLongitude: number;
}
