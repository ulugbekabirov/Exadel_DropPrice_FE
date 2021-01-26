import { Role } from "./role";

export class ActiveUser {
  id?: number;
  Role: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  patronomic?: string;
  phone?: string;
  activeStatus?: boolean;
  latitude?: number;
  longitude?: number;
}
