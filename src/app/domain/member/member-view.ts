import { User } from "../interfaces/iuser";

export class MemberView implements User{
    id: number;
    lastName: string;
    name: string;
    birthDate: string;
    phone: string;
    socialSecurity: string;
    address: string;
    emergencyPhone: string;
    emergencyContact: string;
    instagram: string;
    facebook: string;
    planId: number;
    email: string;
    planType: number;
    creditId: number;
    credit: number;
    expiration: string;
    negative: number;
    status: string;
  }
